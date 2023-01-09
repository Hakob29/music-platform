import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from "path"



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static")
    }),
    TrackModule,
    FileModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
