"use client";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const data = useSession();
  // console.log(data);
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
