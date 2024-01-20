import customFetch from "@/utils/axios";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials");
          }
          const res = await customFetch.post("/auth/login", credentials);
          // console.log("backend response =>", res.data);
          return res.data;
        } catch (err: any) {
          console.log("LOGIN ERROR", err?.data?.message);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  callbacks: {
    jwt: async ({ token, session, user, trigger }) => {
      // this token will then be stored in cookes and passed to the session callback
      // console.log("user incoming =>", user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.express_token = user.token;
      }
      if (trigger === "update") {
        // console.log("jwt callback = ", session);
        token.room_token = session?.room_token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.express_token = token.express_token;
        session.user.room_token = token.room_token;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
