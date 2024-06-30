import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen text-white bg-[#2f303e]">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default ClientLayout;
