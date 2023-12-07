import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { Repository } from 'typeorm'
import { CreateProductInput, UpdateProductInput } from './product.dtos'
import { Image } from 'src/image/image.entity'

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

    async getProducts(): Promise<Product[]> {
        return this.productRepository.find()
    }

    async getProduct(id: string): Promise<Product> {
        return this.productRepository.findOne({ where: { id } })
    }

    async getImagesForProduct(productId: string): Promise<Image[]> {
        const productWithImages = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images']
        })

        if (!productWithImages) {
            throw new Error('Product not found')
        }

        return productWithImages.images
    }

    async createProduct(createProductDto: CreateProductInput): Promise<Product> {
        const newProduct = this.productRepository.create(createProductDto)
        return this.productRepository.save(newProduct)
    }

    async updateProduct(id: string, updateProductDto: UpdateProductInput): Promise<Product> {
        await this.productRepository.update(id, updateProductDto)
        return this.productRepository.findOne({ where: { id } })
    }

    async removeProducts(ids: string[]): Promise<number> {
        const result = await this.productRepository.delete(ids)
        return result.affected
    }
}
