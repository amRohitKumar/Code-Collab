import customFetch from "@/utils/axios";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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
    jwt: async ({ token, user }) => {
      // this token will then be stored in cookes and passed to the session callback
      return { ...token, ...user };
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token as any;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
