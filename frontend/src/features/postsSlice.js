import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../config';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${config.apiUrl}/posts?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    resetPosts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        } else {
          state.items = [...state.items, ...action.payload];
          state.page += 1;
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;