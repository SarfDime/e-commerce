import { Image } from 'src/image/image.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column()
    price: number;
    @Column({ default: 'active' })
    status: string;
    @OneToMany(() => Image, image => image.product, {
        cascade: true,
        eager: false,
        nullable: true,
        onDelete: "CASCADE"
    })
    images: Image[];
}
