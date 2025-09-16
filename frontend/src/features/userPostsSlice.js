import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../config';

export const fetchUserPosts = createAsyncThunk(
  'userPosts/fetchUserPosts',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${config.apiUrl}/posts/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch user posts');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userPostsSlice = createSlice({
  name: 'userPosts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetUserPosts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserPosts } = userPostsSlice.actions;
export default userPostsSlice.reducer;
