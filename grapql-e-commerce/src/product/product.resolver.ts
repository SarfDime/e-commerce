import { Args, Mutation, Query, Resolver, ID } from "@nestjs/graphql";
import { ProductType } from "./product.type";
import { ProductService } from "./product.service";
import { CreateProductInput, UpdateProductInput } from "./product.dtos";

@Resolver((_of: ProductType) => ProductType)
export class ProductResolver {
    constructor(private productService: ProductService) { }

    @Query(_returns => ProductType)
    product(@Args('id', { type: () => ID }) id: string) {
        return this.productService.getProduct(id)
    }
    @Query(_returns => [ProductType])
    products() {
        return this.productService.getProducts()
    }
    @Mutation(_returns => ProductType)
    createProduct(@Args("product") product: CreateProductInput) {
        return this.productService.createProduct(product)
    }
    @Mutation(_returns => ProductType)
    updateProduct(@Args('id', { type: () => ID }) id: string, @Args("product") product: UpdateProductInput) {
        return this.productService.updateProduct(id, product);
    }

    @Mutation(_returns => Number)
    removeProducts(@Args({ name: 'iDs', type: () => [ID] }) iDs: string[]) {
        return this.productService.removeProducts(iDs)
    }
}