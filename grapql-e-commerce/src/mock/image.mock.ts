import { Image } from "../image/image.entity";
import { Product } from "../product/product.entity";

export const testImages: Image[] = [
    {
        id: '1',
        url: 'http://example.com/image1.jpg',
        priority: 1,
        product: {
            id: 'product1',
            name: 'Product 1',
            price: 100,
            status: 'active',
            images: []
        } as Product
    },
    {
        id: '2',
        url: 'http://example.com/image2.jpg',
        priority: 2,
        product: {
            id: 'product2',
            name: 'Product 2',
            price: 200,
            status: 'active',
            images: []
        } as Product
    }
];

export const testImage: Image = {
    id: '3',
    url: 'http://example.com/image3.jpg',
    priority: 3,
    product: {
        id: 'product3',
        name: 'Product 3',
        price: 300,
        status: 'active',
        images: []
    } as Product
};
