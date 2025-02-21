import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import Navbar from "../components/Navbar";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />

      {/* Post Creation Form (Visible only if logged in) */}
      {user ? (
        <>
         
         
        </>
      ) : (
        <>
         
        </>
      )}

      {/* Display Posts */}
      <PostList />
    </div>
  );
};

export default Home;
