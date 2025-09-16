import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../config';
import './PostRead.css';

const PostRead = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/posts/${id}`, {
          method: 'GET',
          credentials: 'include', 
        });

        const data = await response.json();
        if (response.ok) {
          setPost(data); 
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Failed to fetch post data', error);
      }
    };

    fetchPost();
  }, [id]); 

  if (!post) return <p>Loading...</p>;

  return (
    <div className="postReadContainer">
      <div className="postReadMainContainer">
        <h2 className="postTitle">{post.title}</h2>
        <p className="postDate">{new Date(post.createdAt).toLocaleDateString()}</p>
        <p className="postAuthor">By: {post.author.username}</p>
        {post.image && <img src={post.image} alt={post.title} className="postImage" />}
        <p className="postContent">{post.content}</p>

        <h3>Comments</h3>
        <div className="commentsSection">
          {post.comments ? post.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p className="commentUser">{comment.user.username}</p>
              <p>{comment.text}</p>
            </div>
          )): 0}
        </div>
      </div>
    </div>
  );
};

export default PostRead;
