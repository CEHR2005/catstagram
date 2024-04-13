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

export interface User {
  username: string;
  email: string;
  password: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
