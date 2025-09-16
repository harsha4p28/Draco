import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts } from '../features/userPostsSlice';
import './Profile.css';
import config from '../config';
import { FaHeart, FaRegComment, FaEllipsisH } from 'react-icons/fa';
import EditPost from '../editPost/editPost';
import { Link } from 'react-router-dom';

const truncateWords = (text, wordLimit = 150) => {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const Profile = ({ userId }) => {
  const dispatch = useDispatch();
  const { items: userPosts, loading } = useSelector((state) => state.userPosts);

  const [expanded, setExpanded] = useState({});
  const [liked, setLiked] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPosts({ userId }));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const initial = {};
    userPosts.forEach((p) => (initial[p._id] = false));
    setLiked((prev) => ({ ...initial, ...prev }));
  }, [userPosts]);

  const toggleExpand = (id) => {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  };

  const handleLike = async (postId) => {
    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
    try {
      await fetch(`${config.apiUrl}/posts/like/${postId}`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
      console.error('Like request failed', err);
    }
  };

  const handleComment = async (postId) => {
    const text = window.prompt('Write your comment:');
    if (!text || !text.trim()) return;

    try {
      await fetch(`${config.apiUrl}/posts/comment/${postId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      dispatch(fetchUserPosts({ userId }));
    } catch (err) {
      console.error('Comment failed', err);
      alert('Failed to post comment.');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setMenuOpen(null);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      let res = await fetch(`${config.apiUrl}/posts/delete/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch(fetchUserPosts({ userId }));
      } else {
        console.error('Delete failed:', res);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setMenuOpen(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${config.apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleUpdate = () => {
    dispatch(fetchUserPosts({ userId }));
    setEditingPost(null);
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
          {!loading && userPosts.length === 0 && (
            <p>You haven’t posted any blogs yet.</p>
          )}

          <div className="blogsList">
            {userPosts.map((post) => {
              const isExpanded = !!expanded[post._id];
              const content = post.content || '';
              const short = truncateWords(content, 50);

              return (
                <div className="blogCard" key={post._id}>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blogImage"
                    />
                  )}
                  <div className="blogContent">
                    <Link to={`/post/${post._id}`}>
                    <h3 className="blogTitle">{post.title}</h3>
                    <p className="blogText">
                      {isExpanded ? content : short}
                      {content.split(/\s+/).length > 150 && (
                        <button
                          className="readMoreBtn"
                          onClick={() => toggleExpand(post._id)}
                        >
                          {isExpanded ? ' show less' : ' read more'}
                        </button>
                      )}
                    </p>
                    </Link>

                    <div className="postActions">
                      <button
                        className={`actionBtn likeBtn ${
                          liked[post._id] ? 'liked' : ''
                        }`}
                        onClick={() => handleLike(post._id)}
                        aria-pressed={!!liked[post._id]}
                        title="Like"
                      >
                        <FaHeart />
                      </button>

                      <button
                        className="actionBtn"
                        onClick={() => handleComment(post._id)}
                        title="Comment"
                      >
                        <FaRegComment />
                      </button>

                      <div className="moreMenuWrapper">
                        <button
                          className="actionBtn"
                          onClick={() =>
                            setMenuOpen(menuOpen === post._id ? null : post._id)
                          }
                          title="More"
                        >
                          <FaEllipsisH />
                        </button>

                        {menuOpen === post._id && (
                          <div className="overlayMenu">
                            <button onClick={() => handleEdit(post)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(post._id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="blogDate">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {editingPost && (
        <div className="editModal">
          <div className="editModalContent">
            <EditPost
              post={editingPost}
              onCancel={() => setEditingPost(null)}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
