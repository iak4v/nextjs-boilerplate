
// import { IconBrandWhatsapp, IconBrandTelegram, IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandYoutube, IconBrandThreads, IconSun, IconUser } from "@tabler/icons-react";

export default function Home() {
  return (
    <main>

      <section className="grid grid-cols-12 gap-2">
        <div className="col-span-8 h-32 bg-black/10"></div>
        <div className="col-span-4 h-32 bg-red-300"></div>
      </section>
    </main>
  );
}

// import { usePathname } from "next/navigation";
// const Navigation = () => {
//   "use client";
//   const path = usePathname();
//   return <nav className="flex justify-center gap-5">
//     <Button>Home</Button>
//     <Button>Latest Announcements</Button>
//     <Button>Posts</Button>
//     <Button>Shop</Button>
//     <Button>{path}</Button>
//   </nav>
// }

const Hero = () => <div>Hero</div>
const Contributing = () => <div>Contributing</div>

// const Socials = () => <section className="flex justify-center items-baseline gap-1">
//   <a href="https://instagram.com/ignoumax" target="_blank" ><IconBrandInstagram /></a>
//   <a href="https://x.com/ignoumax" target="_blank" ><IconBrandTwitter /></a>
//   <a href="https://facebook.com/ignoumax" target="_blank" ><IconBrandFacebook /></a>
//   <a href="https://t.me/ignoumax" target="_blank" ><IconBrandTelegram /></a>
//   <a href="https://whatsapp.com/@ignoumax" target="_blank" ><IconBrandWhatsapp /></a>
//   <a href="https://youtube.com/@ignoumax" target="_blank" ><IconBrandYoutube /></a>
//   <a href="https://threads.com/ignoumax" target="_blank" ><IconBrandThreads /></a>
// </section>