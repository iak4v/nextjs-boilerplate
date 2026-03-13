"use client"

import { IconChevronLeft } from '@tabler/icons-react'

const BackBtn = () => {
    return (
        <button onClick={() => window.history.back()} className='cursor-pointer hover:bg-muted duration-100 rounded-sm'><IconChevronLeft className='inline' /></button>
    )
}

export default BackBtn