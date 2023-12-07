import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/product.entity";
import { ProductType } from "src/product/product.type";

@ObjectType('Image')
export class ImageType {
    @Field(_type => ID)
    id: string;
    @Field()
    url: string;
    @Field()
    priority: number;
    @Field(_type => ProductType!)
    product: ProductType
}
