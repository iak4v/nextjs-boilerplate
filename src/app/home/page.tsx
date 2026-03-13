import SearchBox from '@/components/search-box';
import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
    const actionBtns = [
        { name: "Re-Registration", href: "/re-registration" },
        { name: "Exam Form", href: "/exam-form" },
        { name: "Gradecard", href: "/gradecard" },
        { name: "Study Materials", href: "/study-material" },
        { name: "Assignments", href: "/assignments" },
        { name: "TEE Hall Ticket", href: "/hall-tickets" },
        { name: "Re-evaluation", href: "/re-valuation" },
        { name: "Convocation", href: "/convocation" },
        { name: "Download ID Card", href: "/how-to-download-ignou-id-card" },
        { name: "Score 100/100 in assignments", href: "/how-to-download-ignou-id-card" },
    ]
    return (
        <main className=''>
            <p className='px-4 text-xl'>Latest Posts</p>
            <section className='mt-1 w-full px-4 scroll-smooth flex gap-1.5 overflow-x-scroll'>
                {Array.from({ length: 5 }).map((_, i) => {
                    const hue = 67 + i * 20;
                    return <div key={i} className='relative rounded-lg aspect-video w-[90%] lg:w-[40%] overflow-hidden shrink-0'>
                        <Image className="white-gradient-mask w-full h-full rounded-lg" width={100} height={0} alt='ok' src={"https://ignoumax-prod-s3.s3.ap-south-1.amazonaws.com/public/og/test-file.png"} />
                        <p className='absolute top-0 left-0 border rounded-lg px-4 py-3 w-full h-full' style={{
                            color: `hsl(${hue}, 100%, 20%)`,
                            borderColor: `hsl(${hue}, 100%, 30%)`,
                            background: `linear-gradient(135deg, hsla(${hue}, 100%, 80%, 0.6), #fff0)`
                        }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, suscipit?</p>
                    </div>
                })}
                <div className='bg-yellow-200 relative rounded-lg w-[40%] lg:w-[40%] overflow-hidden shrink-0'>
                    <p className='px-4 py-3 ' >Read <br /> more <br /> <ArrowRightIcon className='inline' size={16} /></p>
                </div>
            </section>
            <SearchBox className='w-[90%] mx-auto mt-4' />
            <section className='w-[90%] mt-4 mx-auto grid grid-cols-2 text-sm md:grid-cols-3 lg:grid-cols-4 gap-1.5'>
                {
                    actionBtns.map(({ name, href }, i) => {
                        const hue = 111 * (i + 1);
                        return <Link key={i} href={href} className='rounded-lg border py-2 px-3 text-sm' style={{ color: `hsl(${hue}, 100%, 20%)`, background: `linear-gradient(-45deg, hsl(${hue}, 100%, 70%), #fff)`, borderColor: `hsl(${hue}, 100%, 30%)` }}>{name}</Link>
                    })
                }
            </section>
        </main>
    )
}

export default HomePage