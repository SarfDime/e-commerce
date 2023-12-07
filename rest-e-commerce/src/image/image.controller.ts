import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common"
import { routeParamsID } from "../interfaces/interfaces"
import { ImageDto, uImageDto } from "../dto/dtos"
import { ImageService } from "./image.service"

@Controller("images")
export class ImageController {
    constructor(private readonly imageService: ImageService) { }

    @Get(":id?")
    getImages(@Param() params: routeParamsID) {
        return this.imageService.getImages(params.id)
    }

    @Post(":id?")
    createImage(@Param() params: routeParamsID, @Body() body: ImageDto) {
        return this.imageService.createImage(body, params.id)
    }

    @Put(":id?")
    updateImage(@Body() body: uImageDto, @Param() params: routeParamsID) {
        return this.imageService.updateImage(body, params.id)
    }

    @Delete(":id?")
    deleteImage(@Param() params: routeParamsID) {
        return this.imageService.deleteImage(params.id)
    }
}
