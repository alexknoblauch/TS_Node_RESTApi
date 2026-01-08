import { redisClient } from "@/lib/redis";

export const getOrSetRedis = async function<T>(key: string, cb: () => Promise<T>){
        const redisValue = await redisClient.get(key) 
        if(redisValue !== null) return JSON.parse(redisValue) as T

        const newValue = await cb()
        await redisClient.set(key, JSON.stringify(newValue))
        return newValue
}