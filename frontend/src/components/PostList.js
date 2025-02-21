import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { FaHeart, FaComment } from "react-icons/fa";
import "../CSS/PostList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const commentInputRefs = useRef({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch Logged-in User
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:4000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Handle Like
  const handleLike = async (postId) => {
    if (!user) {
      alert("You must be logged in to like a post.");
      navigate("/login"); // Redirect to login page
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/api/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle Comment
  const handleComment = async (postId) => {
    if (!user) {
      alert("You must be logged in to comment.");
      navigate("/login"); // Redirect to login page
      return;
    }

    const commentText = commentInputRefs.current[postId]?.value.trim();
    if (!commentText) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/api/posts/comment/${postId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: res.data.comments } : post
        )
      );

      commentInputRefs.current[postId].value = "";
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Toggle Comments Visibility
  const toggleComments = (postId) => {
    if (!user) {
      alert("You must be logged in to view comments.");
      navigate("/login"); // Redirect to login page
      return;
    }

    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setShowCommentInput((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="post-list-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h3 className="post-username">{post.username}</h3>

          {/* Image (if available) */}
          {post.image && (
            <img
              src={`http://localhost:4000/uploads/${post.image}`}
              alt="Post"
              className="post-image"
            />
          )}
          <p className="post-content">{post.content}</p>

          {/* Like & Comment Icons */}
          <div className="post-actions">
            <button className="like-button" onClick={() => handleLike(post._id)}>
              <FaHeart className="icon" /> {post.likes} Likes
            </button>

            <button className="comment-button" onClick={() => toggleComments(post._id)}>
              <FaComment className="icon" /> {post.comments.length} Comments
            </button>
          </div>

          {/* Comments Section */}
          {showComments[post._id] && (
            <div className="comments-section">
              <h4>Comments</h4>
              {post.comments.map((comment, index) => (
                <p key={index} className="comment-text">
                  <strong>{comment.username}</strong> {comment.text}
                </p>
              ))}

              {/* Add Comment Input */}
              {showCommentInput[post._id] && (
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="comment-input"
                  ref={(el) => (commentInputRefs.current[post._id] = el)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleComment(post._id);
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
