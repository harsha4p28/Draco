import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts } from '../features/userPostsSlice';
import './Profile.css';
import config from '../config';

const Profile = ({ userId }) => {
  const dispatch = useDispatch();
  const { items: userPosts, loading } = useSelector((state) => state.userPosts);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts({ userId }));
    }
  }, [dispatch, userId]);

  const handleLogout = async () => {
    try {
      await fetch(`${config.apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      //dispatch(resetUser()); 

      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="profileContainer">
      <div className="profileMainContainer">
        <div className="profileHeader">
          <h1 className="profileTitle">Profile</h1>
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
          
        </div>

        <div className="userBlogs">
          <h2 className="blogsTitle">Your Blogs</h2>

          {loading && <p>Loading your blogs...</p>}
          {!loading && userPosts.length === 0 && <p>You haven’t posted any blogs yet.</p>}

          <div className="blogsList">
            {userPosts.map((post) => (
              <div className="blogCard" key={post._id}>
                {post.image && <img src={post.image} alt={post.title} className="blogImage" />}
                <div className="blogContent">
                  <h3 className="blogTitle">{post.title}</h3>
                  <p className="blogText">{post.content}</p>
                  <p className="blogDate">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
