import { useEffect, useState } from "react";
import { Post } from "@/types.ts";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

function ImageGallery() {
  const [posts, setPosts] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/posts/hashtags")
      .then((response) => response.json())
      .then((data) => setHashtags(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    console.log("fetching posts with hashtag");
    console.log("selectedHashtag", selectedHashtag);

    const url =
      selectedHashtag !== "All" && selectedHashtag !== ""
        ? `http://localhost:3001/posts/hashtags/${selectedHashtag.replace("#", "")}`
        : "http://localhost:3001/posts";
    console.log("url", url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        console.log(posts);
      })
      .catch((error) => console.error(error));
  }, [selectedHashtag]);

  return (
    <div>
      <Select value={selectedHashtag} onValueChange={setSelectedHashtag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a hastage" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            {hashtags.map((hashtag) => (
              <SelectItem key={hashtag} value={hashtag}>
                {hashtag}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {posts.map((post: Post) => {
          console.log("post", post);
          return (
            <div
              key={post._id}
              className="overflow-hidden rounded-lg shadow-lg"
            >
              <Link to={`/post/${post._id}`}>
                <img
                  src={"http://localhost:3001/" + post.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-auto object-cover object-center"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ImageGallery };
