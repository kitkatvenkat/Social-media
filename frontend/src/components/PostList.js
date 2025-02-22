import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import "../CSS/PostList.css";
import { FaUserCircle } from "react-icons/fa";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState({});
  const [dislikedPosts, setDislikedPosts] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const commentInputRefs = useRef({});

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/posts");
      setPosts(res.data);

      const storedLikes = JSON.parse(localStorage.getItem("likedPosts")) || {};
      const storedDislikes = JSON.parse(localStorage.getItem("dislikedPosts")) || {};
      setLikedPosts(storedLikes);
      setDislikedPosts(storedDislikes);
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
      navigate("/login");
      return;
    }

    try {
      const isLiked = likedPosts[postId];
      const res = await axios.post(
        `http://localhost:4000/api/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes, dislikes: res.data.dislikes } : post
        )
      );

      const updatedLikes = { ...likedPosts, [postId]: !isLiked };
      const updatedDislikes = { ...dislikedPosts, [postId]: false };
      setLikedPosts(updatedLikes);
      setDislikedPosts(updatedDislikes);
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
      localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikes));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle Dislike
  const handleDislike = async (postId) => {
    if (!user) {
      alert("You must be logged in to dislike a post.");
      navigate("/login");
      return;
    }

    try {
      const isDisliked = dislikedPosts[postId];
      const res = await axios.post(
        `http://localhost:4000/api/posts/dislike/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes, dislikes: res.data.dislikes } : post
        )
      );

      const updatedDislikes = { ...dislikedPosts, [postId]: !isDisliked };
      const updatedLikes = { ...likedPosts, [postId]: false };
      setDislikedPosts(updatedDislikes);
      setLikedPosts(updatedLikes);
      localStorage.setItem("dislikedPosts", JSON.stringify(updatedDislikes));
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikes));
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };
  // Handle Comment
  const handleComment = async (postId) => {
    if (!user) {
      alert("You must be logged in to comment.");
      navigate("/login");
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
      navigate("/login");
      return;
    }
  // Toggle visibility of comments
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], 
    }));
  // Always show the comment input when comments are opened
    setShowCommentInput((prev) => ({
      ...prev,
      [postId]: true, 
    }));
  };
  


  return (
    <div className="post-list-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h3 className="post-username">
          <FaUserCircle className="profile-icon" />
          {post.username}</h3>

          {post.image && (
            <img
              src={`http://localhost:4000${post.image}`}
              alt="Post"
              className="post-image"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <p className="post-content">{post.content}</p>

          <div className="post-actions">
  <div className="action-button like-button" onClick={() => handleLike(post._id)}>
    {likedPosts[post._id] ? <FaHeart className="liked-icon" /> : <FaRegHeart className="like-icon" />}
    <span>{post.likes}</span>
  </div>

  <div className="action-button dislike-button" onClick={() => handleDislike(post._id)}>
    {dislikedPosts[post._id] ? <div className="disliked-icon">💔</div> : <div className="dislike-icon">🤍</div>}
    <span>{post.dislikes}</span>
  </div>

  <div className="action-button comment-button" onClick={() => toggleComments(post._id)}>
    <FaComment className="comment-icon" />
    <span>{post.comments?.length || 0}</span>
  </div>
</div>


          {/* Comments Section */}
          {showComments[post._id] && (
            <div className="comments-section">
              <h4>Comments</h4>
              {post.comments?.map((comment, index) => (
                <p key={index} className="comment-text">
                  <strong>{comment.username}</strong>{comment.text}
                </p>
              ))}

              {/* Add Comment Input */}
              {showCommentInput[post._id] && (
                  <div className="comment-input-container">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="comment-input"
                    ref={(el) => (commentInputRefs.current[post._id] = el)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleComment(post._id);
                    }}
                  />
                  <button className="send-button" onClick={() => {handleComment(post._id)}}>
                  📩

                  </button>
                </div>
                
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
