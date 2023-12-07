import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateImageInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    @IsUrl({}, { message: 'url value must be a valid URL' })
    url: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    priority: number;
}

@InputType()
export class UpdateImageInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: 'url value is not valid URL.' })
    url?: string;

    @Field({ nullable: true })
    @IsNumber()
    priority?: number;
}

