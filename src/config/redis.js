import { createClient } from 'redis';
import dotenv from "dotenv"
dotenv.config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PW,
    socket: {
        host: 'redis-16019.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16019
    }
});

export default redisClient