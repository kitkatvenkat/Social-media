import { useState } from "react";
import axios from "axios";
import "../CSS/PostForm.css"; // Import CSS file

const PostForm = ({ fetchPosts }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent(""); // Clear input
      setImage(null); // Clear image
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        required
      />
      
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;
