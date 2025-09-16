import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${config.apiUrl}/posts?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (query, { rejectWithValue }) => {
    try {
      const res = await fetch(`${config.apiUrl}/posts/search?query=${query}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok){
        console.error("Search failed with status:", res)
      throw new Error("Failed to search posts");
      }
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],         
    page: 1,
    hasMore: true,
    searchResults: [],
    searching: false,  
    loading: false,
    error: null,
  },
  reducers: {
    resetPosts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searching = false;
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
      })

      .addCase(searchPosts.pending, (state) => {
        state.searching = true;
        state.error = null;
        state.searchResults = [];
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.searching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.searching = false;
        state.error = action.payload;
      });
  },
});

export const { resetPosts, clearSearch } = postsSlice.actions;
export default postsSlice.reducer;
