import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track-schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from './schemas/album-schema';
import { CommentDocument, Comment } from './schemas/comment-schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import mongoose from 'mongoose';


@Injectable()
export class TrackService {
    constructor(
        @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
        @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    ) { }

    //CREATE TRACK
    async create(createTrack: CreateTrackDto): Promise<Track> {
        const track = await this.trackModel.create({
            ...createTrack,
            listens: 0
        });
        return track;
    }

    //GET ALL TRACKS
    async getAll(): Promise<Track[]> {
        return await this.trackModel.find()
    }

    //GET TRACK BY ID
    async getOne(id: number): Promise<Track> {
        const track = await this.trackModel.findById(id).populate("comments");
        if (!track) throw new Error("Track Not found!!!");
        return track;
    }

    //DELETE TRACK BY ID
    async delete(id: number): Promise<any> {
        const track = await this.trackModel.findById(id);
        if (!track) throw new Error("Track Not found!!!");
        return await this.trackModel.findByIdAndDelete(id);
    }

    //ADD COMMENT TO TRACK
    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId);
        const comment = await this.commentModel.create({ ...dto });
        track.comments.push(comment.id);
        await track.save()
        return comment;
    }
}
