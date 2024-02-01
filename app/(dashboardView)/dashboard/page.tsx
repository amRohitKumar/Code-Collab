"use server";

import CardGroup from "@/components/Dashboard/CardGroup";
import axios from "axios";
import serverAuth from "@/utils/auth";
import { SERVER_URL } from "@/backendUrl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const getData = async (userId: string, token: string) => {
  try {
    const { data } = await axios.get(`${SERVER_URL}/dashboard/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
      {allCodeboxes?.length === 0 && (
        <Alert className="w-4/5 mx-auto" variant="info">
          <AlertTitle>No Codeboxes found !</AlertTitle>
          <AlertDescription>
            Click <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md font-semibold">Create</span> to create new codebox and share amoung your frieds.
          </AlertDescription>
        </Alert>
      )}
      <CardGroup>{allCodeboxes}</CardGroup>
    </div>
  );
};

export default Dashboard;
