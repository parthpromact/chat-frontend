import { conversationMessages } from "@/stores/slices/MessageSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";

const Chatbody = ({
  isSelectedUser,
  selectedUserId,
}: {
  isSelectedUser: boolean;
  selectedUserId?: number;
}) => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch<any>();
  const messages = useSelector((state: any) => state.messages.messages);
  const totalPages = useSelector((state: any) => state.messages.totalPages);
  const currentPage = useSelector((state: any) => state.messages.currentPage);
  const selectedUser = useSelector((state: any) => state.users.userSelected);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [messageId, setMessageId] = useState<number>(0);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setPage(1);
    if (selectedUserId) {
      fetchConversation();
    }
  }, [selectedUserId]);

  // Handle loading older messages when scrolling to top
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop === 0 && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore]);

  const fetchConversation = async () => {
    try {
      const response = await dispatch(
        conversationMessages({ id: selectedUserId, page })
      );
      if (response.payload) {
        if (currentPage < totalPages) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        toast.success(
          response.payload.message || "Fetched messages successfully"
        );
      }
    } catch (error) {
      console.log("error", error)
    }
  };

  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString().slice(10, 26);
  };

  const messageSent = async () => {
    const token = localStorage.getItem("token");
    if (message.trim() !== "") {
      if (isEdit) {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`,
            { content: message },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success(response.data.message || "Message edited successfully");
        } catch (error: any) {
          toast.error(error.message || "Something went wrong");
        } finally {
          router.refresh();
        }
      } else {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/messages`,
            { content: message, receiverId: selectedUser },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          toast.success(response.data.message || "Message sent successfully");
        } catch (error: any) {
          toast.error(error.message || "Something went wrong");
        } finally {
          router.refresh();
        }
      }
    }
  };

  const handleEditMessage = async (message: any) => {
    setMessage(message.content);
    setIsEdit(true);
    setMessageId(message.id);
  };

  const handleDeleteMessage = async (message: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/${message.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message || "Message deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB] h-screen w-2/3 overflow-y-hidden">
      {isSelectedUser ? (
        <>
          <div
            ref={chatContainerRef}
            id="chatContainer"
            className="flex flex-col items-end space-y-4 overflow-y-auto h-11/12"
          >
            {messages && messages.length > 0 ? (
              [...messages].reverse().map((message: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col w-full px-4 items-end"
                >
                  {message.senderId !== selectedUser ? (
                    <div className="ml-auto">
                      <div className="bg-blue-500 text-white p-2 rounded-md shadow flex gap-2 items-center justify-center text-center">
                        <p className="text-base">{message.content}</p>
                        <div className="relative text-xs">
                          <button
                            onClick={() =>
                              setIsModalOpen((prev: any) => ({
                                ...prev,
                                [message.id]: !prev[message.id],
                              }))
                            }
                          >
                            <FaEllipsisV className=" hover:scale-110 cursor-pointer " />
                          </button>
                          {isModalOpen[message.id] && (
                            <div className="absolute right-0 mt-2 w-36 bg-blue-950 hover:bg-gray-800rounded-md shadow-lg z-100">
                              <ul className="py-1">
                                <li
                                  className="px-4 py-1 cursor-pointer text-md"
                                  onClick={() => handleEditMessage(message)}
                                >
                                  Edit
                                </li>
                                <li
                                  className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                                  onClick={() => {
                                    setIsModalOpenConfirm({
                                      ...isModalOpenConfirm,
                                      [message.id]: true,
                                    });
                                  }}
                                >
                                  Delete
                                </li>
                                {isModalOpenConfirm[message.id] && (
                                  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-100">
                                    <div className="bg-blue-950 w-80 rounded-md shadow-lg p-4">
                                      <div className="flex flex-col items-center py-2">
                                        <p className="text-sm text-center">
                                          Are you sure you want to delete this
                                          message?
                                        </p>
                                        <div className="flex gap-2 mt-4">
                                          <button
                                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
                                            onClick={() =>
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              })
                                            }
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                            onClick={() => {
                                              handleDeleteMessage(message);
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
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
              <div className="flex justify-center items-center text-center h-full font-semibold font-mono text-xl mx-auto">
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
            <button
              className="rounded-xl shadow-lg px-10 py-2 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold"
              onClick={messageSent}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full font-semibold font-mono text-xl">
          To start a conversation, select a user from the left.
        </div>
      )}
    </div>
  );
};

export default Chatbody;
