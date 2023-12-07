import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Image } from './image.entity'
import { CreateImageInput, UpdateImageInput } from './image.dtos'
import { Product } from '../product/product.entity'

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>, @InjectRepository(Product) private productRepository: Repository<Product>) { }

    async getImages(): Promise<Image[]> {
        const images = this.imageRepository.find()
        if (!images) throw new NotFoundException(`No images found`)
        return images
    }

    async getImage(id: string): Promise<Image> {
        if (!id) throw new BadRequestException(`You must provide a valid image ID`)
        const image = this.imageRepository.findOne({ where: { id } })
        if (!image) throw new NotFoundException(`Image with ID ${id} does not exist`)
        return image
    }

    async getProductForImage(imageId: string): Promise<Product> {
        if (!imageId) throw new BadRequestException(`You must provide a valid image ID`)
        const imageWithProduct = await this.imageRepository.findOne({
            where: { id: imageId },
            relations: ['product']
        })
        if (!imageWithProduct) throw new NotFoundException('Image not found')
        return imageWithProduct.product
    }

    async createImage(createImageInput: CreateImageInput, productId: string): Promise<Image> {
        if (!productId) throw new BadRequestException(`You must provide a valid product ID`)
        if (!Object.keys(createImageInput).length) throw new BadRequestException(`You must provide valid image info`)
        const product = await this.productRepository.findOne({ where: { id: productId } })
        if (!product) throw new NotFoundException(`Product with ID '${productId}' not found`)
        const newImage = this.imageRepository.create({
            ...createImageInput,
            product: product
        })
        return this.imageRepository.save(newImage)
    }

    async updateImage(id: string, updateImageDto: UpdateImageInput): Promise<Image> {
        if (!id) throw new BadRequestException(`You must provide a valid image ID`)
        if (!Object.keys(updateImageDto).length) throw new BadRequestException(`You must provide valid image info`)
        await this.imageRepository.update(id, updateImageDto)
        return this.imageRepository.findOne({ where: { id } })
    }

    async removeImages(ids: string[]): Promise<number> {
        if (!ids) throw new BadRequestException(`You must provide valid image IDs`)
        const result = await this.imageRepository.delete(ids)
        if (!result.affected) throw new BadRequestException(`No images were removed`)
        return result.affected
    }
}
