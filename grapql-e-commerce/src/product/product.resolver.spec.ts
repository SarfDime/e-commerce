import { Test, TestingModule } from '@nestjs/testing'
import { ProductResolver } from './product.resolver'
import { ProductService } from './product.service'
import { ProductType } from './product.type'
import { CreateProductInput, UpdateProductInput } from './product.dtos'
import { Product } from './product.entity'
import { ImageType } from '../image/image.type'

describe('ProductResolver', () => {
    let resolver: ProductResolver
    let productService: ProductService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductResolver,
                {
                    provide: ProductService,
                    useValue: {
                        getProducts: jest.fn(),
                        getProduct: jest.fn(),
                        createProduct: jest.fn(),
                        updateProduct: jest.fn(),
                        removeProducts: jest.fn(),
                        getImagesForProduct: jest.fn(),
                    },
                },
            ],
        }).compile()

        resolver = module.get<ProductResolver>(ProductResolver)
        productService = module.get<ProductService>(ProductService)
    })

    it('should return an array of products', async () => {
        const expectedProducts: ProductType[] = [
            {
                id: 'product-id-1',
                name: 'Product 1',
                price: 100,
                status: 'active',
                images: [],
            },
            {
                id: 'product-id-2',
                name: 'Product 2',
                price: 200,
                status: 'inactive',
                images: [],
            },
        ]

        jest.spyOn(productService, 'getProducts').mockResolvedValue(expectedProducts)

        expect(await resolver.products()).toEqual(expectedProducts)
        expect(productService.getProducts).toHaveBeenCalled()
    })

    it('should return a single product by id', async () => {
        const productId = 'product-id-1'
        const expectedProduct: ProductType = {
            id: productId,
            name: 'Product 1',
            price: 100,
            status: 'active',
            images: [],
        }

        jest.spyOn(productService, 'getProduct').mockResolvedValue(expectedProduct)

        expect(await resolver.product(productId)).toEqual(expectedProduct)
        expect(productService.getProduct).toHaveBeenCalledWith(productId)
    })

    it('should create a product', async () => {
        const productInput: CreateProductInput = {
            name: 'New Product',
            price: 50,
            status: 'active',
        }
        const expectedProduct: ProductType = {
            id: 'product-id-new',
            name: 'New Product',
            price: 50,
            status: 'active',
            images: [],
        }

        jest.spyOn(productService, 'createProduct').mockResolvedValue(expectedProduct)

        expect(await resolver.createProduct(productInput)).toEqual(expectedProduct)
        expect(productService.createProduct).toHaveBeenCalledWith(productInput)
    })

    it('should update a product', async () => {
        const productId = 'product-id-1'
        const updateProductInput: UpdateProductInput = {
            name: 'Updated Product',
            price: 150,
            status: 'inactive',
        }
        const updatedProduct: ProductType = {
            id: productId,
            name: 'Updated Product',
            price: 150,
            status: 'inactive',
            images: [],
        }

        jest.spyOn(productService, 'updateProduct').mockResolvedValue(updatedProduct)

        expect(await resolver.updateProduct(productId, updateProductInput)).toEqual(updatedProduct)
        expect(productService.updateProduct).toHaveBeenCalledWith(productId, updateProductInput)
    })

    it('should remove products by ids', async () => {
        const productIds = ['product-id-1', 'product-id-2']
        const affectedRows = productIds.length

        jest.spyOn(productService, 'removeProducts').mockResolvedValue(affectedRows)

        expect(await resolver.removeProducts(productIds)).toEqual(affectedRows)
        expect(productService.removeProducts).toHaveBeenCalledWith(productIds)
    })

    it('should return images for a product', async () => {
        const productId = 'product-id-1'
        const expectedImages: ImageType[] = [
            {
                id: 'image-id-1',
                url: 'http://example.com/image1.jpg',
                priority: 1,
                product: {
                    id: productId,
                    name: 'Product 1',
                    price: 100,
                    status: 'active',
                    images: [],
                },
            },
            {
                id: 'image-id-2',
                url: 'http://example.com/image2.jpg',
                priority: 2,
                product: {
                    id: productId,
                    name: 'Product 1',
                    price: 100,
                    status: 'active',
                    images: [],
                },
            },
        ]

        jest.spyOn(productService, 'getImagesForProduct').mockResolvedValue(expectedImages)

        expect(await resolver.images({ id: productId } as Product)).toEqual(expectedImages)
        expect(productService.getImagesForProduct).toHaveBeenCalledWith(productId)
    })
})

