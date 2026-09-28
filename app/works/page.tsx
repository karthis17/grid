import GalleryGrid from '@/components/GalleryGrid'
import { galleryItems } from '@/lib/GalleryItems'

function Works() {
  return (
    <div>

        <GalleryGrid items={galleryItems}/>
    </div>
  )
}

export default Works