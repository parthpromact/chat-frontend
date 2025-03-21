import { userList } from "@/stores/slices/UserSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAuth } from "@/context/AuthProvider";

interface User {
  id: number;
  name: string;
  email: string;
}
const Userlist = ({
  users,
  selectedUser,
}: {
  users: User;
  selectedUser?: number;
}) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { logoutUser } = useAuth() as any;
  const [toastDisplayed, setToastDisplayed] = useState(false);

  const capLetter = (str: String) => {
    return str.charAt(0).toUpperCase();
  };

  const handleClick = (id: number) => {
    router.push(`/chat/user/${id}`);
  };

  const fetchUsers = async () => {
    try {
      const response = await dispatch(userList());
      if (response?.payload && !toastDisplayed) {
        toast.success(
          response?.payload?.data?.message || "Fetched Users Suceesfully",
          { id: "userlist" }
        );
        setToastDisplayed(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col w-1/3 border-r-2 border-blue-500 h-screen overflow-y-auto">
      <div className="flex flex-col">
        <div className="flex gap-3 p-3 text-center justify-between border-b-4 border-blue-500">
          <div>
            <p className="text-xl font-semibold text-purple-950">Users List</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gradient-to-tr to-[#614385] from-[#516395] text-white p-2 rounded-md hover:scale-105 font-semibold cursor-pointer">
              <Link href="/logs">My Logs</Link>
            </button>
            <button
              className="bg-gradient-to-tr to-[#614385] from-[#516395] text-white p-1 rounded-md cursor-pointer hover:scale-105"
              onClick={() => logoutUser()}
            >
              <svg
                fill="#ffffff"
                height="25px"
                width="25px"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 198.72 198.72"
                stroke="#ffffff"
                stroke-width="0.198715"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>

                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <path d="M161.463,48.763c-2.929-2.929-7.677-2.929-10.607,0c-2.929,2.929-2.929,7.677,0,10.606 c13.763,13.763,21.342,32.062,21.342,51.526c0,19.463-7.579,37.761-21.342,51.523c-14.203,14.204-32.857,21.305-51.516,21.303 c-18.659-0.001-37.322-7.104-51.527-21.309c-28.405-28.405-28.402-74.625,0.005-103.032c2.929-2.929,2.929-7.678,0-10.606 c-2.929-2.929-7.677-2.929-10.607,0C2.956,83.029,2.953,138.766,37.206,173.019c17.132,17.132,39.632,25.697,62.135,25.696 c22.497-0.001,44.997-8.564,62.123-25.69c16.595-16.594,25.734-38.659,25.734-62.129C187.199,87.425,178.059,65.359,161.463,48.763 z"></path>{" "}
                    <path d="M99.332,97.164c4.143,0,7.5-3.358,7.5-7.5V7.5c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v82.164 C91.832,93.807,95.189,97.164,99.332,97.164z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div>
          {users &&
            Array.isArray(users) &&
            users.length > 0 &&
            users.map((user: User) => (
              <div
                key={user.id}
                className={`gap-3 p-3 rounded-md cursor-pointer ${
                  selectedUser === user.id
                    ? "bg-gradient-to-tr to-[#614385] from-[#516395] text-white"
                    : ""
                }`}
                onClick={() => handleClick(user.id)}
              >
                <div className="flex pl-5">
                  <div className="w-1/6">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        selectedUser === user.id
                          ? "bg-white"
                          : "bg-gradient-to-tr to-[#614385] from-[#516395] text-white"
                      }`}
                      style={{ textAlign: "center", paddingTop: "0.5rem" }}
                    >
                      <p
                        className={`  ${
                          selectedUser === user.id
                            ? "text-purple-900 font-extrabold"
                            : "text-white font-bold"
                        }`}
                      >
                        {capLetter(user.name)}
                      </p>
                    </div>
                  </div>
                  <div className="w-5/6">
                    <p className="font-bold">
                      {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                    </p>
                    <p
                      className={
                        selectedUser === user.id
                          ? "text-white"
                          : "text-gray-400"
                      }
                      style={{ fontSize: "0.875rem" }}
                    >
                      {user.email}
                    </p>
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
