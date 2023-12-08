import Navbar from "@/components/Navbar/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ADD NAVBAR HERE */}
      <Navbar />
      {children}
      {/* ADD FOOTER HERE */}
    </>
  );
}
