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
  const { user } = useSelector(selectAuthState);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  interface LoginParams {
    email: string;
    password: string;
  }

  const login = async ({ email, password }: LoginParams) => {
    try {
      const res = await dispatch(loginAsync({ email, password }));
      if (res?.payload) {
        toast.success(res?.payload?.message || "Logged in successfully");
        router.push("/chat");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const logoutUser = async () => {
    try {
      await dispatch(logout());
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logoutUser }}>
      <>
        <Toaster />
        {children}
      </>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
