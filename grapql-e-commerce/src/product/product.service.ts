import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './product.entity'
import { Repository } from 'typeorm'
import { CreateProductInput, UpdateProductInput } from './product.dtos'
import { Image } from '../image/image.entity'

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

    async getProducts(): Promise<Product[]> {
        const products = this.productRepository.find()
        if (!products) throw new NotFoundException(`No products found`)
        return products
    }

    async getProduct(id: string): Promise<Product> {
        if (!id) throw new BadRequestException(`You must provide a valid product ID`)
        const product = this.productRepository.findOne({ where: { id } })
        if (!product) throw new NotFoundException(`Product with ID ${id} does not exist`)
        return product
    }

    async getImagesForProduct(productId: string): Promise<Image[]> {
        if (!productId) throw new BadRequestException(`You must provide a valid product ID`)
        const productWithImages = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images']
        })
        if (!productWithImages) throw new NotFoundException('Product not found')
        return productWithImages.images
    }

    async createProduct(createProductDto: CreateProductInput): Promise<Product> {
        if (!Object.keys(createProductDto).length) throw new BadRequestException(`You must provide valid product info`)
        const newProduct = this.productRepository.create(createProductDto)
        return this.productRepository.save(newProduct)
    }

    async updateProduct(id: string, updateProductDto: UpdateProductInput): Promise<Product> {
        if (!id) throw new BadRequestException(`You must provide a valid product ID`)
        if (!Object.keys(updateProductDto).length) throw new BadRequestException(`You must provide valid product info`)
        await this.productRepository.update(id, updateProductDto)
        return this.productRepository.findOne({ where: { id } })
    }

    async removeProducts(ids: string[]): Promise<number> {
        if (!ids) throw new BadRequestException(`You must provide valid product IDs`)
        const result = await this.productRepository.delete(ids)
        if (!result.affected) throw new BadRequestException(`No products were removed`)
        return result.affected
    }
}
