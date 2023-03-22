import express from 'express'
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from 'cors'
import {getTransactionsInfo} from "./Controllers/getTransactionsInfo.js";
import morgan from "morgan";
import {getDataFromApi} from "./services/getDataFromApi.js";

const app = express();


const PORT = process.env.PORT || 8080

async function start() {
    try {
        app.listen(PORT, () => {
            try {
                mongoose.connect('mongodb+srv://admin:qwerty12@cluster0.lxq65ei.mongodb.net/TransactionData?retryWrites=true&w=majority')
                    .then(() => {
                        console.log('Database started OK')
                        getDataFromApi()
                    })
                console.log(`Server is running on port ${PORT}`)
            } catch (err) {
                console.log('Database abort' + err)
            }
        })
    } catch (err) {
        console.log('Error listen port', err)
    }
}

start();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


const corsOptions = {
    origin: '*',
    credentials: true,
};
app.use(cors(corsOptions));

app.get('/api/transaction_info', async function (req, res) {
    await getTransactionsInfo(req, res)
});