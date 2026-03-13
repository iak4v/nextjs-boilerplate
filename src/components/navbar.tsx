"use client";

import { BookIcon, HomeIcon, MenuIcon, Package2Icon, XIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import IGNOUMax from "./ignoumax";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SearchBox from "./search-box";
import ThemeToggleBtn from "./theme-toggle-btn";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="">
            {/* Top Row */}
            <div className="mx-auto flex items-center justify-between px-3 py-3">

                <IGNOUMax />
                {/* Search (Desktop) */}
                <SearchBox className="hidden" />

                <div className="flex gap-2 items-center justify-center">

                    <ThemeToggleBtn />


                    {/* Hamburger (Mobile) */}
                    <button
                        onClick={() => setOpen(!open)}
                        // text gradient from blue to skyblue
                        className="md:hidden text-2xl"
                        aria-label="Menu"
                    >
                        {open ? <XIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs (Desktop) */}
            <Navigators className=" hidden md:flex-row md:justify-center gap-3" />

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t">
                    <div className="space-y-2 px-4 py-4">

                        <SearchBox />

                        {/* Nav Links */}
                        <Navigators />

                    </div>
                </div>
            )}
        </header>
    );
}

const Navigators = (props: ComponentProps<"div">) => {
    const pathname = usePathname();
    const routes = [
        { name: "Home", href: "/home", icon: <HomeIcon size={18} /> },
        { name: "Posts", href: "/posts", icon: <Package2Icon size={18} /> },
        { name: "Assignments", href: "/assignments", icon: <BookIcon size={18} /> },
    ];
    return <div className={clsx("flex flex-col gap-1", props.className)}>
        {routes.map((route) => (
            <a
                key={route.href}
                href={route.href}
                className={`flex justify-start items-center ${pathname === route.href ? "text-blue-500 font-semibold md:underline md:underline-offset-4" : ""}`}
            >
                {route.icon}
                <span className="ml-2">{route.name}</span>
            </a>
        ))}
    </div>
}