import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const TransactionData = new Schema({
    hashTransaction: {
        type: String,
        minlength: 64,
    },
    gasUsed: {
        type: String,

    },
    from: {
        type: String,
    },
    to: {
        type: String,

    },
    block_confirmations: {
        type: String,

    },
    block_number: {
        type: String,

    },
    value: {
        type: String,

    },
    timestamp: {
        type: String,
    },
    gasLimit: {
        type: String
    }


})

TransactionData.plugin(mongoosePaginate);
export default mongoose.model('TransactionData', TransactionData)

