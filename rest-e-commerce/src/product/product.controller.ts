import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Delete,
    Put,
} from "@nestjs/common"
import { ProductDto, uProductDto } from "../dto/dtos"
import { routeParamsID } from "../interfaces/interfaces"
import { ProductService } from "./product.service"

@Controller("products")
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get(":id?")
    getProducts(@Param() params: routeParamsID) {
        return this.productService.getProducts(params.id)
    }

    @Post()
    createProduct(@Body() body: ProductDto) {
        return this.productService.createProduct(body)
    }

    @Put(":id?")
    updateProduct(@Body() body: uProductDto, @Param() params: routeParamsID) {
        return this.productService.updateProduct(body, params.id)
    }

    @Delete(":id?")
    deleteProduct(@Param() params: routeParamsID) {
        return this.productService.deleteProduct(params.id)
    }
}
