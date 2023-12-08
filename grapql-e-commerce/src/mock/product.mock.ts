import { Product } from "../product/product.entity"
import { testImage, testImages } from "./image.mock"

export const testProducts: Product[] = [
    {
        id: '1',
        name: 'Product 1',
        price: 100,
        status: 'active',
        images: testImages
    },
    {
        id: '2',
        name: 'Product 2',
        price: 200,
        status: 'inactive',
        images: [testImage]
    }
];

export const testProduct: Product = {
    id: '3',
    name: 'Product 3',
    price: 300,
    status: 'active',
    images: testImages
};
