import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from './product.service'
import { PrismaService } from "../../prisma/prisma.service"
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { mockProductArray } from '../mock/mock.product'

describe('ProductService', () => {
    let service: ProductService
    let prismaService: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue({
                product: {
                    findMany: jest.fn().mockResolvedValue(mockProductArray),
                    findFirst: jest.fn().mockImplementation((params) => {
                        return Promise.resolve(mockProductArray.find(p => p.id === params.where.id))
                    }),
                    create: jest.fn().mockImplementation((params) => {
                        return Promise.resolve({ id: 'some-unique-id', ...params.data })
                    }),
                    update: jest.fn().mockImplementation((params) => {
                        return Promise.resolve({ ...params.data })
                    }),
                    delete: jest.fn().mockImplementation((params) => {
                        const foundIndex = mockProductArray.findIndex(p => p.id === params.where.id)
                        if (foundIndex > -1) {
                            mockProductArray.splice(foundIndex, 1)
                            return Promise.resolve({ count: 1 })
                        }
                        return Promise.resolve({ count: 0 })
                    }),
                },
            })
            .compile()

        service = module.get<ProductService>(ProductService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getProducts', () => {
        it('should return all products if no ID is provided', async () => {
            expect(await service.getProducts(null)).toEqual(mockProductArray)
        })

        it('should return a single product if ID is provided', async () => {
            const product = mockProductArray[0]
            expect(await service.getProducts(product.id)).toEqual(product)
        })

        it('should throw NotFoundException if no product is found with provided ID', async () => {
            await expect(service.getProducts('non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('createProduct', () => {
        it('should throw BadRequestException if product name is undefined', async () => {
            const productDtoWithNoName: any = { price: 100, status: 'active' }
            await expect(service.createProduct(productDtoWithNoName)).rejects.toThrow(BadRequestException)
        })

        it('should throw BadRequestException if product price is undefined', async () => {
            const productDtoWithNoPrice: any = { name: 'Product', status: 'active' }
            await expect(service.createProduct(productDtoWithNoPrice)).rejects.toThrow(BadRequestException)
        })
    })

    describe('updateProduct', () => {
        it('should update an existing product and return success message', async () => {
            const productDto = { name: 'Updated Product', price: 150 }
            const product = mockProductArray[0]
            expect(await service.updateProduct(productDto, product.id)).toContain('updated successfully')
        })

        it('should throw BadRequestException if product ID is not provided', async () => {
            const productDto = { name: 'Updated Product', price: 150 }
            await expect(service.updateProduct(productDto, null)).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException if no product is found with provided ID', async () => {
            const productDto = { name: 'Updated Product', price: 150 }
            await expect(service.updateProduct(productDto, 'non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('deleteProduct', () => {
        it('should delete an existing product and return success message', async () => {
            const product = mockProductArray[0]
            expect(await service.deleteProduct(product.id)).toContain('deleted successfully')
        })

        it('should throw BadRequestException if product ID is not provided', async () => {
            await expect(service.deleteProduct(null)).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException if no product is found with provided ID', async () => {
            await expect(service.deleteProduct('non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })
})

