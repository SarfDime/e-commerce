import { Module } from '@nestjs/common'
import { ImageService } from './image.service'
import { ImageResolver } from './image.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from './image.entity'
import { Product } from '../product/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Image, Product])],
  providers: [ImageService, ImageResolver]
})
export class ImageModule { }
