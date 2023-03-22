import TransactionData from "../Models/TransactionData.js";

export default async function getTransactionsInfoServices(searchParams) {
    const options = {
        page: searchParams.page || 1,
        limit: 14,
    };
    delete searchParams.page;
    return await TransactionData.paginate(searchParams, options, function (err, result) {
        return result
    });
}
