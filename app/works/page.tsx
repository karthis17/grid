import GalleryGrid from '@/components/GalleryGrid'
import { galleryItems } from '@/lib/GalleryItems'

function Works() {
  return (
    <div >
      <div className='bg-[#1b1b1b] w-full py-24 flex items-center justify-center'>
        <p className='text-white uppercase text-4xl font-bold tracking-tight  '>
          Our Work
        </p>
      </div>
        <GalleryGrid items={galleryItems}/>
    </div>
  )
}

export default Works