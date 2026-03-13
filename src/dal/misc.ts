"use server";

import { tryCatch } from "@/lib";
import { parse as parseCSV } from "papaparse";
import { IGNOUMAX_GH } from "@/constants";
import { IconName } from "@/components/icon";

export type SocialMediaHandleType = {
    name: string;
    href: string;
    icon: IconName;
};

export type NavigationItem = {
    index: number;
    align: "top" | "middle" | "bottom";
    icon: IconName;
    href: string;
    visibleOn: "auth" | "!auth" | "subscription" | "!subscription" | "all";
};

export type HomeTab = {
    name: string;
    href: string;
};

export const getSocialMediaHandles = async () => {
    const [text, error] = await tryCatch(
        fetch(IGNOUMAX_GH("core", "social-media-handles.csv"), {
            cache: "force-cache",
            next: { tags: ["core-social-media"] },
        }).then((r) => r.text())
    );
    if (error) return;

    return parseCSV<SocialMediaHandleType>(text, {
        skipEmptyLines: true,
        header: true,
    }).data;
};



export const getTabs = async () => {
    const [text, error] = await tryCatch(
        fetch(IGNOUMAX_GH("core", "home-tabs.csv"), {
            cache: "force-cache",
            next: { tags: ["core-home-tabs"] },
        }).then((r) => r.text())
    );
    if (error) return;

    return parseCSV<HomeTab>(text, {
        header: true,
        skipEmptyLines: true,
    }).data;
};

export const getNavigationLinks = async () => {
    const [text, error] = await tryCatch(
        fetch(IGNOUMAX_GH("core", "navigation-links.csv"), {
            cache: "force-cache",
            next: { tags: ["core-navigation-links"] },
        }).then((r) => r.text())
    );
    if (error) return;

    return parseCSV<NavigationItem>(text, {
        header: true,
        skipEmptyLines: true,
    }).data;
};

type Policy = "privacy" | "terms" | "about";
export const getPolicy = async (policy: Policy) => {
    const [text, error] = await tryCatch(
        fetch(IGNOUMAX_GH("core", `policy/${policy}.md`), {
            next: { tags: [policy] },
        }).then((r) => r.text())
    );
    if (error) return;
    return text;
};