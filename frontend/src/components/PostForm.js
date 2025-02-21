import { useState } from "react";
import axios from "axios";

const PostForm = ({ fetchPosts }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:4000/api/posts",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchPosts(); // Refresh post list
    } catch (error) {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write something..." required />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;
