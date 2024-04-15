import { useEffect, useState } from "react";
import { Post } from "@/types.ts";
import { Link } from "react-router-dom";

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
          <Link to={`/post/${post._id}`}>
            <img
              src={"http://localhost:3001/" + post.image}
              alt=""
              loading="lazy"
              className="w-full h-auto object-cover object-center"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export { ImageGallery };
