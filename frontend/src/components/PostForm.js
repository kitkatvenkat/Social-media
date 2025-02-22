import axios from "axios";
import "../CSS/PostForm.css"; 
import { useState } from "react";

const PostForm = ({ fetchPosts, isModalOpen, setIsModalOpen , ref ,setref}) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(""); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name); 
    }
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
       setref(!ref)
      await axios.post("http://localhost:4000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent(""); 
      setImage(null); 
      setImageName(""); 
      fetchPosts(); 
      setIsModalOpen(false); 
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className={`post-modal ${isModalOpen ? "open" : ""}`}>
      <div className="post-modal-content">
        <span className="close-modal" onClick={() => setIsModalOpen(false)}>
          &times;
        </span>

        <form className="post-form" onSubmit={handleSubmit}>
          <label>Title</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            required
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* Display selected image name */}
          {imageName && <p className="image-name">Selected file: {imageName}</p>}

          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
