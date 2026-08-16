/**
 * Media module type definitions.
 * Aligned with backend /media endpoints.
 */

export interface Media {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  path: string
  size: string // BigInt as string
  uploadedBy: string
  url?: string // Full URL to access the media file
  createdAt: string
  updatedAt: string
}

export interface UploadMediaResponse extends Media {}

export interface MediaUploadProgress {
  loaded: number
  total: number
  percentage: number
}
