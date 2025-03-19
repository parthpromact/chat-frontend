import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
}

const initialState = {
  messages: [] as Message[],
  loading: false,
};

export const conversationMessages = createAsyncThunk(
  "conversation/fetchMessages",
  async (params: any) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/messages?receiverId=${params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const sendMessages = createAsyncThunk(
  "message/sendMessage",
  async ({ content, receiverId }: { content: string; receiverId: number }) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/messages`,
      { content, receiverId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(conversationMessages.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(conversationMessages.fulfilled, (state, action) => {
      state.messages = action.payload.data;
      state.loading = false;
    });
    builder.addCase(conversationMessages.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default messageSlice.reducer;
