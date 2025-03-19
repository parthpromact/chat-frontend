import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, logout } from "@/stores/slices/AuthSlice";

import { unwrapResult } from "@reduxjs/toolkit";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const selectAuthState = (state: any) => state.auth;
  const { isAuthenticated, user } = useSelector(selectAuthState);
  console.log("🚀 ~ AuthProvider ~ isAuthenticated:", isAuthenticated)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push('/chat');
    } else {
      router.push("/login");
    }
  }, []);
  
  
  interface LoginParams {
    email: string;
    password: string;
  }

  const login = async ({ email, password }: LoginParams) => {
    try {
      const res = await dispatch(loginAsync({ email, password }));
      const unwrappedRes = await unwrapResult(res);
      if(unwrappedRes.error) {
        toast.error(unwrappedRes.error.message || "Something went wrong");
      } else {
        toast.success(unwrappedRes.data.message || "Logged in successfully");
        router.push('/chat');
      }
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const logout = async () => {
    try {
      await dispatch(logout());
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <>
        <Toaster />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

