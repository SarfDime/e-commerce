import { PrismaService } from "../../prisma/prisma.service"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from '@nestjs/testing'
import { ProductService } from "./product.service"

describe('ProductService', () => {
    let service: ProductService;
    let prismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: PrismaService,
                    useValue: {
                        product: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile()

        service = module.get<ProductService>(ProductService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getProducts', () => {
        it('should return all products if no ID is provided', async () => {
            const mockProducts = [{ id: '1', name: 'Laptop', price: 999, status: 'active' }]
            prismaService.product.findMany.mockResolvedValue(mockProducts)
            expect(await service.getProducts(null)).toEqual(mockProducts)
        })

        it('should return a single product if ID is provided', async () => {
            const mockProduct = { id: '1', name: 'Laptop', price: 999, status: 'active' }
            prismaService.product.findFirst.mockResolvedValue(mockProduct)
            expect(await service.getProducts('1')).toEqual(mockProduct)
        })

        it('should throw BadRequestException if product does not exist', async () => {
            prismaService.product.findFirst.mockResolvedValue(null)
            await expect(service.getProducts('nonexistent')).rejects.toThrow(BadRequestException)
        })
    })

    describe('createProduct', () => {
        it('should create a new product and return success message', async () => {
            const mockProductDto = { name: 'New Laptop', price: 1200, status: 'active' }
            const mockProduct = { id: '2', ...mockProductDto }
            prismaService.product.create.mockResolvedValue(mockProduct)
            expect(await service.createProduct(mockProductDto)).toEqual(`Product ${mockProduct.id} created successfully`)
        })
    })

    describe('updateProduct', () => {
        it('should update a product and return success message', async () => {
            const mockUpdateDto = { name: 'Updated Laptop', price: 1300 }
            const productId = '2'
            prismaService.product.findFirst.mockResolvedValue({ id: productId })
            prismaService.product.update.mockResolvedValue({ id: productId, ...mockUpdateDto })
            expect(await service.updateProduct(mockUpdateDto, productId)).toEqual(`Product ${productId} updated successfully`)
        })

        it('should throw BadRequestException if product does not exist', async () => {
            const mockUpdateDto = { name: 'Updated Laptop', price: 1300 }
            const productId = 'nonexistent'
            prismaService.product.findFirst.mockResolvedValue(null)
            await expect(service.updateProduct(mockUpdateDto, productId)).rejects.toThrow(BadRequestException)
        })
    })

    describe('deleteProduct', () => {
        it('should delete a product and return success message', async () => {
            const productId = '2'
            prismaService.product.findFirst.mockResolvedValue({ id: productId })
            prismaService.product.delete.mockResolvedValue({ count: 1 })
            expect(await service.deleteProduct(productId)).toEqual(`Product ${productId} deleted successfully`)
        })

        it('should throw BadRequestException if product does not exist', async () => {
            const productId = 'nonexistent'
            prismaService.product.findFirst.mockResolvedValue(null)
            await expect(service.deleteProduct(productId)).rejects.toThrow(BadRequestException)
        })
    })
})

