import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track-schema';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from './schemas/album-schema';
import { CommentDocument, Comment } from './schemas/comment-schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';


@Injectable()
export class TrackService {
    constructor(
        @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
        @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
        private readonly fileSerivce: FileService
    ) { }

    //CREATE TRACK
    async create(createTrack: CreateTrackDto, picture: Express.Multer.File, audio: Express.Multer.File): Promise<Track> {
        const audioPath = this.fileSerivce.createFile(FileType.AUDIO, audio);
        const picturePath = this.fileSerivce.createFile(FileType.IMAGE, picture);
        const track = await this.trackModel.create({
            ...createTrack,
            listens: 0,
            audio: audioPath,
            picture: picturePath
        });
        return track;
    }

    //GET ALL TRACKS
    async getAll(count: number = 10, offset: number = 0): Promise<Track[]> {
        return await this.trackModel.find().skip(offset).limit(count);
    }

    //GET TRACK BY ID
    async getOne(id: number): Promise<Track> {
        const track = await this.trackModel.findById(id).populate("comments");
        if (!track) throw new Error("Track Not found!!!");
        return track;
    }

    //SEARCH TRACKS
    async search(trackName: string) {
        const track = await this.trackModel.find({
            name: { $regex: new RegExp(trackName, 'i') }
        });
        return track;
    }

    //DELETE TRACK BY ID
    async delete(id: number): Promise<any> {
        const track = await this.trackModel.findById(id).populate("comments");
        if (!track) throw new Error("Track Not found!!!");
        const commentId = track.comments[0]["_id"].valueOf();
        await this.deleteComment(commentId);
        this.fileSerivce.removeFile(track.picture);
        this.fileSerivce.removeFile(track.audio);
        return await this.trackModel.findByIdAndDelete(track.id);
    }

    //ADD COMMENT TO TRACK
    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId);
        const comment = await this.commentModel.create({ ...dto });
        track.comments.push(comment.id);
        await track.save()
        return comment;
    }


    //DELETE COMMENT 
    async deleteComment(id: string) {
        const comment = await this.commentModel.findById(id);
        if (!comment) throw new Error("Comment dont found...");
        return await this.commentModel.findByIdAndDelete(id);
    }

    //LISTENER CHECK
    async listen(id: string) {
        const track = await this.trackModel.findById(id);
        if (!track) throw new Error("Track Not found!!!");
        track.listens += 1;
        await track.save()
    }
}
