export interface AccountTypeBase {
    account_type_id: number;
    account_type_name?: string;
}

export interface AccountBase {
    account_id?: number;
    account_name: string;
    account_description: string;
    creation_date?: string | Date;
    active?: boolean;
    account_type?: AccountTypeBase;
}

export interface AccountGetAllResponseModel {
    total_accounts: number;
    pagination_use: number;
    accounts: AccountBase[];
}