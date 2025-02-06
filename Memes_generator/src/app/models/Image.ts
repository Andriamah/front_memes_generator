export class Image {
    _id?:number;
    memes_id!: number;
    imageData!: string;

}

// / _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
//     memes_id : String,
//     imageData:  {
//         type: String, // Image en base64
//         required: true // L'image est obligatoire
//     }