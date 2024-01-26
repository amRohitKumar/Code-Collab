import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Use it in server contexts
function serverAuth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export default serverAuth;
