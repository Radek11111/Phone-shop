import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <Navbar />
      <main className="flex grainy-light  flex-col min-h-[calc(100vh-3.5rem-1px)]">
        <div className="flex-1 flex flex-col h-full ">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
