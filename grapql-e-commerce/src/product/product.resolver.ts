import { Args, Mutation, Query, Resolver, ID, ResolveField, Parent } from "@nestjs/graphql"
import { ProductType } from "./product.type"
import { ProductService } from "./product.service"
import { CreateProductInput, UpdateProductInput } from "./product.dtos"
import { Product } from "./product.entity"
import { ImageType } from "../image/image.type"
import { Image } from "../image/image.entity"

@Resolver((_of: ProductType) => ProductType)
export class ProductResolver {
    constructor(private productService: ProductService) { }

    @Query(_returns => [ProductType])
    products() {
        return this.productService.getProducts()
    }
    @Query(_returns => ProductType)
    product(@Args('id', { type: () => ID }) id: string) {
        return this.productService.getProduct(id)
    }
    @Mutation(_returns => ProductType)
    createProduct(@Args("product") product: CreateProductInput) {
        return this.productService.createProduct(product)
    }
    @Mutation(_returns => ProductType)
    updateProduct(@Args('id', { type: () => ID }) id: string, @Args("product") product: UpdateProductInput) {
        return this.productService.updateProduct(id, product)
    }
    @Mutation(_returns => String)
    removeProducts(@Args({ name: 'iDs', type: () => [ID] }) iDs: string[]) {
        return this.productService.removeProducts(iDs)
    }
    @ResolveField('images', _returns => [ImageType])
    async images(@Parent() product: Product): Promise<Image[]> {
        return this.productService.getImagesForProduct(product.id)
    }
}
