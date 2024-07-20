import { Webhook } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="w-full bg-[#3b3c4c]">
        <div className="max-w-5xl mx-auto p-[10px]">
          <Link
            href="/"
            className="text-[#cccccc] text-[25px] font-bold tracking-wide flex items-center gap-2"
          >
            <Webhook /> {process.env.NEXT_PUBLIC_APP_NAME}
          </Link>
        </div>
      </div>
      <div className="flex justify-center p-[10px] text-[#999999] text-[15px] font-semibold tracking-wide">
        © Copyright {new Date().getFullYear()} - {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
