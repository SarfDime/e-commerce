import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { ProductDto, uProductDto } from '../dto/dtos'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ProductService {
    constructor(private prism: PrismaService) { }

    async getProducts(ID: string) {
        if (!ID) return await this.prism.product.findMany({ include: { images: true } })
        const productById = await this.prism.product.findFirst({ where: { id: ID }, include: { images: true } })
        if (!productById) throw new NotFoundException(`Product with ID ${ID} does not exist`)
        return productById
    }

    async createProduct(productDto: ProductDto) {
        if (!productDto?.name || !productDto?.price) throw new BadRequestException(`You must provide a valid product name and price`)
        const product = await this.prism.product.create({ data: { ...productDto } })
        return `Product ${product.id} created successfully`
    }

    async updateProduct(productDto: uProductDto, ID: string) {
        if (!ID) throw new BadRequestException(`You must provide a valid product ID`)
        if (!Object.keys(productDto).length) throw new BadRequestException(`You must provide valid product info`)
        const productByID = await this.prism.product.findFirst({ where: { id: ID } })
        if (!productByID) throw new NotFoundException(`Product with ID ${ID} does not exist`)
        const product = await this.prism.product.update({ where: { id: ID }, data: productDto })
        if (!product) throw new NotFoundException(`Product with ID ${ID} does not exist`)
        return `Product ${ID} updated successfully`
    }

    async deleteProduct(ID: string) {
        if (!ID) throw new BadRequestException(`You must provide a valid product ID`)
        const productById = await this.prism.product.findFirst({ where: { id: ID } })
        if (!productById) throw new NotFoundException(`Product with ID ${ID} does not exist`)
        const count = await this.prism.product.delete({ where: { id: ID } })
        if (!count) throw new InternalServerErrorException(`Product with ID ${ID} was not deleted`)
        return `Product ${ID} deleted successfully`
    }
}
