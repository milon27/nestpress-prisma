import IORedis, { Cluster } from "ioredis"
import { initEnvConfig } from "./env.config"
import { myLogger } from "./logger"

initEnvConfig()

// * with cluster config
// let redisClientOrCluster: Cluster | IORedis
// if (process.env.NODE_ENV !== "production") {
//     redisClientOrCluster = new IORedis(`${process.env.REDIS_URL}`)
// } else {
//     const clusters = `${process.env.REDIS_CLUSTER_URLS}`.split(",").map((url) => {
//         return {
//             host: url,
//             port: +`${process.env.REDIS_CLUSTER_PORT}`,
//         } as ClusterNode
//     })
//     redisClientOrCluster = new IORedis.Cluster(clusters)
// }

// export const redisClient = redisClientOrCluster

// * without cluster config
let redisClientOrCluster: Cluster | IORedis
if (process.env.NODE_ENV !== "production") {
    redisClientOrCluster = new IORedis(`${process.env.REDIS_URL}`)
} else {
    redisClientOrCluster = new IORedis(`${process.env.REDIS_URL}`)
}

export const redisClient = redisClientOrCluster

redisClient.on("error", (err) => {
    myLogger().error(err)
})
