/**
 * Secure image upload utilities
 */

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  processedImage?: string
}

// Allowed MIME types for security
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]

// Maximum file size (2MB for better UX)
export const MAX_FILE_SIZE = 2 * 1024 * 1024

// Maximum image dimensions
export const MAX_DIMENSIONS = {
  width: 2000,
  height: 2000
}

// Recommended dimensions for avatars
export const RECOMMENDED_DIMENSIONS = {
  width: 300,
  height: 300
}

/**
 * Validate and process an uploaded image file
 */
export async function validateAndProcessImage(file: File): Promise<ImageValidationResult> {
  try {
    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.'
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size too large. Maximum size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.`
      }
    }

    // Create image element to validate dimensions
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return {
        isValid: false,
        error: 'Failed to process image. Please try again.'
      }
    }

    return new Promise((resolve) => {
      img.onload = () => {
        try {
          // Check image dimensions
          if (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height) {
            resolve({
              isValid: false,
              error: `Image dimensions too large. Maximum size is ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height}px.`
            })
            return
          }

          // Process and compress the image
          let { width, height } = calculateDimensions(img.width, img.height, RECOMMENDED_DIMENSIONS)

          canvas.width = width
          canvas.height = height

          // Draw and compress the image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression
          const processedImage = canvas.toDataURL('image/jpeg', 0.85)

          resolve({
            isValid: true,
            processedImage
          })

        } catch (error) {
          console.error('Image processing error:', error)
          resolve({
            isValid: false,
            error: 'Failed to process image. Please try a different image.'
          })
        }
      }

      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Failed to load image. The file may be corrupted.'
        })
      }

      // Start loading the image
      img.src = URL.createObjectURL(file)
    })

  } catch (error) {
    console.error('Validation error:', error)
    return {
      isValid: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetDimensions: { width: number; height: number }
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  // If image is already smaller than target, don't upscale
  if (originalWidth <= targetDimensions.width && originalHeight <= targetDimensions.height) {
    return { width: originalWidth, height: originalHeight }
  }

  // Calculate new dimensions based on aspect ratio
  if (aspectRatio > 1) {
    // Landscape orientation
    return {
      width: Math.min(originalWidth, targetDimensions.width),
      height: Math.min(originalWidth, targetDimensions.width) / aspectRatio
    }
  } else {
    // Portrait orientation
    return {
      width: Math.min(originalHeight, targetDimensions.height) * aspectRatio,
      height: Math.min(originalHeight, targetDimensions.height)
    }
  }
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  }
  return extensions[mimeType] || 'jpg'
}

/**
 * Generate a secure filename
 */
export function generateSecureFilename(originalName: string, mimeType: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  const extension = getFileExtension(mimeType)
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()

  return `${timestamp}_${random}_${sanitizedName}.${extension}`
}