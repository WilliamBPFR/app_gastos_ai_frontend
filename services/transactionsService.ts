import { apiRequest } from "@/axiosConfig/apiRequest";
import {
    TransactionGetAllResponseModel,
    Transaction,
}
from "@/types/transaction_type";

interface GetAllTransactionsRequest {
    page_number?: number;
    page_size?: number;
    amount_or_source?: string;
    type?: string;
    account_id?: number;
    category_id?: number;
    source?: string;
}

export const transactionsService = {
    getTransactions: async (params: GetAllTransactionsRequest) => {
        return apiRequest<TransactionGetAllResponseModel, void>({
            method: "GET",
            url: "/transactions/get-all",
            params,
        });
    }
}