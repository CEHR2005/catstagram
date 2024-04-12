export interface Comment {
    authorName: string;
    authorEmail: string;
    comment: string;
    dateAdded: Date;
    _id: string;
}

export interface Post {
    _id: string;
    image: string;
    authorName: string;
    authorEmail: string;
    comments: Comment[];
    dateAdded: string;
    __v: number;
}
