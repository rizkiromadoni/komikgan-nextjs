"use client";

import { useSession } from "next-auth/react";
import { Button } from "./button";
import { Heart } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

async function isBookmarked(serieId: number) {
  const response = await api.bookmarks[":id{[0-9]+}"].$get({
    param: {
      id: serieId.toString(),
    },
  });

  return await response.json();
}

const BookmarkButton = ({ serieId }: { serieId: number }) => {
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);

  const {
    data: bookmarked,
    isPending: isPendingBookmark,
    refetch,
  } = useQuery({
    queryKey: ["bookmarked", { serieId }],
    queryFn: async () => await isBookmarked(serieId),
    retry: false,
  });

  const handleClick = async () => {
    setLoading(true);

    try {
      if (!bookmarked) {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: serieId,
          }),
        });
      } else {
        await fetch("/api/bookmarks/" + serieId, {
          method: "DELETE"
        })
      }

      await refetch();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        "rounded-full flex items-center justify-center py-2 font-semibold text-md gap-2",
        {
          "bg-[#6cc174] hover:bg-[#4d8353]": bookmarked,
          "bg-[#c15656] hover:bg-[#ff5a5a]": !bookmarked,
        }
      )}
      disabled={status === "unauthenticated" || loading}
      onClick={handleClick}
    >
      <Heart fill="#ffffff" color="#ffffff" size={18} />
      Bookmark
    </Button>
  );
};

export default BookmarkButton;
