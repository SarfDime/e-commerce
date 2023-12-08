import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { Product } from './product.entity'
import { testProduct, testProducts } from '../mock/product.mock'

describe('ProductService', () => {
    let service: ProductService
    let productRepository: Repository<Product>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useClass: Repository,
                },
            ],
        }).compile()

        service = module.get<ProductService>(ProductService)
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getProducts', () => {
        it('should return an array of products', async () => {
            jest.spyOn(productRepository, 'find').mockResolvedValue(testProducts)
            expect(await service.getProducts()).toBe(testProducts)
        })

        it('should throw NotFoundException if no products found', async () => {
            jest.spyOn(productRepository, 'find').mockResolvedValue([])
            await expect(service.getProducts()).rejects.toThrow(NotFoundException)
        })
    })

    describe('getProduct', () => {
        it('should return a single product by id', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(testProduct)
            expect(await service.getProduct('3')).toBe(testProduct)
        })

        it('should throw NotFoundException if product not found', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined)
            await expect(service.getProduct('non-existent-id')).rejects.toThrow(NotFoundException)
        })

        it('should throw BadRequestException if no id provided', async () => {
            await expect(service.getProduct('')).rejects.toThrow(BadRequestException)
        })
    })

    describe('getImagesForProduct', () => {
        it('should return an array of images for a product', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(testProduct)
            expect(await service.getImagesForProduct('3')).toBe(testProduct.images)
        })

        it('should throw NotFoundException if product not found', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined)
            await expect(service.getImagesForProduct('non-existent-id')).rejects.toThrow(NotFoundException)
        })

        it('should throw BadRequestException if no productId provided', async () => {
            await expect(service.getImagesForProduct('')).rejects.toThrow(BadRequestException)
        })
    })

    describe('createProduct', () => {
        it('should create a new product and return it', async () => {
            const createProductDto = { name: 'New Product', price: 100, status: 'active' }
            jest.spyOn(productRepository, 'create').mockReturnValue(testProduct)
            jest.spyOn(productRepository, 'save').mockResolvedValue(testProduct)
            expect(await service.createProduct(createProductDto)).toBe(testProduct)
        })
    })

    describe('updateProduct', () => {
        it('should update a product and return the updated product', async () => {
            const updateProductDto = { name: 'Updated Product' }
            const updateResult: UpdateResult = {
                affected: 1,
                raw: {},
                generatedMaps: []
            }
            jest.spyOn(productRepository, 'update').mockResolvedValue(updateResult)
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(testProduct)
            expect(await service.updateProduct('product-id', updateProductDto)).toBe(testProduct)
        })
    })

    describe('removeProducts', () => {
        it('should remove products and return a success message', async () => {
            const ids = ['product-id-1', 'product-id-2']
            const deleteResult: DeleteResult = {
                affected: ids.length,
                raw: {}
            }
            jest.spyOn(productRepository, 'delete').mockResolvedValue(deleteResult)
            expect(await service.removeProducts(ids)).toBe(`${ids.length} Products have been removed`)
        })
    })
})

