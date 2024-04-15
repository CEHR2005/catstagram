import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post, Comment, User } from "@/types.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator.tsx";
import { Reply } from "lucide-react";
const FormSchema = z.object({
  Message: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
});

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const handleReplyClick = (commentId: string) => {
    if (commentId === replyTo) {
      setReplyTo(null);
      return;
    }
    setReplyTo(commentId);
  };
  const Nav = useNavigate();
  const handleDeletePost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Failed to delete post");
    } else {
      Nav("/");
      window.location.reload();
    }
  };
  const handleCommentSubmit = async (data: z.infer<typeof FormSchema>) => {
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
    const url = replyTo
      ? `http://localhost:3001/posts/${postId}/comments/${replyTo}/replies`
      : `http://localhost:3001/posts/${postId}/comments`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorName: userData.username,
        authorEmail: userData.email,
        comment: data.Message,
      }),
    });
    if (!response.ok) {
      console.error("Failed to post comment");
    } else {
      const post = await response.json();
      if (replyTo) {
        const parentComment = post.comments.find(
          (c: Comment) => c._id === replyTo,
        );
        const reply = parentComment.replies[parentComment.replies.length - 1];
        setComments(
          comments.map((c: Comment) =>
            c._id === replyTo ? { ...c, replies: [...c.replies, reply] } : c,
          ),
        );
        form.reset();
        setReplyTo(null);
      } else {
        const comment = post.comments[post.comments.length - 1];
        setComments([...comments, comment]);
        form.reset();
      }
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setComments(data.comments);
      })
      .catch((error) => console.error(error));
  }, [postId]);
  const user = Cookies.get("user") || "{}";
  const userData: User = JSON.parse(user);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  console.log(post);
  const postdate = post?.dateAdded;
  let date;
  let formattedDate = "";
  if (postdate != null) {
    date = new Date(postdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return (
    <div className="flex gap-4">
      {post && (
        <div className="basis-1/3">
          <p>
            <b>Author</b>: {post.authorName}
          </p>
          <p>
            <b>Date added</b>: {formattedDate}
          </p>
          <p>{post.comment}</p>
          <img
            src={`http://localhost:3001/${post.image}`}
            alt=""
            className="w-auto h-auto object-cover object-center"
          />

          {(userData.username === post?.authorName ||
            userData.role === "admin" ||
            userData.role === "moderator") && (
            <>
              <Separator className="my-2" />
              <Button onClick={handleDeletePost} className="float-right">
                Delete Post
              </Button>
            </>
          )}
        </div>
      )}

      <div className="basis-2/3">
        <h2>Comments</h2>
        <Separator className="my-2" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCommentSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="Message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your message"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can use <span>#</span> to add hashtags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="">
              Submit
            </Button>
          </form>
        </Form>
        <Separator className="my-2" />
        <ul>
          {comments.map((comment) => (
            <>
              <li key={comment._id}>
                <p>
                  <b>{comment.authorName}</b>: {comment.comment}
                </p>
                <button onClick={() => handleReplyClick(comment._id)}>
                  <Reply
                    className="mr-2 h-4 w-4"
                    color={comment._id === replyTo ? "green" : "black"}
                  />
                </button>
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="text-sm resize-y ml-4">
                    <b>{reply.authorName}</b>: {reply.comment}
                  </div>
                ))}
              </li>
              <Separator className="my-2" />
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostPage;
