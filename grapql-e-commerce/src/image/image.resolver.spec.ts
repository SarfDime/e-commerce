import { Test, TestingModule } from '@nestjs/testing'
import { ImageResolver } from './image.resolver'
import { ImageService } from './image.service'
import { ImageType } from './image.type'
import { CreateImageInput, UpdateImageInput } from './image.dtos'
import { Image } from './image.entity'
import { Product } from '../product/product.entity'

describe('ImageResolver', () => {
    let resolver: ImageResolver
    let imageService: ImageService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ImageResolver,
                {
                    provide: ImageService,
                    useValue: {
                        getImages: jest.fn(),
                        getImage: jest.fn(),
                        createImage: jest.fn(),
                        updateImage: jest.fn(),
                        removeImages: jest.fn(),
                        getProductForImage: jest.fn(),
                    },
                },
            ],
        }).compile()

        resolver = module.get<ImageResolver>(ImageResolver)
        imageService = module.get<ImageService>(ImageService)
    })

    it('should return an array of images', async () => {
        const expectedImages: ImageType[] = [
            {
                id: 'image-id-1',
                url: 'http://example.com/image1.jpg',
                priority: 1,
                product: {
                    id: 'product-id-1',
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
                    id: 'product-id-2',
                    name: 'Product 2',
                    price: 200,
                    status: 'inactive',
                    images: [],
                },
            },
        ]

        jest.spyOn(imageService, 'getImages').mockResolvedValue(expectedImages)

        expect(await resolver.images()).toEqual(expectedImages)
    })

    it('should return a single image by id', async () => {
        const imageId = 'image-id-1'
        const expectedImage: ImageType = {
            id: imageId,
            url: 'http://example.com/image1.jpg',
            priority: 1,
            product: {
                id: 'product-id-1',
                name: 'Product 1',
                price: 100,
                status: 'active',
                images: [],
            },
        }

        jest.spyOn(imageService, 'getImage').mockResolvedValue(expectedImage)

        expect(await resolver.image(imageId)).toEqual(expectedImage)
    })

    it('should create an image', async () => {
        const createImageInput: CreateImageInput = {
            url: 'http://example.com/new-image.jpg',
            priority: 1,
        }
        const productId = 'product-id-1'
        const expectedImage: ImageType = {
            id: 'image-id-new',
            url: 'http://example.com/new-image.jpg',
            priority: 1,
            product: {
                id: productId,
                name: 'Product 1',
                price: 100,
                status: 'active',
                images: [],
            },
        }

        jest.spyOn(imageService, 'createImage').mockResolvedValue(expectedImage)

        expect(await resolver.createImage(createImageInput, productId)).toEqual(expectedImage)
    })

    it('should update an image', async () => {
        const imageId = 'image-id-1'
        const updateImageInput: UpdateImageInput = {
            url: 'http://example.com/updated-image.jpg',
            priority: 2,
        }
        const updatedImage: ImageType = {
            id: imageId,
            url: 'http://example.com/updated-image.jpg',
            priority: 2,
            product: {
                id: 'product-id-1',
                name: 'Product 1',
                price: 100,
                status: 'active',
                images: [],
            },
        }

        jest.spyOn(imageService, 'updateImage').mockResolvedValue(updatedImage)

        expect(await resolver.updateImage(imageId, updateImageInput)).toEqual(updatedImage)
    })

    it('should remove images by ids', async () => {
        const imageIds = ['image-id-1', 'image-id-2']
        const affectedRows = imageIds.length

        jest.spyOn(imageService, 'removeImages').mockResolvedValue(affectedRows)

        expect(await resolver.removeImages(imageIds)).toEqual(affectedRows)
    })

    it('should return the product for an image', async () => {
        const imageId = 'image-id-1'
        const expectedProduct: Product = {
            id: 'product-id-1',
            name: 'Product 1',
            price: 100,
            status: 'active',
            images: [],
        }

        jest.spyOn(imageService, 'getProductForImage').mockResolvedValue(expectedProduct)

        expect(await resolver.product({ id: imageId } as Image)).toEqual(expectedProduct)
    })
})
