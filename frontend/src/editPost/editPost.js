import React, { useState, useEffect } from 'react'
import '../Post/Post.css'
import config from '../config'

const EditPost = ({ post, onCancel, onUpdate }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([])
  const [image, setImage] = useState(null)
  const [errMsg, setErrMsg] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (post) {
      setTitle(post.title || "")
      setContent(post.content || "")
      setTags(post.tags || [])
    }
  }, [post])

  const handleTagChange = (e) => {
    const value = e.target.value
    if (value && !tags.includes(value)) {
      setTags([...tags, value])
    }
    e.target.value = ""
  }

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("tags", JSON.stringify(tags))
    if (image) formData.append("image", image)

    try {
      const res = await fetch(`${config.apiUrl}/posts/${post._id}`, {
        method: "PUT",
        credentials: 'include',
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        console.log("Post updated:", data)
        setSuccess(true)
        if (onUpdate) onUpdate(data)
      } else {
        setErrMsg("Error updating post. Please try again.")
      }
    } catch (err) {
      console.error("Error updating post:", err)
      setErrMsg("Error updating post. Please try again.")
    }
  }

  return (
    <div className='postContainer'>
      <div className='postMainContainer'>
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type='text' 
            placeholder='Title' 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea 
            placeholder='Content' 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <select onChange={handleTagChange} defaultValue="">
            <option value="" disabled>Choose a tag</option>
            <option value="Technology">Technology</option>
            <option value="Programming">Programming</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
          </select>

          <div className="tagList">
            {tags.map((tag, idx) => (
              <span key={idx} className="tagItem">
                {tag} <button type="button" onClick={() => removeTag(tag)}>x</button>
              </span>
            ))}
          </div>

          <input 
            type='file' 
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />

          {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
          {success && <p style={{ color: 'green' }}>Post updated successfully!</p>}

          <div className="formButtons">
            <button type='submit'>Update Post</button>
            <button type='button' onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPost
