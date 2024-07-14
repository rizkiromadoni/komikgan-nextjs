"use client";

import UpdateProfileForm from "@/components/forms/UpdateProfileForm";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getUserProfile = async () => {
    const res = await api.profile.$get();
    if (!res.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await res.json();
}

const ProfilePage = () => {
  const { data: user, isPending, error } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    retry: false
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <main>
      <div className="bg-[#45475a]">
        <div className="max-w-5xl m-auto flex flex-col justify-left md:flex-row md:justify-left items-center gap-4 py-[50px]">
          <Image
            src={user?.image || "/no-avatar.jpg"}
            alt=""
            width={180}
            height={180}
            className="rounded-full"
          />
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl text-[#9ca9b9]">
              Hello,{" "}
              <span className="text-[#6e6dfb] font-semibold">Firenze</span>
            </h1>
            {/* <button className="bg-[#3b3c4c] text-[#9ca9b9] px-6 py-2 rounded-md">
              Change Profile Picture
            </button> */}
          </div>
        </div>
      </div>
      <div className="max-w-5xl m-auto flex flex-col md:flex-row gap-4 my-5 px-4 w-full">
        <div className="flex flex-col gap-4 w-full md:w-[180px]">
          <Link
            href="#"
            className="flex items-center gap-2 px-[15px] py-[8px] rounded-md font-semibold text-base text-white bg-[#6e6dfb]"
          >
            <UserCog size={18} />
            Edit Profile
          </Link>
        </div>

        <div className="border-t-4 md:border-t-0 md:border-l-4 border-[#3b3c4c] py-4 md:py-0 md:px-4 w-full">
          <h2 className="text-2xl font-semibold mb-5">
            <span className="text-[#6e6dfb]">Edit</span> Profile
          </h2>
          <UpdateProfileForm data={user} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
