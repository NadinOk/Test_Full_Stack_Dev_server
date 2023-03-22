import BlockNumbers from "../Models/BlockNumbers.js";

export default async function getBlockServices() {
    return BlockNumbers.findOne();
}