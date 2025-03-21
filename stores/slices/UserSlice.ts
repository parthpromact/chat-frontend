import {
  createSlice,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
}

const initialState = {
  users: [] as User[],
  loading: false,
  userSelected: null,
};

export const userList = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return {
      message: response?.data?.message,
      users: response?.data?.data,
    };
  } catch (error: any) {
    if (error?.response) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      return isRejectedWithValue(message);
    } else {
      return isRejectedWithValue("Something went wrong");
    }
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userSelected = action?.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userList.fulfilled, (state, action: PayloadAction<any>) => {
      state.users = action?.payload?.users;
      state.loading = false;
    });
    builder.addCase(userList.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
