import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { registerAsync } from "@/stores/slices/AuthSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      "Password must contain at least one letter, one uppercase, one number and one special character"
    )
    .required("Password is required"),
});

const Register = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await dispatch(registerAsync(data));
      if(res.payload) {
        toast.success(res.payload.message || "Registered successfully");
      } 
    } catch (error) {
      console.log("error", error)
    }   
  };

  return (
    <div className="flex justify-center items-center w-screen mx-auto h-screen my-auto">
      <Toaster />
      <div className="w-[400px] h-[500px] rounded-xl shadow-lg shadow-blue-500/50  border-1 border-blue-500 bg-gradient-to-bl from-[#A9F1DF] to-[#FFBBBB]">
        <div className="flex flex-col my-8">
          <div className="flex justify-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              id="Capa_1"
              width="30"
              height="30"
              fill="#000"
              version="1.1"
              viewBox="0 0 58 58"
            >
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#0683ea"
                  d="M39.767 25.913a1 1 0 0 1-.878-.519c-2.795-5.097-8.115-8.679-13.883-9.349a1 1 0 1 1 .23-1.986c6.401.743 12.304 4.718 15.406 10.373a1 1 0 0 1-.875 1.481"
                ></path>
                <path
                  fill="#37b7e1"
                  d="m0 58 4.042-12.125a23 23 0 0 1-3.231-11.78C.81 21.34 11.15 11 23.905 11S47 21.34 47 34.095 36.66 57.19 23.905 57.19c-3.881 0-7.535-.961-10.745-2.653z"
                ></path>
                <path
                  fill="#47363D"
                  d="M23.905 11C36.66 11 47 21.34 47 34.095c0 3.378-.731 6.583-2.034 9.475L58 47l-4.042-12.125a23 23 0 0 0 3.231-11.78C57.19 10.34 46.85 0 34.095 0c-9.426 0-17.528 5.65-21.118 13.746A23 23 0 0 1 23.905 11"
                ></path>
              </g>
            </svg>
            <h1 className="text-2xl font-bold text-blue-950 font-sans">
              {" "}
              Chat App
            </h1>
          </div>

          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-blue-600 font-mono">
              Register
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-col mt-5 w-full px-10">
                <label htmlFor="email" className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Name
                </label>
                <input
                  className=" rounded-2xl border-2 border-blue-500 p-2 h-8 bg-white text-sm"
                  type="text"
                  placeholder="Enter your name here..."
                  {...register("name")}
                />
                {errors && errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col mt-5 w-full px-10">
                <label htmlFor="email" className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Email
                </label>
                <input
                  className=" rounded-2xl border-2 border-blue-500 p-2 h-8 bg-white text-sm"
                  type="text"
                  placeholder="Enter your email here..."
                  {...register("email")}
                />
                {errors && errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col mt-5 w-full px-10">
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Password
                </div>
                <div className="relative flex w-full bg-white h-8 px-2  border-2 border-blue-500 rounded-2xl">
                  <input
                    className=" bg-white outline-none w-full text-sm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password here..."
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors && errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button className="rounded-xl shadow-lg px-10 py-2 mt-5 bg-gradient-to-tl text-white font-mono  from-[#614385] to-[#516395] hover:scale-105 font-semibold">
                Sign Up
              </button>
            </div>

            <div className="flex justify-center items-center mt-2">
              <p className="">
                Have an account?{" "}
                <Link href="/login" className="text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
