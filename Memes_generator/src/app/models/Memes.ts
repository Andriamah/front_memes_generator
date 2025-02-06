import { User } from "./User";

export class Memes {
    id?: number;
    title!: string;
    createdAt!: Date;
    updatedAt!: Date;
    creator_id!: number;
    User?: User;
    favoriteCount?:number;
    commentCount?:number

}
// id int AI PK
// title varchar(255)
// createdAt datetime
// updatedAt datetime
// creator_id int
// (click)="openDialogComment(meme.id)