import { Args, Mutation, Query, Resolver, ID, ResolveField, Parent } from "@nestjs/graphql"
import { ImageType } from "./image.type"
import { ImageService } from "./image.service"
import { CreateImageInput, UpdateImageInput } from "./image.dtos"
import { ProductType } from "src/product/product.type"
import { Product } from "src/product/product.entity"
import { Image } from "./image.entity"

@Resolver((_of: ImageType) => ImageType)
export class ImageResolver {
    constructor(private imageService: ImageService) { }

    @Query(_returns => [ImageType])
    images() {
        return this.imageService.getImages()
    }
    @Query(_returns => ImageType)
    image(@Args('id', { type: () => ID }) id: string) {
        return this.imageService.getImage(id)
    }
    @Mutation(_returns => ImageType)
    createImage(
        @Args('image') image: CreateImageInput,
        @Args('productId', { type: () => ID }) productId: string
    ) {
        return this.imageService.createImage(image, productId)
    }
    @Mutation(_returns => ImageType)
    updateImage(@Args('id', { type: () => ID }) id: string, @Args("image") image: UpdateImageInput) {
        return this.imageService.updateImage(id, image)
    }

    @Mutation(_returns => Number)
    removeImages(@Args({ name: 'iDs', type: () => [ID] }) iDs: string[]) {
        return this.imageService.removeImages(iDs)
    }

    @ResolveField('product', _returns => ProductType)
    async product(@Parent() image: Image): Promise<Product> {
        return this.imageService.getProductForImage(image.id)
    }
}