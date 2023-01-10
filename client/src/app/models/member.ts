import { Photo } from './photo'

export interface Member {
  id: number
  username: string
  photoURL: string
  age: number
  knownAs: string
  created: Date
  lastActive: Date
  gender: string
  introduction: string
  lookingFor: string
  interests?: any
  city: string
  country: string
  photos: Photo[]
}
