import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class ProductDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsIn(['active', 'inactive'])
    status: string
}

export class uProductDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsNumber()
    price?: number

    @IsOptional()
    @IsString()
    @IsIn(['active', 'inactive'])
    status?: string
}

export class ImageDto {
    @IsNotEmpty()
    @IsString()
    @IsUrl({}, { message: 'url value must be a valid URL' })
    url: string

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    priority: number
}

export class uImageDto {
    @IsOptional()
    @IsString()
    @IsUrl(undefined, { message: 'url value is not valid URL.' })
    url?: string

    @IsOptional()
    @IsNumber()
    priority?: number
}
