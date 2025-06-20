/**
 * Creates a canvas element with the cropped portion of an image
 */
export function getCroppedImg(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  fileName: string,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("No 2d context")
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"))
          return
        }
        blob = new File([blob], fileName, { type: "image/jpeg" })
        resolve(blob)
      },
      "image/jpeg",
      0.95,
    )
  })
}

/**
 * Generates a unique filename for an uploaded image
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = new Date().getTime()
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = originalName.split(".").pop()
  return `profile_${timestamp}_${randomString}.${extension}`
}

/**
 * Validates an image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" }
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Image size should be less than 5MB" }
  }

  return { valid: true }
}
