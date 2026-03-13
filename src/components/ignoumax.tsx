import { THEME_COLOR } from "@/constants";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const IGNOUMax = ({ className }: React.ComponentProps<"a">) => (
  <Link href={"/"} className={"inline-flex items-center gap-0.5" + className}>
    <Image width={24} height={0} alt="ignoumax-logo" src={"/favicon.ico"} />
    <b className={"bg-clip-text text-transparent bg-linear-to-br from-blue-600 via-blue-500 to-foreground/60 text-2xl"}>
      IGNOUMax
    </b>
  </Link>
);

export default IGNOUMax;
