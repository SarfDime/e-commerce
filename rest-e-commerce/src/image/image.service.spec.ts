import { Test, TestingModule } from '@nestjs/testing'
import { ImageService } from './image.service'
import { PrismaService } from '../../prisma/prisma.service'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { mockImageArray } from '../mock/mock.image'
import { mockProduct } from '../mock/mock.product'

describe('ImageService', () => {
    let service: ImageService
    let prismaService: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageService, PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue({
                image: {
                    findMany: jest.fn().mockResolvedValue(mockImageArray),
                    findFirst: jest.fn().mockImplementation((params) => {
                        return Promise.resolve(mockImageArray.find(i => i.id === params.where.id))
                    }),
                    create: jest.fn().mockImplementation((params) => {
                        return Promise.resolve({ id: 'new-image-id', ...params.data })
                    }),
                    update: jest.fn().mockImplementation((params) => {
                        return Promise.resolve({ ...params.data })
                    }),
                    delete: jest.fn().mockImplementation((params) => {
                        const foundIndex = mockImageArray.findIndex(i => i.id === params.where.id)
                        if (foundIndex > -1) {
                            mockImageArray.splice(foundIndex, 1)
                            return Promise.resolve({ count: 1 })
                        }
                        return Promise.resolve({ count: 0 })
                    }),
                },
                product: {
                    findFirst: jest.fn().mockImplementation((params) => {
                        return Promise.resolve(params.where.id === mockProduct.id ? mockProduct : null)
                    }),
                },
            })
            .compile()

        service = module.get<ImageService>(ImageService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getImages', () => {
        it('should return all images if no ID is provided', async () => {
            expect(await service.getImages(null)).toEqual(mockImageArray)
        })

        it('should return a single image if ID is provided', async () => {
            const image = mockImageArray[0]
            expect(await service.getImages(image.id)).toEqual(image)
        })

        it('should throw NotFoundException if no image is found with provided ID', async () => {
            await expect(service.getImages('non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('createImage', () => {
        it('should create a new image and return success message', async () => {
            const imageDto = { url: 'http://example.com/image.jpg', priority: 1 }
            expect(await service.createImage(imageDto, mockProduct.id)).toContain('created successfully')
        })

        it('should throw BadRequestException if product ID is not provided', async () => {
            const imageDto = { url: 'http://example.com/image.jpg', priority: 1 }
            await expect(service.createImage(imageDto, null)).rejects.toThrow(BadRequestException)
        })

        it('should throw BadRequestException if image URL is not provided', async () => {
            const imageDto = { priority: 1 }
            await expect(service.createImage(imageDto as any, mockProduct.id)).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException if no product is found with provided ID', async () => {
            const imageDto = { url: 'http://example.com/image.jpg', priority: 1 }
            await expect(service.createImage(imageDto, 'non-existing-product-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateImage', () => {
        it('should update an existing image and return success message', async () => {
            const imageDto = { url: 'http://example.com/updated-image.jpg', priority: 2 }
            const image = mockImageArray[0]
            expect(await service.updateImage(imageDto, image.id)).toContain('updated successfully')
        })

        it('should throw BadRequestException if image ID is not provided', async () => {
            const imageDto = { url: 'http://example.com/updated-image.jpg', priority: 2 }
            await expect(service.updateImage(imageDto, null)).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException if no image is found with provided ID', async () => {
            const imageDto = { url: 'http://example.com/updated-image.jpg', priority: 2 }
            await expect(service.updateImage(imageDto, 'non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })

    describe('deleteImage', () => {
        it('should delete an existing image and return success message', async () => {
            const image = mockImageArray[0]
            expect(await service.deleteImage(image.id)).toContain('deleted successfully')
        })

        it('should throw BadRequestException if image ID is not provided', async () => {
            await expect(service.deleteImage(null)).rejects.toThrow(BadRequestException)
        })

        it('should throw NotFoundException if no image is found with provided ID', async () => {
            await expect(service.deleteImage('non-existing-id')).rejects.toThrow(NotFoundException)
        })
    })
})
