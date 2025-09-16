import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../features/postsSlice';
import { FaHeart, FaRegComment, FaEllipsisH } from 'react-icons/fa';
import './Dashboard.css';
import config from '../config';
import { Link } from 'react-router-dom';

const truncateWords = (text, wordLimit = 150) => {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const didFetch = useRef(false);
  const { items: posts, page, hasMore, loading } = useSelector((state) => state.posts);

  const observer = useRef();

  const [expanded, setExpanded] = useState({});
  const [liked, setLiked] = useState({});
  const [likingIds, setLikingIds] = useState(new Set());

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
    if (!didFetch.current && posts.length === 0) {
      dispatch(fetchPosts({ page: 1, limit: 15 }));
      didFetch.current = true;
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    const initial = {};
    posts.forEach((p) => initial[p._id] = false);
    setLiked((prev) => ({ ...initial, ...prev }));
  }, [posts]);

  const toggleExpand = (id) => {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  };

  const handleLike = async (postId) => {
    if (likingIds.has(postId)) return;
    setLikingIds((s) => new Set([...s, postId]));
    setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));

    try {
      await fetch(`${config.apiUrl }/posts/like/${postId}`, {
        method: 'POST',
        credentials:'include'
      });
    } catch (err) {
      setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
      console.error('Like request failed', err);
    } finally {
      setLikingIds((s) => {
        const newSet = new Set(s);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleComment = async (postId) => {
    const text = window.prompt('Write your comment:');
    if (!text || !text.trim()) return;

    try {
      await fetch(`${config.apiUrl}/posts/comment/${postId}`, {
        method: 'POST',
        credentials:'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      dispatch(fetchPosts({ page: 1, limit: page * 15 }));
    } catch (err) {
      console.error('Comment failed', err);
      alert('Failed to post comment.');
    }
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardMainContainer">
        {posts.map((post, index) => {
          const isLast = posts.length === index + 1;
          const isExpanded = !!expanded[post._id];
          const content = post.content || '';
          const short = truncateWords(content, 50);

          const card = (
            <div className="postCard" key={post._id}>
              {post.image && <img src={post.image} alt={post.title} className="postImage" />}
              <div className="postContent">
                <Link to={`/post/${post._id}`}>
                <h3 className="postTitle">{post.title}</h3>
                <p className="postText">
                  {isExpanded ? content : short}
                  {content.split(/\s+/).length > 150 && (
                    <button className="readMoreBtn" onClick={() => toggleExpand(post._id)}>
                      {isExpanded ? ' show less' : ' read more'}
                    </button>
                  )}
                </p>
                  </Link>
                
                <div className="postTags">
                  {Array.isArray(post.tags) && post.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                

                <div className="postActions">
                  <button
                    className={`actionBtn likeBtn ${liked[post._id] ? 'liked' : ''}`}
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

                  <button className="actionBtn" title="More">
                    <FaEllipsisH />
                  </button>
                </div>

                <p className="postDate">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );

          if (isLast) return <div ref={lastPostRef} key={post._id}>{card}</div>;
          return card;
        })}

        {loading && <p>Loading more posts...</p>}
        {!hasMore && <p>No more posts available.</p>}
      </div>
    </div>
  );
};

export default Dashboard;