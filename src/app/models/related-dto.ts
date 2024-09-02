export interface RelatedDto {
    id: number;
    name: string;
    categoryName: string;
}

export interface RelatedResponse {
    lstData: RelatedDto[];
    rowsCount: number;
}

export interface CategoryResponse {
    lstData: CategoryDto[];
    rowsCount: number;
}

export interface CategoryDto {
    id: number;
    name: string;
}