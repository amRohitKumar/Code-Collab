"use server";

import CardGroup from "@/components/Dashboard/CardGroup";
import axios from "axios";
import serverAuth from "@/utils/auth";

const getData = async (userId: string, token: string) => {
  try {
    const { data } = await axios.get(
      // `http://localhost:8000/dashboard/${userId}`,
      `https://code-collab-server-qeff.onrender.com/dashboard/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    console.log("error = ", error?.response?.data);
  }
};

const Dashboard = async () => {
  const user = (await serverAuth())?.user;
  // console.log(data);
  const allCodeboxes: models.ICodeBox[] = await getData(
    user?.id!,
    user?.express_token!
  );
  // console.dir(allCodeboxes, {depth: null});
  return (
    <div className="flex flex-col px-4 md:px-6 lg:px-12 py-4 md:py-8">
      <h1 className="text-4xl font-bold text-left mb-4 md:mb-8">
        All CodeBoxes :
      </h1>
      <CardGroup>{allCodeboxes}</CardGroup>
    </div>
  );
};

export default Dashboard;
