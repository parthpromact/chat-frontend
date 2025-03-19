import React, { use, useEffect } from 'react';
import Chatbody from '@/components/Chatbody';
import Userlist from '@/components/Userlist';
import { useDispatch, useSelector } from 'react-redux';
import { userList } from '@/stores/slices/UserSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import toast, { Toaster } from 'react-hot-toast';

const Chat = () => {
    const dispatch = useDispatch<any>();
    const users = useSelector((state: any) => state.users.users);

    const fetchUsers = async () => {
        const response = await dispatch(userList());
        const unwrappedRes = await unwrapResult(response);  
        console.log("🚀 ~ fetchUsers ~ unwrappedRes:", unwrappedRes)
        if(unwrappedRes.error) {
            toast.error(unwrappedRes.error.message || "Something went wrong");
        } else {
            toast.success(unwrappedRes.message || "Fetched Users Suceesfully");
        }
    }
    
    useEffect(() => {
        fetchUsers();
    }, [])

  return (
    <div className='flex'>
        <Toaster />
        <Userlist users={users}/>
        <Chatbody isSelectedUser={false}/>
    </div>
  )
}

export default Chat;