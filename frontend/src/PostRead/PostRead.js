import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaHeart, FaRegComment, FaEllipsisH } from 'react-icons/fa';
import config from '../config';
import './PostRead.css';

const PostRead = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/posts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setPost(data);
        setLiked(Boolean(data.isLiked || (data.likes && data.likes.includes && data.likes.includes('me'))));
      } else {
        console.error('Post not found');
      }
    } catch (err) {
      console.error('Failed to fetch post data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!post || liking) return;
    setLiking(true);
    setLiked((v) => !v); 

    try {
      const res = await fetch(`${config.apiUrl}/posts/like/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        setLiked((v) => !v);
      } else {
        fetchPost();
      }
    } catch (err) {
      console.error('Like failed', err);
      setLiked((v) => !v);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!post) return;
    const text = window.prompt('Write your comment:');
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`${config.apiUrl}/posts/comment/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error('Failed to post comment');
      }
      await fetchPost();
    } catch (err) {
      console.error('Comment failed', err);
      alert('Failed to post comment.');
    }
  };

  if (loading || !post) return <p className="postReadLoading">Loading...</p>;

  return (
    <div className="postReadContainer">
      <div className="postReadMainContainer">
        <h2 className="postTitle">{post.title}</h2>
        <div className="postMetaRow">
          <p className="postDate">{new Date(post.createdAt).toLocaleDateString()}</p>
          <p className="postAuthor">By: {post.author?.username || 'Unknown'}</p>
        </div>

        {post.image && <img src={post.image} alt={post.title} className="postImage" />}

        <div className="postContentWrapper">
          <p className="postContent">{post.content}</p>
        </div>

        <div className="postActionsRow">
          <button
            className={`actionBtn likeBtn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            aria-pressed={liked}
            title="Like"
            disabled={liking}
          >
            <FaHeart />
            <span className="actionLabel">{(post.likes && post.likes.length) || (liked ? 1 : 0)}</span>
          </button>

          <button
            className="actionBtn"
            onClick={handleComment}
            title="Comment"
          >
            <FaRegComment />
            <span className="actionLabel">{post.comments ? post.comments.length : 0}</span>
          </button>

          <button className="actionBtn" title="More">
            <FaEllipsisH />
          </button>
        </div>

        <h3 className="commentsHeading">Comments</h3>
        <div className="commentsSection">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p className="commentUser">{comment.user?.username || 'User'}</p>
                <p className="commentText">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="noComments">No comments yet — be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostRead;
