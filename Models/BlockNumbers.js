import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;

const BlockNumbers = new Schema({
    block_number: {
        type: String,
    },
    transactions: {
        type: Array,
    },
    size: {
        type: String,
    }
})
BlockNumbers.plugin(mongoosePaginate);
export default mongoose.model('BlockNumbers', BlockNumbers)