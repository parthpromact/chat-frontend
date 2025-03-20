import { setUser } from "@/stores/slices/UserSlice";
import dynamic from "next/dynamic";
const Userlist = dynamic(() => import("@/components/Userlist"), { ssr: false });
const Chatbody = dynamic(() => import("@/components/Chatbody"), { ssr: false });
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const ChatConversation = () => {
  const dispatch = useDispatch<any>();
  const users = useSelector((state: any) => state.users.users);
  console.log("🚀 ~ ChatConversation ~ users:", users)
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

  return (
    <div className="flex">
      <Toaster />
        <>
          <Userlist users={users} selectedUser={Number(params?.id)}/>
          <Chatbody isSelectedUser={true} selectedUserId={Number(params?.id)}/>
        </>
    </div>
  );
};

export default ChatConversation;

