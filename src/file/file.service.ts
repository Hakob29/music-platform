import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs"
import * as uuid from "uuid"

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image'
}

@Injectable()
export class FileService {

    //CREATE AUDIO AND PICTURE FILES
    createFile(type: FileType, file: any): string {
        try {
            const fileExtension = file.originalname.split(".").pop();
            const fileName = uuid.v4() + `.${fileExtension}`;
            const filePath = path.resolve(__dirname, "..", "static", type);
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
            return type + "/" + fileName;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //DELETE AUDIO AND PICTURE FILES
    removeFile(fileName: string) {
        try {
            const filePath = path.resolve(__dirname, "..", "static/" + fileName);
            fs.stat(filePath, function (err, stats) {
                if (err) {
                    return console.error(err);
                }

                fs.unlink(filePath, function (err) {
                    if (err) return console.log(err);
                    console.log('audio and picture deleted successfully');
                });
            });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
