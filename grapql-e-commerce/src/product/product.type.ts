import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType('Product')
export class ProductType {
    @Field(_type => ID)
    id: string;
    @Field()
    name: string;
    @Field()
    price: number;
    @Field()
    status: string;
}
