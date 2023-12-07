import { Product } from '../product/product.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    url: string
    @Column({ default: 1000 })
    priority: number
    @ManyToOne(() => Product, product => product.images, {
        nullable: false,
        onDelete: "CASCADE"
    })
    product: Product
}
