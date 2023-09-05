export interface ICurrentUser {
    id: string
    fullName: string
    email: string
    gender: string
    avatar?: string
    isEmailVerified: boolean
    lastLoggedIn: Date
    createdAt: Date
    updatedAt: Date
}

export interface IUserJWT {
    id: string
}
