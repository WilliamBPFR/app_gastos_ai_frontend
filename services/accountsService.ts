import { apiRequest } from "@/axiosConfig/apiRequest";
import {
    AccountBase,
    AccountGetAllResponseModel,
    AccountTypeBase
} from "@/types/account_types"

interface GetAccountRequest {
    page_number?: number;
    page_size?: number;
    account_name?: string;
    status?: boolean;
}

export const accountsService = {
    getAllAccounts: async (params: GetAccountRequest) => {
        return apiRequest<AccountGetAllResponseModel, void>({
            method: "GET",
            url: `/accounts/get-all`,
            params
        });
    },
    deactivateAccount: async (accountId: string | number) => {
        return apiRequest<void, void>({
            method: "PUT",
            url: `/accounts/deactivate/${accountId}`
        });
    },
    activateAccount: async (accountId: string | number) => {
        return apiRequest<void, void>({
            method: "PUT",
            url: `/accounts/activate/${accountId}`
        });
    },
    getAccountTypes: async () => {
        return apiRequest<AccountTypeBase[], void>({
            method: "GET",
            url: `/accounts/accountstypes/get-all`
        });
    },
    createAccount: async (accountData: AccountBase) => {
        return apiRequest<void, AccountBase>({
            method: "POST",
            url: `/accounts/create`,
            data: accountData
        });
    },
    updateAccount: async (accountId: string | number, accountData: AccountBase) => {
        return apiRequest<void, AccountBase>({
            method: "PUT",
            url: `/accounts/update/${accountId}`,
            data: accountData
        });
    }
}