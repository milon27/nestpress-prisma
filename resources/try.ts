import process from "process"
import path from "path"
import express from "express"

console.log("hi")
console.log(process.cwd())

console.log(path.resolve(__dirname))
console.log("first")

function test(params: string) {
    return params
}
console.log(test("hi"))

const app = express()
// app.use("/", (req, res) => {
//     // to get the custom types auto suggestion add this file into {include :[]}
//     console.log(req.user)
//     console.log(req.agent)
// })
