import { Image } from '@shopify/hydrogen';
import { useEffect, useState } from 'react';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductGallery({ images, selectedImageId, title }: {
  images: GalleryImage[];
  selectedImageId?: string | null;
  title: string;
}) {
  const [activeId, setActiveId] = useState(selectedImageId ?? images[0]?.id);
  // khi đổi variant có ảnh riêng thì nhảy tới ảnh đó
  useEffect(() => {
    if (selectedImageId) setActiveId(selectedImageId);
  }, [selectedImageId]);

  const active = images.find((image) => image.id === activeId) ?? images[0];
  if (!active) return <div className='aspect-square bg-muted/10' />;

  return (
    <div>
      <div className='aspect-square overflow-hidden bg-muted/10'>
        <Image
            data={active}
            alt={active.altText || title}
            aspectRatio='1/1'
            sizes='(min-width: 45em) 50vw, 100vw'
            loading='eager'
            className='h-full w-full object-cover'
        />
      </div>
      {images.length > 1 && (
        <ul className='mt-3 grid grid-cols-5 gap-2'>
          {images.map((image, index) => (
            <li key={image.id ?? index}>
              <button
                type='button'
                onClick={() => setActiveId(image.id)}
                aria-label={`Show image ${index + 1}`}
                aria-current={image.id === active.id}
                className='block w-full overflow-hidden border border-transparent aria-current:border-foreground'
              >
                <Image data={image} aspectRatio='1/1' sizes='100px' className='h-full w-full object-cover' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}