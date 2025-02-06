import { User } from "./User";


export class Comment {
    id?: number;
    title !: string;
    createdAt?: Date;
    updatedAt?: Date;
    creator_id!: number;
    memes_id!: number;
    User?: User;


}
// id int AI PK
// title varchar(255)
// createdAt datetime
// updatedAt datetime
// creator_id int
// memes_id int