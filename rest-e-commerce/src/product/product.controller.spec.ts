import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { mockProductArray } from '../mock/mock.product'

describe('ProductController', () => {
  let app: INestApplication
  let productService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: productService,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  it('/GET products', () => {
    productService.getProducts.mockResolvedValue(mockProductArray)
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(mockProductArray)
  })

  it('/POST products', () => {
    const productDto = { name: 'Test Product', price: 100, status: 'active' }
    productService.createProduct.mockResolvedValue('Product created successfully')
    return request(app.getHttpServer())
      .post('/products')
      .send(productDto)
      .expect(201)
      .expect('Product created successfully')
  })

  it('/PUT products/:id', () => {
    const updateDto = { name: 'Updated Product', price: 150 }
    productService.updateProduct.mockResolvedValue('Product updated successfully')
    return request(app.getHttpServer())
      .put('/products/1')
      .send(updateDto)
      .expect(200)
      .expect('Product updated successfully')
  })

  it('/DELETE products/:id', () => {
    productService.deleteProduct.mockResolvedValue('Product deleted successfully')
    return request(app.getHttpServer())
      .delete('/products/1')
      .expect(200)
      .expect('Product deleted successfully')
  })

  afterAll(async () => {
    await app.close()
  })
})
