import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { count } from 'console';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './schemas/track-schema';
import { TrackService } from './track.service';

@Controller('/track')
export class TrackController {
    constructor(
        private readonly trackService: TrackService

    ) { }

    //CREATE TRACK
    @Post("/create")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
        { name: "audio", maxCount: 1 }
    ]))
    async create(@UploadedFiles() files: { picture: Express.Multer.File, audio: Express.Multer.File }, @Body() createTrack: CreateTrackDto): Promise<Track> {
        const { picture, audio } = files;
        return this.trackService.create(createTrack, picture[0], audio[0]);
    }

    //GET ALL TRACKS
    @Get("/getAll")
    async getAll(
        @Query('count') count: number,
        @Query("offset") offset: number): Promise<Track[]> {
        return await this.trackService.getAll(count, offset)
    }

    //GET TRACK BY ID
    @Get("/getOne/:id")
    async getOne(
        @Param("id") id: number
    ): Promise<Track> {
        return this.trackService.getOne(id);
    }

    //SERACHE TRACKS
    @Get("/search")
    async search(@Query("trackName") trackName: string) {
        return await this.trackService.search(trackName);
    }

    //DELETE TRACK BY ID
    @Delete("/delete/:id")
    async delete(
        @Param("id") id: number
    ): Promise<any> {
        return this.trackService.delete(id);
    }

    //ADD COMMENT TO TRACK
    @Post("/comment")
    async addComment(
        @Body() dto: CreateCommentDto) {
        return await this.trackService.addComment(dto);
    }

    //DELETE COMMENT 
    @Delete("delete/comment/:id")
    async deleteComment(@Param("id") id: string) {
        return await this.trackService.deleteComment(id);
    }

    //LISTENER CHECK
    @Post("/listen/:id")
    async listen(@Param("id") id: string) {
        return await this.trackService.listen(id);
    }

}
