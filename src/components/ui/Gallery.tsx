import { useEffect, useState } from "react";
import { GalleryDialog } from "./GalleryDialog";
import { Post } from "@/types.ts";

function ImageGallery() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.map((post: Post) => (
        <div key={post._id} className="overflow-hidden rounded-lg shadow-lg">
          <GalleryDialog
            trigger={
              <img
                src={"http://localhost:3001/" + post.image}
                alt=""
                loading="lazy"
                className="w-full h-auto object-cover object-center"
              />
            }
            img={"http://localhost:3001/" + post.image}
            postId={post._id}
            initialComments={post.comments}
            authorName={post.authorName}
            dateAdded={post.dateAdded}
          ></GalleryDialog>
        </div>
      ))}
    </div>
  );
}

export { ImageGallery };
