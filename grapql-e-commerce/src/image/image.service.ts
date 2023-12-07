import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { CreateImageInput, UpdateImageInput } from './image.dtos';
import { Product } from 'src/product/product.entity';

@Injectable()
export class ImageService {
    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>, @InjectRepository(Product) private productRepository: Repository<Product>) { }

    async getImages(): Promise<Image[]> {
        return this.imageRepository.find();
    }

    async getImage(id: string): Promise<Image> {
        return this.imageRepository.findOne({ where: { id } });
    }

    async getProductForImage(imageId: string): Promise<Product> {
        const imageWithProduct = await this.imageRepository.findOne({
            where: { id: imageId },
            relations: ['product']
        });
    
        if (!imageWithProduct) {
            throw new Error('Image not found');
        }
    
        return imageWithProduct.product;
    }

    async createImage(createImageInput: CreateImageInput, productId: string): Promise<Image> {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new Error('Product not found');
        }

        const newImage = this.imageRepository.create({
            ...createImageInput,
            product: product
        });

        return this.imageRepository.save(newImage);
    }

    async updateImage(id: string, updateImageDto: UpdateImageInput): Promise<Image> {
        await this.imageRepository.update(id, updateImageDto);
        return this.imageRepository.findOne({ where: { id } });
    }

    async removeImages(ids: string[]): Promise<number> {
        const result = await this.imageRepository.delete(ids);
        return result.affected;
    }
}
