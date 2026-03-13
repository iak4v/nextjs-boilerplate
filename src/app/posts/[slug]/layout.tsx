// import { Footer } from '@/components/footer'
import ShareBtn from '@/components/share-btn'
import React from 'react'

const PostsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <section className='w-full mx-auto p-3'>
        <div className='w-[98%] md:w-[65%] lg:w-[55%] mx-auto flex justify-end items-center'>
          {/* <BackBtn /> */}
          {/* <BookmarkBtn /> */}
          <ShareBtn />
        </div>
      </section>
      <main className='w-[90%] mx-auto space-y-4'>
        {children}
        {/* <Footer /> */}
      </main>
    </>
  )
}

export default PostsLayout