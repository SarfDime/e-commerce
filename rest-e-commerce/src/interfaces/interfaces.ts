export interface routeParamsID {
    id: string;
}

export interface ProductInterface {
    id: string;
    name: string;
    price: number;
    status: string;
    images: ImageInterface[]
}

export interface ImageInterface {
    id: string;
    url: string;
    priority: number;
    product: ProductInterface
}