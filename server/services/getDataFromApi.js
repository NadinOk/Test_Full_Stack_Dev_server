import axios from "axios";
import rateLimit from 'axios-rate-limit'
import TransactionData from "../Models/TransactionData.js";
import BlockNumbers from "../Models/BlockNumbers.js";
import cliProgress from "cli-progress";
import getBlockServices from "./getBlockServices.js";

const api = rateLimit(axios.create(), {maxRequests: 3, perMilliseconds: 1000});

const getAndSaveBlockData = async (blockNumber, currentBlockNumber) => {
    if (currentBlockNumber - blockNumber < 9) {
        await getAndSaveBlockData(blockNumber - 1, currentBlockNumber)
    }
    const blockResponse = await api.get(`https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=0x${blockNumber.toString(16)}&boolean=false&apikey=NF68PW9MP8XPC31E1VAJ1DJSAFVIVKXZR1`)
    // create a block
    await new BlockNumbers({
        block_number: blockResponse.data.result?.number,
        transactions: blockResponse.data.result?.transactions,
        size: blockResponse.data.result?.size,
    }).save()
    // get detailed transactions for block
    const transactionLoader = new cliProgress.SingleBar({
        format: ' {bar} {percentage}% | {filename} | ETA: {eta}s | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591'
    }, cliProgress.Presets.shades_grey);
    transactionLoader.start(blockResponse.data.result.transactions.length, 0,)
    for (let item of blockResponse.data.result.transactions) {
        const transaction = await api.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${item}&apikey=NF68PW9MP8XPC31E1VAJ1DJSAFVIVKXZR1`);
        await new TransactionData({
            hashTransaction: transaction.data.result?.hash,
            gasUsed: transaction.data.result?.gas,
            from: transaction.data.result?.from,
            to: transaction.data.result?.to,
            block_number: transaction.data.result?.blockNumber,
            timestamp: blockResponse.data.result?.timestamp,
            value: transaction.data.result?.value,
            gasLimit: transaction.data.result?.gasPrice,
        }).save()
        transactionLoader.update(
            blockResponse.data.result.transactions.indexOf(item) + 1,
            {filename: `transactions from block: 0x${blockNumber.toString(16)}`}
        );
    }
    transactionLoader.stop()
}

export const getDataFromApi = async () => {
    const dataDB = await getBlockServices()
    if (dataDB) {
        console.log('db is not empty')
        return
    }
    const currentBlock = await api.get(`https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=NF68PW9MP8XPC31E1VAJ1DJSAFVIVKXZR1`)
    let currentBlockNumber = parseInt(currentBlock.data.result.split('0x')[1], 16);
    console.log('Fetching last 10 blocks with transactions')
    await getAndSaveBlockData(currentBlockNumber, currentBlockNumber);
    console.log('Database updated')
}

