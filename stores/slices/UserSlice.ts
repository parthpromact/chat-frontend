import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

const initialState = {
  users: [] as User[],
  loading: false,
  userSelected: null
};

export const userList = createAsyncThunk("users/fetchUsers", async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userList.pending, (state, action) => {
      state.loading = true
    });
    builder.addCase(userList.fulfilled, (state, action) => {
      state.users = action.payload;
      state.loading = false
    });
    builder.addCase(userList.rejected, (state, action) => {
      state.loading = false
    });
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
