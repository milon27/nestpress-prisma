import process from "process"

import express from "express"

// console.log("hi")
// console.log(process.cwd())

// import path from "path"

// console.log(path.resolve(__dirname))
console.log("first")
console.log(process.cwd())
// function test(params: string) {
//     return params
// }
// console.log(test("hi"))

const app = express()
app.use("/", (req, res) => {
    // to get the custom types auto suggestion add this file into {include :[]}
    console.log(req.user)
    console.log(req.agent)
})
