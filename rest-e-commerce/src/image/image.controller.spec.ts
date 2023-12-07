import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { ImageController } from './image.controller'
import { ImageService } from './image.service'
import { mockImageArray } from '../mock/mock.image'

describe('ImageController', () => {
    let app: INestApplication
    let imageService = {
        getImages: jest.fn(),
        createImage: jest.fn(),
        updateImage: jest.fn(),
        deleteImage: jest.fn(),
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ImageController],
            providers: [
                {
                    provide: ImageService,
                    useValue: imageService,
                },
            ],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()
    })

    it('/GET images', () => {
        imageService.getImages.mockResolvedValue(mockImageArray)
        return request(app.getHttpServer())
            .get('/images')
            .expect(200)
            .expect(mockImageArray)
    })

    it('/POST images/:id', () => {
        const imageDto = { url: 'http://example.com/image.jpg', priority: 1 }
        imageService.createImage.mockResolvedValue('Image created successfully')
        return request(app.getHttpServer())
            .post('/images/1')
            .send(imageDto)
            .expect(201)
            .expect('Image created successfully')
    })

    it('/PUT images/:id', () => {
        const updateDto = { url: 'http://example.com/updated-image.jpg' }
        imageService.updateImage.mockResolvedValue('Image updated successfully')
        return request(app.getHttpServer())
            .put('/images/1')
            .send(updateDto)
            .expect(200)
            .expect('Image updated successfully')
    })

    it('/DELETE images/:id', () => {
        imageService.deleteImage.mockResolvedValue('Image deleted successfully')
        return request(app.getHttpServer())
            .delete('/images/1')
            .expect(200)
            .expect('Image deleted successfully')
    })

    afterAll(async () => {
        await app.close()
    })
})
