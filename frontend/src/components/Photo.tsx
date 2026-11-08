import type { ImageCredit } from '../data/images'

interface Props {
  image: ImageCredit
  priority?: boolean
  sizes?: string
  className?: string
}

export function Photo({ image, priority, sizes = '(min-width: 1100px) 50vw, 100vw', className }: Props) {
  return (
    <figure className={`photo ${className ?? ''}`}>
      <img
        src={`${image.src}-1600.webp`}
        srcSet={`${image.src}-800.webp 800w, ${image.src}-1600.webp 1600w`}
        sizes={sizes}
        alt={image.alt}
        width={1600}
        height={Math.round(1600 / image.ratio)}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </figure>
  )
}
