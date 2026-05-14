export interface Transaction {
    id: number;
    user_id: number;
    fecha_transaccion: Date;
    original_amount: number;
    final_amount: number;
    tipo_transaccion: string;
    account_id?: number;
    category_id?: number;
    descripcion_transaccion?: string;
    transaction_source?: string;
    created_at?: Date;
}

export interface TransactionGetAllResponseModel {
    total_transactions: number;
    pagination_use: number;
    transactions: Transaction[];
}