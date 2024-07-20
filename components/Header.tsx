"use client";

import React, { useState } from "react";
import {
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  UserPlus,
  Users,
  Webhook,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const routes = [
  {
    url: "/series",
    label: "Manga List",
  },
  {
    url: "/genres",
    label: "Genre List",
  },
  {
    url: "/bookmarks",
    label: "Bookmarks",
  },
];

const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter()

  const handleSearch = (str: string) => {
    if (str.length < 1) return
    router.push(`/search/${str}`)
  }

  return (
    <>
      <div className="bg-[#3b3c4c] text-[#9ca9b9] w-full shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between w-full h-[61px] relative z-20 bg-[#3b3c4c] text-[#9ca9b9]">
          <button
            className="bg-[#45475a] text-[#eeeeee] h-full p-[18px] cursor-pointer md:hidden"
            onClick={() => {
              setIsSearchOpen(false);
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Menu className="text-[25px]" />
          </button>
          <div className="w-full px-3 text-left flex items-center lg:pl-0">
            <a href="/" className="flex gap-2 items-center">
              <Webhook className="text-[#3453d1] size-7" />
              <h1 className="text-[27px] text-[#eeeeee] font-semibold hover:text-[#3453d1] transition-colors duration-500">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </h1>
            </a>
            <ul className="hidden md:flex gap-2 ml-5">
              {routes.map((route) => (
                <li key={route.label}>
                  <Link
                    href={route.url}
                    className="bg-[#45475a] text-[#9ca9b9] rounded-md px-[15px] py-[8px] text-[16px] font-semibold tracking-wide cursor-pointer hover:bg-[#3453d1] hover:text-[#ffffff] transition-colors"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <button
              className="bg-[#45475a] text-[#eeeeee] h-full p-[18px] cursor-pointer md:hidden"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              <Search className="text-[25px] font-extrabold" width={25} />
            </button>
            <div className="hidden md:flex h-full items-center">
              <input
                type="search"
                name="search"
                id="search"
                className="py-2 px-4 bg-[#2f303e] rounded-sm outline-none text-sm font-extralight text-[#aaaaaa] focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
                placeholder="Search..."
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSearch(e.currentTarget.value)
                  }
                }}
              />
            </div>
            <div className="h-full px-[12px] cursor-pointer flex items-center relative lg:pr-0">
              {status !== "loading" ? (
                <>
                  <div
                    className="w-[40px] h-[40px] relative"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <Image
                      src={session?.user?.image ?? "/no-avatar.jpg"}
                      alt=""
                      fill
                      className="rounded-full"
                    />
                  </div>
                  {/* user menu */}
                  <ul
                    className={
                      "absolute z-40 top-16 right-1 bg-[#3b3c4c] rounded-md shadow-md" +
                      (isUserMenuOpen ? "" : " hidden")
                    }
                  >
                    {status === "unauthenticated" && (
                      <>
                        <li className="m-[7px]">
                          <a
                            href="/login"
                            className="text-left w-28 hover:bg-[#45475a] flex items-center px-[10px] py-[7px] rounded-md text-[13px] text-[#9ca9b9] font-semibold tracking-wide"
                          >
                            <LogIn className="mr-3" />
                            Login
                          </a>
                        </li>
                        <li className="m-[7px]">
                          <a
                            href="/register"
                            className="text-left w-28 hover:bg-[#45475a] flex items-center px-[10px] py-[7px] rounded-md text-[13px] text-[#9ca9b9] font-semibold tracking-wide"
                          >
                            <UserPlus className="mr-2" />
                            Register
                          </a>
                        </li>
                      </>
                    )}

                    {status === "authenticated" && (
                      <>
                        {session?.user?.role !== "USER" && (
                          <li className="m-[7px]">
                            <a
                              href="/admin"
                              className="text-left w-28 hover:bg-[#45475a] flex items-center px-[10px] py-[7px] rounded-md text-[13px] text-[#9ca9b9] font-semibold tracking-wide"
                            >
                              <Users className="mr-3" />
                              Panel
                            </a>
                          </li>
                        )}
                        <li className="m-[7px]">
                          <a
                            href="/profile"
                            className="text-left w-28 hover:bg-[#45475a] flex items-center px-[10px] py-[7px] rounded-md text-[13px] text-[#9ca9b9] font-semibold tracking-wide"
                          >
                            <User className="mr-3" />
                            Profile
                          </a>
                        </li>
                        <li className="m-[7px]">
                          <button
                            onClick={() => signOut()}
                            className="text-left w-28 hover:bg-[#45475a] flex items-center px-[10px] py-[7px] rounded-md text-[13px] text-[#9ca9b9] font-semibold tracking-wide"
                          >
                            <LogOut className="mr-3" />
                            Logout
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </>
              ) : (
                <Skeleton className="rounded-full h-[40px] w-[40px] cursor-not-allowed" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile navigation */}
      <div
        className={
          "w-full p-[10px] flex flex-col gap-2 bg-[#3b3c4c] border-t-4 border-[#3453d1] transition-transform md:hidden z-10 absolute" +
          (isMenuOpen ? "" : " -translate-y-[100%]")
        }
      >
        {routes.map((route) => (
          <Link
            href={route.url}
            key={route.label}
            className="mx-[10px] px-[15px] py-[8px] bg-[#45475a] text-[#9ca9b9] rounded-md font-semibold text-[16px] tracking-wide hover:bg-[#3453d1] hover:text-[#ffffff] transition-colors"
          >
            {route.label}
          </Link>
        ))}
      </div>

      {/* mobile search */}
      <div
        className={
          "w-full p-[10px] flex flex-col gap-2 bg-[#3b3c4c] border-t-4 border-[#3453d1] transition-transform md:hidden z-10 absolute" +
          (isSearchOpen ? "" : " -translate-y-[100%]")
        }
      >
        <input
          type="text"
          name="search"
          id="search"
          className="py-3 px-4 bg-[#2f303e] rounded-sm outline-none text-sm font-extralight w-full text-[#aaaaaa] focus:ring-1 focus:ring-gray-600 placeholder:text-[#7b7b7b]"
          placeholder="Search..."
          autoComplete="off"
        />
      </div>
    </>
  );
};

export default Header;
