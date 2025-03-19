import { sendMessages } from "@/stores/slices/MessageSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Chatbody = ({
  isSelectedUser,
  selectedUser,
  messages,
}: {
  isSelectedUser: boolean;
  selectedUser?: number;
  messages?: any[];
}) => {
const router = useRouter()
const [message, setMessage] = useState<string>("");
  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString().slice(10, 26);
  };
  const token = localStorage.getItem("token");
  
  const messageSent = async () => {
    if (message.trim() !== "") {
      try {
      const response: any =  await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        { content: message, receiverId: selectedUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
        toast.success(response.data.message || "Message sent successfully");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }finally{
        router.refresh();
      }
    }
  }

  return (
    <div className="bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB] h-screen w-2/3 overflow-y-hidden">
      {isSelectedUser ? (
        <>
          <div className="flex flex-col items-end space-y-4 overflow-y-auto h-11/12">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full px-4 items-end"
                >
                  {message.senderId !== selectedUser ? (
                    <div className="ml-auto">
                      <div className="bg-blue-500 text-white p-2 rounded-md shadow">
                        <p className="text-base">{message.content}</p>
                      </div>
                      <p className="text-xs mt-1 text-right text-gray-600">
                        {dateFormatter(message.createdAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="mr-auto">
                      <div className="bg-white p-2 rounded-md shadow">
                        <p className="text-base">{message.content}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        {dateFormatter(message.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No messages to display.
              </div>
            )}
          </div>
          <div className="flex px-2 gap-2">
            <input
              type="text"
              value={message}
              className="w-full p-2 rounded-md border-2 bg-white border-purple-900 outline-1 outline-purple-900"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="rounded-xl shadow-lg px-10 py-2 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold" onClick={messageSent}>
              Send
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center h-full font-semibold font-mono text-xl">
            To start a conversation, select a user from the left.
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbody;
