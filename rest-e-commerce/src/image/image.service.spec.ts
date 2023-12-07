import { PrismaService } from "../../prisma/prisma.service"
import { ImageService } from "./image.service"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from '@nestjs/testing'

describe('ImageService', () => {
    let service: ImageService;
    let prismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: PrismaService,
                    useValue: {
                        image: {
                            findMany: jest.fn(),
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        product: {
                            findFirst: jest.fn(),
                        },
                    },
                },
            ],
        }).compile()

        service = module.get<ImageService>(ImageService)
        prismaService = module.get<PrismaService>(PrismaService)
    })


    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getImages', () => {
        it('should return all images if no ID is provided', async () => {
            const mockImages = [{ id: '1', url: 'http://example.com/image.jpg', priority: 1 }]
            prismaService.image.findMany.mockResolvedValue(mockImages)
            expect(await service.getImages(null)).toEqual(mockImages)
        })

        it('should return a single image if ID is provided', async () => {
            const mockImage = { id: '1', url: 'http://example.com/image.jpg', priority: 1 }
            prismaService.image.findFirst.mockResolvedValue(mockImage)
            expect(await service.getImages('1')).toEqual(mockImage)
        })

        it('should throw NotFoundException if image does not exist', async () => {
            prismaService.image.findFirst.mockResolvedValue(null)
            await expect(service.getImages('nonexistent')).rejects.toThrow(BadRequestException)
        })
    })

    describe('createImage', () => {
        it('should create a new image and return success message', async () => {
            const mockImageDto = { url: 'http://example.com/new-image.jpg', priority: 1 }
            const productId = 'prod_12345'
            const mockImage = { id: 'img_67890', ...mockImageDto }
            prismaService.product.findFirst.mockResolvedValue({ id: productId })
            prismaService.image.create.mockResolvedValue(mockImage)
            expect(await service.createImage(mockImageDto, productId)).toEqual(`Image ${mockImage.id} created successfully`)
        })

        it('should throw NotFoundException if product ID does not exist', async () => {
            const mockImageDto = { url: 'http://example.com/new-image.jpg', priority: 1 }
            const productId = 'nonexistent'
            prismaService.product.findFirst.mockResolvedValue(null)
            await expect(service.createImage(mockImageDto, productId)).rejects.toThrow(BadRequestException)
        })
    })

    describe('updateImage', () => {
        it('should update an image and return success message', async () => {
            const mockUpdateDto = { url: 'http://example.com/updated-image.jpg' }
            const imageId = 'img_67890'
            prismaService.image.update.mockResolvedValue({ id: imageId, ...mockUpdateDto })
            expect(await service.updateImage(mockUpdateDto, imageId)).toEqual(`Image ${imageId} updated successfully`)
        })

        it('should throw NotFoundException if image does not exist', async () => {
            const mockUpdateDto = { url: 'http://example.com/updated-image.jpg' }
            const imageId = 'nonexistent'
            prismaService.image.update.mockRejectedValue(new BadRequestException(`Image with ID ${imageId} does not exist`))
            await expect(service.updateImage(mockUpdateDto, imageId)).rejects.toThrow(BadRequestException)
        })
    })

    describe('deleteImage', () => {
        it('should delete an image and return success message', async () => {
            const imageId = 'img_67890'
            prismaService.image.delete.mockResolvedValue({ count: 1 })
            expect(await service.deleteImage(imageId)).toEqual(`Image ${imageId} deleted successfully`)
        })

        it('should throw NotFoundException if image does not exist', async () => {
            const imageId = 'nonexistent'
            prismaService.image.delete.mockRejectedValue(new BadRequestException(`Image with ID ${imageId} does not exist`))
            await expect(service.deleteImage(imageId)).rejects.toThrow(BadRequestException)
        })
    })
})

