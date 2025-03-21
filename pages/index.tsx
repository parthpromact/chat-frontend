// pages/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page when user visits home route
    router.push("/login");
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Home;
