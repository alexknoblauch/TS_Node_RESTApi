import { redisClient } from "@/lib/redis";

async function getOrSetRedis<T>(key: string, cb: () => Promise<T>): Promise<T> {
        const cached = await redisClient.get(key);
        if (cached !== null) return JSON.parse(cached) as T;
        
        const freshData = await cb();
        await redisClient.set(key, JSON.stringify(freshData), { EX: 3600 });
        return freshData;
}

export default getOrSetRedis

