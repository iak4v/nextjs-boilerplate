import { getSocialMediaHandles } from "@/dal/misc"
import { Icon } from "./icon"
import IGNOUMax from "./ignoumax"

export const Footer = async () => {
    const socials = await getSocialMediaHandles()
    return <footer className="py-8 text-center">
        <IGNOUMax />
        <p className="text-sm">© 2024 IGNOUMax. All rights reserved.</p>
        {socials && socials.length ? (
            <div className="flex gap-2 items-center justify-center">
                {socials.map((t) => (
                    <a href={t.href} key={t.href}>
                        <Icon name={t.icon} fallback="Minus" size={20} />
                    </a>
                ))}
            </div>
        ) : undefined}
        {/* <div className="flex opacity-90 mt-2 text-sm underline underline-offset-4 justify-around items-baseline">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </div> */}
    </footer>
}