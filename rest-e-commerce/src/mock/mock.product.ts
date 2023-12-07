import { ProductInterface } from "../interfaces/interfaces"

export const mockProductArray: ProductInterface[] = [
    {
        "id": "1",
        "name": "Laptop",
        "price": 999.99,
        "status": "active",
        "images": [
            {
                "id": '1',
                "url": "http://example.com/laptop.jpg",
                "priority": 1,
                "product": {
                    "id": "1",
                    "name": "Laptop",
                    "price": 999.99,
                    "status": "active",
                    images: []
                }
            }
        ]
    },
    {
        "id": "2",
        "name": "Smartphone",
        "price": 599.99,
        "status": "inactive",
        "images": [
            {
                "id": '2',
                "url": "http://example.com/laptop.jpg",
                "priority": 2,
                "product": {
                    "id": "2",
                    "name": "Smartphone",
                    "price": 599.99,
                    "status": "inactive",
                    images: []
                }
            }
        ]
    }
]




