export interface Category {
    category_id: number;
    category_name: string;
    category_description: string;
    creation_date: Date; // ISO string format
    color?: string;
    active: boolean;
}

export interface CategoryGetAllResponse {
    total_categories: number;
    pagination_used: number;
    categories: Category[];
}