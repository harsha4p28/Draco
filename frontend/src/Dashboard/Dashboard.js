import React, { useEffect ,useState} from 'react'
import config from '../config';
import './Dashboard.css'

const Dashboard = () => {
  const [posts, setPosts] = useState ([]);
  
  const handleStart = async () =>{
    try{
      const res = await fetch(`${config.apiUrl}/posts`,{
        method:'GET',
        credentials:'include'
      });
      const data = await res.json()
      setPosts(data)
    }catch(err){
      console.log(err);
    }
  }
  useEffect (()=>{
    handleStart()
      },[]);
  return (
    <div className="dashboardContainer">
      <div className="dashboardMainContainer">
        {posts.map((post) => (
          <div className="postCard" key={post._id}>
            {post.image && <img src={post.image} alt={post.title} className="postImage" />}
            <div className="postContent">
              <h3 className="postTitle">{post.title}</h3>
              <p className="postText">{post.content}</p>
              <div className="postTags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <p className="postDate">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard