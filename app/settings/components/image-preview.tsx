import Image from "next/image"

interface ImagePreviewProps {
  src: string
  alt: string
  className?: string
}

export function ImagePreview({ src, alt, className = "" }: ImagePreviewProps) {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
    </div>
  )
}
