export interface RelatedDto {
    id: number;
    name: string;
    categoryName: string;
}

export interface RelatedResponse {
    lstData: RelatedDto[];
    rowsCount: number;
}