import { Field, ID, ObjectType } from "@nestjs/graphql"
import { ImageType } from "../image/image.type"

@ObjectType('Product')
export class ProductType {
    @Field(_type => ID)
    id: string
    @Field()
    name: string
    @Field()
    price: number
    @Field()
    status: string
    @Field(_type => [ImageType], { nullable: 'itemsAndList' }) 
    images: ImageType[] 
}
