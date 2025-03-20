import { userList } from "@/stores/slices/UserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { use, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface User {
  id: number;
  name: string;
  email: string;
}
const Userlist = ({ users, selectedUser}: { users: User, selectedUser?: number }) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  // const params = useParams();
  // console.log("🚀 ~ Userlist ~ params:", params)
  // const selectedUser = params ? Number(params?.id) : 0;
  const capLetter = (str: String) => {
    return str.charAt(0).toUpperCase();
  };

  const handleClick = (id: number) => {
   router.push(`/chat/user/${id}`);
  };

  const fetchUsers = async () => {
    try {
      const response = await dispatch(userList());
      if(response.payload) {
         toast.success(response.payload.data.message || "Fetched Users Suceesfully");
      } 
    } catch (error) {
     console.log("error", error)
    }
    
    
}

useEffect(() => {
    fetchUsers();
}, [])

  return (
    <div className="flex flex-col w-1/3 border-r-2 border-blue-500 h-screen overflow-y-auto">
      <div className="flex flex-col">
        <div className="flex gap-3 p-3 text-center justify-center border-b-4 border-blue-500">
         <p className="text-xl font-semibold">Users List</p>
        </div>
        <div>
        {users &&
          Array.isArray(users) &&
          users.length > 0 &&
          users.map((user: User) => (
            <div
              key={user.id}
              className={`gap-3 p-3 rounded-md ${selectedUser === user.id ? "bg-gradient-to-tr to-[#614385] from-[#516395] text-white" : ""}`}
              onClick={() => handleClick(user.id)}
            >
              <div className="flex gap-2">
                <div className="w-1/6">
                  <div className={`w-10 h-10 rounded-full ${selectedUser === user.id ? "bg-white" : "bg-blue-500"}`} style={{textAlign: "center", paddingTop: "0.5rem"}}>
                    <p className={`  ${selectedUser === user.id ? "text-blue-500 font-extrabold" : "text-white font-bold"}`}>
                      {capLetter(user.name)}
                    </p>
                  </div>
                </div>
                <div className="w-5/6">
                  <p className="font-bold">
                    {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                  </p>
                  <p className={selectedUser === user.id ? "text-white" : "text-gray-400"} style={{fontSize: "0.875rem"}}>{user.email}</p>
                </div>
              </div>
              <div className="relative flex mt-4 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};

export default Userlist;
