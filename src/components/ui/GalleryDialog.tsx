import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import {Label} from "@/components/ui/label"
import React, { ReactNode, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Comment, User } from "@/types.ts";
import Cookies from "js-cookie";
interface GalleryDialogProps {
  trigger: ReactNode;
  img: string;
  postId: string;
  initialComments: Comment[];
  authorName: string;
  dateAdded: string;
}

const GalleryDialog: React.FC<GalleryDialogProps> = ({
  trigger,
  img,
  postId,
  initialComments,
  authorName,
  dateAdded,
}) => {
  const [new_comment, setNew_comment] = useState("");
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNew_comment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    const user = Cookies.get("user");
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    const userData: User = JSON.parse(user);
    console.log(user);
    if (!userData) {
      console.error("User data is missing");
      return;
    }
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorName: userData.username,
          authorEmail: userData.email,
          comment: new_comment,
        }),
      },
    );

    if (!response.ok) {
      console.error("Failed to post comment");
    } else {
      const post = await response.json();
      const comment = post.comments[post.comments.length - 1];
      setComments([...comments, comment]);
    }

    setNew_comment("");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{authorName}</DialogTitle>
          <DialogDescription>
            Was posted on {new Date(dateAdded).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="content-center">
            <img
              src={img}
              alt=""
              loading="lazy"
              className="w-full h-auto object-cover object-center"
            />
          </div>
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Comments
              </h4>
              {comments.map((comment) => (
                <>
                  <div key={comment._id} className="text-sm">
                    <b>{comment.authorName}</b>: {comment.comment}
                  </div>
                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Input
            type="text"
            placeholder="Add a comment"
            value={new_comment}
            onChange={handleCommentChange}
          />
          <Button type="submit" onClick={handleCommentSubmit}>
            Send comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { GalleryDialog };
