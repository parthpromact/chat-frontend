import Chatbody from "@/components/Chatbody";
import Userlist from "@/components/Userlist";
import { conversationMessages } from "@/stores/slices/MessageSlice";
import { setUser } from "@/stores/slices/UserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ChatConversation = () => {
  const dispatch = useDispatch<any>();
  const users = useSelector((state: any) => state.users.users);
  const messages = useSelector((state: any) => state.messages.messages);
  const selectedUser = useSelector((state: any) => state.users.userSelected);
  const params = useParams();

  const id = useMemo(() => {
    if (params && params.id) {
      return Number(params.id);
    }
    return null;
  }, [params]);

  useEffect(() => {
    if (id !== null) {
      dispatch(setUser(id));
    }
  }, [id]);

  const fetchConversation = async () => {
    const response = await dispatch(
      conversationMessages({ id: id ? id : selectedUser })
    );
    const unwrappedRes = await unwrapResult(response);
    if (unwrappedRes.error) {
      toast.error(unwrappedRes.error.message || "Something went wrong");
    } else {
      toast.success(unwrappedRes.message || "Conversation fetched successfully");
    }
  };

  useEffect(() => {
    if (id !== null) {
      fetchConversation();
    }
  }, [id]);

  return (
    <div className="flex">
      <Toaster />
      {id && (
        <>
          <Userlist users={users} selectedUser={id} />
          <Chatbody isSelectedUser={true} selectedUser={id} messages={messages} />
        </>
      )}
    </div>
  );
};

export default ChatConversation;

