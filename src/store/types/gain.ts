export interface Movie {
    id: string
    name: string
    description: string
    duration: any
    category: string
    imdbScore: any
    isGainOriginals: boolean
    isFree: boolean
    images: Images
    tags: string[]
    seasonCount: number
    placeholderText: any
    mediaId: any
    seasons: Season[]
    mediaData: any
    createdAt: string
}

export interface Images {
    thumbnails: Thumbnail[]
    coverPhotos: CoverPhoto[]
    logos: Logo[]
}

export interface Thumbnail {
    url: string
    orientation: string
    width: number
    type: string
}

export interface CoverPhoto {
    url: string
    orientation: string
    width: number
    type: string
}

export interface Logo {
    url: string
    orientation: string
    width: number
    type: string
}

export interface Season {
    id: string
    seasonNumber: number
    name: string
    episodeCount: number
    episodes: Episode[]
}

export interface Episode {
    name: string
    description: string
    duration: number
    category: string
    imdbScore: any
    isGainOriginals: boolean
    isFree: boolean
    images: Images2
    tags: string[]
    seasonNumber: number
    mediaData: MediaData
}

export interface Images2 {
    thumbnails: Thumbnail2[]
    coverPhotos: CoverPhoto2[]
    logos: Logo2[]
}

export interface Thumbnail2 {
    url: string
    orientation: string
    width: number
    type: any
}

export interface CoverPhoto2 {
    url: string
    orientation: string
    width: number
    type: string
}

export interface Logo2 {
    url: string
    orientation: string
    width: number
    type: string
}

export interface MediaData {
    mediaId: string
    orientation: string
    mediaSources: MediaSource[]
    subtitles: Subtitle[]
}

export interface MediaSource {
    src: string
    width?: number
    height?: number
    resolution?: number
    type: string
}

export interface Subtitle {
    src: string
    label: string
    language: string
}
