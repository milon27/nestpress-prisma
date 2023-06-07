// auth
export const loginUserPayload = {
    email: "test@g.com",
    password: "1234567",
}
export const createUserPayload = {
    provider: "simple",
    user: {
        ...loginUserPayload,
        fullName: "milon27",
        gender: "male",
    },
}
