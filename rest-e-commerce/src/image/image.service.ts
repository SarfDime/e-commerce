import { Injectable, BadRequestException, NotFoundException, } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ImageDto, uImageDto } from '../dto/dtos'

@Injectable()
export class ImageService {
    constructor(private prism: PrismaService) { }

    async getImages(ID: string) {
        if (!ID) return await this.prism.image.findMany({ include: { product: true } })
        const image = await this.prism.image.findFirst({ where: { id: ID }, include: { product: true } })
        if (!image) throw new NotFoundException(`Image with ID ${ID} does not exist`)
        return image
    }

    async createImage(imageDto: ImageDto, ID: string) {
        if (!ID) throw new BadRequestException(`You must provide a valid product ID`)
        if (!Object.keys(imageDto).length) throw new BadRequestException(`You must provide valid image info`)
        const product = await this.prism.product.findFirst({ where: { id: ID } })
        if (!product) throw new NotFoundException(`Product with id ${ID} doesn't exist`)
        const image = await this.prism.image.create({ data: { ...imageDto, product: { connect: { id: ID } } } })
        return `Image ${image.id} created successfully`
    }

    async updateImage(imageDto: uImageDto, ID: string) {
        if (!ID) throw new BadRequestException(`You must provide a valid image ID`)
        const image = await this.prism.image.update({ where: { id: ID }, data: imageDto })
        if (!image) throw new NotFoundException(`Image with ID ${ID} does not exist`)
        return `Image ${ID} updated successfully`
    }

    async deleteImage(ID: string) {
        if (!ID) throw new BadRequestException(`You must provide a valid image ID`)
        const count = await this.prism.image.delete({ where: { id: ID } })
        if (!count) throw new NotFoundException(`Image with ID ${ID} does not exist`)
        if (!count) throw new BadRequestException(`Image with ID ${ID} was not deleted`)
        return `Image ${ID} deleted successfully`
    }
}
