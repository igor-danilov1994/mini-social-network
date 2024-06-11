export type User = {
  id?: string
  email?: string
  password?: string
  name?: string
  avatarUrl?: string
  dateOfBirth?: string
  createdAt?: Date
  updatedAt?: Date
  bio?: string
  location?: string
  posts?: Post[]
  following?: Follows[]
  followers?: Follows[]
  likes?: Like[]
  comments?: Comment[]
  isFollowing?: boolean
}

export type Follows = {
  id: string
  followers: User
  followerId: User
  following: User
  followingId: string
}

export type Post = {
  id: string
  content?: string
  author?: User
  authorId?: User
  likes?: Like[]
  comments?: Comment[]
  likedByUser?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type Like = {
  id: string
  user: User
  userId: string
  post: Post
  postId: string
}

export type Comment = {
  _id: string
  content: string
  userId: User
  post: Post
  postId: string
}
