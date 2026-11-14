import type { ImageCredit } from '../data/images'
import { displayImage } from '../i18n/images'
import { useRouter } from '../lib/useRouter'

interface Props {
  image: ImageCredit
  priority?: boolean
  sizes?: string
  className?: string
}

function srcSet(image: ImageCredit) {
  return image.widths.map((w) => `${image.src}-${w}.webp ${w}w`).join(', ')
}

export function Photo({ image: source, priority, sizes = '(min-width: 1100px) 50vw, 100vw', className }: Props) {
  const { locale } = useRouter()
  const image = displayImage(source, locale)
  const large = image.widths.includes(1600) ? 1600 : Math.max(...image.widths)
  return (
    <figure className={`photo ${className ?? ''}`}>
      <img
        src={`${image.src}-${large}.webp`}
        srcSet={srcSet(image)}
        sizes={sizes}
        alt={image.alt}
        width={large}
        height={Math.round(large / image.ratio)}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </figure>
  )
}

export function CoverPhoto({
  image: source,
  className,
  priority,
  sizes = '100vw',
}: {
  image: ImageCredit
  className: string
  priority?: boolean
  sizes?: string
}) {
  const { locale } = useRouter()
  const image = displayImage(source, locale)
  const large = Math.max(...image.widths)
  return (
    <img
      className={className}
      src={`${image.src}-${image.widths.includes(1600) ? 1600 : large}.webp`}
      srcSet={srcSet(image)}
      sizes={sizes}
      alt={image.alt}
      width={large}
      height={Math.round(large / image.ratio)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
