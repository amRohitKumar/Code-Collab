export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard", "/code/:path", "/web/:path"],
};
