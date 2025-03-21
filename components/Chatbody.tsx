import { conversationMessages } from "@/stores/slices/MessageSlice";
import axios from "axios";
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
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch<any>();
  const messages = useSelector((state: any) => state.messages.messages);
  const totalPages = useSelector((state: any) => state.messages.totalPages);
  const currentPage = useSelector((state: any) => state.messages.currentPage);
  const selectedUser = useSelector((state: any) => state.users.userSelected);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [messageId, setMessageId] = useState<number>(0);
  const chatContainerRef = useRef<any>(null); // ChatRef
  const prevMsgRef = useRef<any[]>([]); // MessageRef
  const prevUserIdRef = useRef<any>(undefined); // ref for USer
  const prevHeight = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMain, setIsMain] = useState(true);
  const [isEditDialog, setIsEditDialog] = useState<any>(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    if (chatContainerRef.current && !isLoading && currentPage === 1) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, currentPage]);

  useEffect(() => {
    if (selectedUserId !== prevUserIdRef.current) {
      prevMsgRef.current = messages || [];
      prevUserIdRef.current = selectedUserId;
    } else if (currentPage > 1) {
      const existId = new Set(prevMsgRef.current.map((i) => i.id));
      const newMessage = (messages || []).filter(
        (v: any) => !existId.has(v.id)
      );
      prevMsgRef.current = [...prevMsgRef.current, ...newMessage];
    } else {
      prevMsgRef.current = messages || [];
    }
  }, [messages, selectedUserId, currentPage]);

  useEffect(() => {
    setPage(1);
    if (selectedUserId) {
      setMessage("");
      setIsEdit(false);
      fetchConversation(1);
      setHasMore(false);
    }
  }, [selectedUserId]);

  // Handle loading older messages when scrolling to top
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop } = chatContainerRef.current;
        if (scrollTop < 50 && currentPage < totalPages && !isLoading) {
          prevHeight.current = chatContainerRef.current.scrollHeight;
          setPage(currentPage + 1);
          fetchConversation(currentPage + 1);
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
  }, [currentPage, totalPages, isLoading]);

  useEffect(() => {
    if (
      chatContainerRef.current &&
      isLoading === false &&
      prevHeight.current > 0
    ) {
      const newHeight = chatContainerRef.current.scrollHeight;
      const heightDifference = newHeight - prevHeight.current;
      chatContainerRef.current.scrollTop =
        heightDifference > 0 ? heightDifference : 0;
      prevHeight.current = 0;
    }
  }, [isLoading]);

  const fetchConversation = async (page: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await dispatch(
        conversationMessages({ id: selectedUserId, page })
      );
      if (response?.payload) {
        if (currentPage < totalPages) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        if (!toastDisplayed && isMain) {
          toast.success(
            response?.payload?.message || "Fetched messages successfully",
            { id: "messages" }
          );
          setToastDisplayed(true);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
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
          if (response.status == 200) {
            toast.success(
              response?.data?.message || "Message edited successfully"
            );
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        } finally {
          setIsEdit(false);
          setMessage("");
          setIsMain(false);
          delay(1000).then(() => fetchConversation(1));
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

          if (response.status == 200) {
            toast.success(
              response?.data?.message || "Message sent successfully"
            );
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.message || "Something went wrong";
          toast.error(errorMessage);
        } finally {
          setMessage("");
          setIsMain(false);
          delay(1000).then(() => fetchConversation(1));
        }
      }
    }
  };

  const handleEditMessage = async (message: any) => {
    setMessage(message.content);
    setIsEdit(true);
    setMessageId(message.id);
    setIsModalOpen((prev: any) => ({
      ...prev,
      [message.id]: !prev[message.id],
    }));
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
      if (response.status == 200) {
        toast.success(
          response?.data?.message || "Message deleted successfully"
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsMain(false);
      delay(1000).then(() => fetchConversation(1));
    }
  };

  const disMsg = prevMsgRef.current;

  return (
    <div className="bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB] h-screen w-2/3 overflow-y-hidden flex flex-col">
      {isSelectedUser ? (
        <>
          <div
            ref={chatContainerRef}
            id="chatContainer"
            className="flex flex-col items-end space-y-4 overflow-y-auto flex-grow p-4"
          >
            {isLoading && currentPage > 1 && (
              <div className="w-full text-center py-2 text-gray-600">
                Loading older messages...
              </div>
            )}
            {disMsg && disMsg?.length > 0 ? (
              [...disMsg].reverse().map((message: any, index: number) => (
                <div
                  key={message.id || index}
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
                                  onClick={() => {
                                    setIsEditDialog(true);
                                    handleEditMessage(message);
                                  }}
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
                                            onClick={() => {
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                              setIsModalOpen((prev: any) => ({
                                                ...prev,
                                                [message.id]: !prev[message.id],
                                              }));
                                            }}
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
                                              setIsModalOpenConfirm({
                                                ...isModalOpenConfirm,
                                                [message.id]: false,
                                              });
                                              setIsModalOpen((prev: any) => ({
                                                ...prev,
                                                [message.id]: !prev[message.id],
                                              }));
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
            {isEditDialog && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-100">
                <div className="bg-blue-950 w-80 rounded-md shadow-lg p-4">
                  <div className="flex flex-col items-center py-2">
                    <p className="text-sm text-center text-white">
                      Are you sure you want to edit this Message?
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer text-xs"
                        onClick={() => {
                          setIsEditDialog(false);
                          setIsEdit(false);
                          setMessage("");
                        }}
                      >
                        Decline
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer text-xs"
                        onClick={() => {
                          setIsEditDialog(false);
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <input
              type="text"
              value={message}
              className="w-full p-2 rounded-md border-2 bg-white border-purple-900 outline-1 outline-purple-900"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="rounded-xl shadow-lg px-10 py-2 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold cursor-pointer"
              onClick={messageSent}
            >
              {isEdit ? "Edit" : "Send"}
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
