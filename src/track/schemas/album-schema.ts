import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Track } from './track-schema';
import * as mongoose from "mongoose";


export type AlbumDocument = Album & Document;

@Schema()
export class Album {
    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    picture: string

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }] })
    tracks: Track[]

}

export const AlbumSchema = SchemaFactory.createForClass(Album);