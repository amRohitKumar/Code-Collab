import Navbar from "@/components/Navbar/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // fetch initial data
  return (
    <>
      {/* ADD NAVBAR HERE */}
      <Navbar />
      {children}
      {/* ADD FOOTER HERE */}
    </>
  );
}
