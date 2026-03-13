"use client";

import { ShareIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

type Data = {
  url: string,
  title: string,
  text: string
}

const ShareBtn = () => {
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    const title = document.title;
    const url = window.location.href;
    const text = `Check out this article: ${title}`;

    setData({ url, title, text });
  }, [])

  if (!data || !data.url) return;

  return (
    <Button // BUG: button not visible in lg screen
      // size={"sm"}
      className="rounded-full"
      onClick={async () => {
        try {
          await navigator.share(data);
        } catch (e) {
          console.error("error while sharing:", e);
        }
      }}
    >
      <ShareIcon size={15} /> Share
    </Button>
  );
};

export default ShareBtn;
