import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ProductModule } from './product/product.module'
import { ImageModule } from './image/image.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './product/product.entity'
import { Image } from './image/image.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Product, Image]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error) => {
        return {
          message: error.message,
          timestamp: new Date().toISOString(),
          status: error.extensions?.status,
          code: error.extensions?.code,
          path: error.path,
          stacktrace: error.extensions?.stacktrace || [],
          locations: error.locations,
          originalError: error.extensions?.originalError
        }
      },
    }),
    ProductModule,
    ImageModule,
  ],
})
export class AppModule { }