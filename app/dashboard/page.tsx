"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import CardGroup from "@/components/Dashboard/CardGroup";
import axios from "axios";

const getData = async (userId: number, token: string) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8000/dashboard/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error = ", error?.response?.data);
  }
};

const Dashboard = async () => {
  const data = await getServerSession(authOptions);
  console.log(data);
  const { id: userId, express_token } = data.user;
  const allCodeboxes: models.ICodeBox[] = await getData(userId, express_token);
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
