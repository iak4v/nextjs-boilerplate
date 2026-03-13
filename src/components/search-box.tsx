"use client"

import { Loader2Icon, SearchIcon } from 'lucide-react';
import React, { ComponentProps, useCallback, useEffect, useRef, useState } from 'react'

const SearchBox = (props: ComponentProps<"form">) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const searchBtnRef = useRef<HTMLButtonElement>(null);
    const loaderBtnRef = useRef<HTMLButtonElement>(null);
    const searchResultsDivRef = useRef<HTMLDivElement>(null);

    const [searchResults, setSearchResults] = useState<{ title: string, href: string }[] | null>(null);

    const ps = ["BSCG", "BAG", "Gradecard", "Re evaluation", "MA", "Assignments", "Re registration", "Exam form"];
    let i = 0;
    let p = ps[i++];
    let interval = setInterval(() => {
        if (inputRef.current) {
            p = ps[i++ % ps.length];
            inputRef.current.placeholder = p;
        }
    }, 1000)
    useEffect(() => {
        loaderBtnRef.current?.classList.add('hidden');
        searchBtnRef.current?.classList.remove('hidden');
        return () => clearInterval(interval);
    })

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        try {
            const query = inputRef.current?.value.trim();
            if (!query) {
                searchResultsDivRef.current?.classList.toggle("hidden");
                return;
            };

            const lastSearchQuery = searchResultsDivRef.current?.getAttribute('data-lastsearch');
            if (lastSearchQuery === query) {
                searchResultsDivRef.current?.classList.toggle("hidden");
                return;
            };


            setSearchResults(
                [
                    { title: `Result 1 for ${query}`, href: `/search/${query}/1` },
                    { title: `Result 2 for ${query}`, href: `/search/${query}/2` },
                    { title: `Result 3 for ${query}`, href: `/search/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/seasrdch/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searsch/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searcah/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searchc/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/search/ac${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searcdfah/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searcfah/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searcaweh/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searcadah/${query}/3` },
                    { title: `Result 3 for ${query}`, href: `/searchadfd/${query}/3` },
                ]
            )

            searchResultsDivRef.current?.classList.remove("hidden");
            searchResultsDivRef.current?.setAttribute('data-lastsearch', query);
            loaderBtnRef.current?.classList.remove('hidden');
            searchBtnRef.current?.classList.add('hidden');

        } catch (e) { } finally {
            loaderBtnRef.current?.classList.add('hidden');
            searchBtnRef.current?.classList.remove('hidden');
        }
    }, [])
    return (
        <>
            <form onSubmit={handleSubmit} {...props} className={`${props.className} flex relative`}>
                <input ref={inputRef} type="text" placeholder={p} className='border  outline-none text-blue-600 focus:bg-blue-50 border-blue-500 w-full p-2 rounded-l-xl' />
                <button ref={searchBtnRef} data-btn='search' className='bg-blue-500 px-2 rounded-r-xl border-blue-500 text-white'><SearchIcon /></button>
                <button ref={loaderBtnRef} data-btn='loader' className='bg-blue-500 px-2 rounded-r-xl border-blue-500 text-white hidden'><Loader2Icon className='animate-spin' /></button>
            </form>
            <div ref={searchResultsDivRef} data-lastsearch="" id="search-results" className='absolute w-[18rem] md:w-lg lg:w-[55rem] translate-x-[5.5%] mx-auto py-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 max-h-52 overflow-y-scroll bg-linear-to-b hidden from-white to-transparent'>
                {searchResults?.map(({ title, href }, i) => <a key={href} href={href} className='text-sm bg-white border p-2 px-3 rounded-lg shadow-md'>{title}</a>)}
            </div>
        </>
    )
}

export default SearchBox