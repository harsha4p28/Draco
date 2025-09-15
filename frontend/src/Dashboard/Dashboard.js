import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../features/postsSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: posts, page, hasMore, loading } = useSelector((state) => state.posts);

  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchPosts({ page, limit: 15 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts({ page: 1, limit: 15 }));
    }
  }, [dispatch]);

  return (
    <div className="dashboardContainer">
      <div className="dashboardMainContainer">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div className="postCard" key={post._id} ref={lastPostRef}>
                {post.image && <img src={post.image} alt={post.title} className="postImage" />}
                <div className="postContent">
                  <h3 className="postTitle">{post.title}</h3>
                  <p className="postText">{post.content}</p>
                  <div className="postTags">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="postDate">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div className="postCard" key={post._id}>
                {post.image && <img src={post.image} alt={post.title} className="postImage" />}
                <div className="postContent">
                  <h3 className="postTitle">{post.title}</h3>
                  <p className="postText">{post.content}</p>
                  <div className="postTags">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="postDate">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          }
        })}

        {loading && <p>Loading more posts...</p>}
        {!hasMore && <p>No more posts available.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
