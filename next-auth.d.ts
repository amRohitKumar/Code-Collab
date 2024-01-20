import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      express_token: string;
      room_token?: string;
    } & DefaultSession["user"];
  }

  // interface of user object returned by the backend
  interface User extends DefaultUser {
    id: string;
    token: string;
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    express_token: string;
    email: string;
    name: string;
    room_token?: string;
  }
}
