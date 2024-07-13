export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    colors: string[];
    sizes: string[];
    images: [];
}