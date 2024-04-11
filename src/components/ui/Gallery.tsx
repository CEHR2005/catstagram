import { useEffect, useState } from "react";

function ImageGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/posts/images")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="overflow-hidden rounded-lg shadow-lg">
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-auto object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

export { ImageGallery };
