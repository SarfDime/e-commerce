import { Module } from "@nestjs/common"
import { ProductModule } from "./product/product.module"
import { ImageModule } from "./image/image.module"
import { PrismaModule } from "../prisma/prisma.module"

@Module({ imports: [PrismaModule, ProductModule, ImageModule,] })
export class AppModule { }
