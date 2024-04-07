import { useEffect, useState } from 'react';

function ImageGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/posts/images')
            .then(response => response.json())
            .then(data => setImages(data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt="" loading="lazy" />
            ))}
        </div>
    );
}

export {ImageGallery};