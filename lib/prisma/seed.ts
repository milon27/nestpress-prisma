import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const doSeed = async () => {
    // await prisma.user.deleteMany({})
    //create user
}

doSeed()
    .then(() => {
        console.log("seed done")
    })
    .catch((e) => {
        console.log(e)
        console.log("already seeded")
    })
