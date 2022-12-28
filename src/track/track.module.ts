import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track-schema';
import { Comment, CommentSchema } from './schemas/comment-schema';
import { Album, AlbumSchema } from './schemas/album-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }])
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule { }
