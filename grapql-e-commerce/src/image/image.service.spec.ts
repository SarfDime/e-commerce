import { Test, TestingModule } from '@nestjs/testing'
import { ImageService } from './image.service'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { Product } from '../product/product.entity'
import { Image } from './image.entity'
import { testImage, testImages } from '../mock/image.mock'
import { testProduct } from '../mock/product.mock'

describe('ImageService', () => {
    let service: ImageService
    let imageRepository: Repository<Image>
    let productRepository: Repository<Product>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageService,
                {
                    provide: getRepositoryToken(Image),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Product),
                    useClass: Repository,
                },
            ],
        }).compile()

        service = module.get<ImageService>(ImageService)
        imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image))
        productRepository = module.get<Repository<Product>>(getRepositoryToken(Product))
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('getImages', () => {
        it('should return an array of images', async () => {
            jest.spyOn(imageRepository, 'find').mockResolvedValue(testImages)
            expect(await service.getImages()).toBe(testImages)
        })

        it('should throw NotFoundException if no images found', async () => {
            jest.spyOn(imageRepository, 'find').mockResolvedValue([])
            await expect(service.getImages()).rejects.toThrow(NotFoundException)
        })
    })

    describe('getImage', () => {
        it('should return a single image by id', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(testImage)
            expect(await service.getImage('some-id')).toBe(testImage)
        })

        it('should throw NotFoundException if image not found', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(undefined)
            await expect(service.getImage('some-id')).rejects.toThrow(NotFoundException)
        })

        it('should throw BadRequestException if no id provided', async () => {
            await expect(service.getImage('')).rejects.toThrow(BadRequestException)
        })
    })

    describe('getProductForImage', () => {
        it('should return the product associated with the image', async () => {
            const tempTestImage = testImage
            tempTestImage.product = testProduct
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(tempTestImage)
            expect(await service.getProductForImage('image-id')).toBe(testProduct)
        })

        it('should throw NotFoundException if image not found', async () => {
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(undefined)
            await expect(service.getProductForImage('image-id')).rejects.toThrow(NotFoundException)
        })

        it('should throw BadRequestException if no imageId provided', async () => {
            await expect(service.getProductForImage('')).rejects.toThrow(BadRequestException)
        })
    })

    describe('createImage', () => {
        it('should create a new image and return it', async () => {
            const createImageInput = { url: 'http://example.com/image.jpg', priority: 1 }
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(testProduct)
            jest.spyOn(imageRepository, 'create').mockReturnValue(testImage)
            jest.spyOn(imageRepository, 'save').mockResolvedValue(testImage)
            expect(await service.createImage(createImageInput, 'product-id')).toBe(testImage)
        })
    })

    describe('updateImage', () => {
        it('should update an image and return the updated image', async () => {
            const updateImageDto = { url: 'http://example.com/new-image.jpg' }
            const updateResult: UpdateResult = {
                affected: 1,
                raw: {},
                generatedMaps: []
            }
            jest.spyOn(imageRepository, 'update').mockResolvedValue(updateResult)
            jest.spyOn(imageRepository, 'findOne').mockResolvedValue(testImage)
            expect(await service.updateImage('image-id', updateImageDto)).toBe(testImage)
        })
    })

    describe('removeImages', () => {
        it('should remove images and return a success message', async () => {
            const ids = ['image-id-1', 'image-id-2'];
            const deleteResult: DeleteResult = {
                affected: ids.length,
                raw: {}
            };
            jest.spyOn(imageRepository, 'delete').mockResolvedValue(deleteResult);
            expect(await service.removeImages(ids)).toBe(`${ids.length} Images have been removed`);
        })
    })
})