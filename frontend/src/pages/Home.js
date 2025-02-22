import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostList from "../components/PostList";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [ref , setref] = useState(false);

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/posts");
      setPosts(response.data);
      setref(!ref)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Pass fetchPosts to Navbar */}
      <Navbar fetchPosts={fetchPosts}  ref={ref} setref={setref}/>

      {/* Pass posts to PostList */}
      <PostList posts={posts} />
    </div>
  );
};

export default Home;
