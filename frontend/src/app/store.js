import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/postsSlice';
import userPostsReducer from '../features/userPostsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    userPosts: userPostsReducer,
  },
});