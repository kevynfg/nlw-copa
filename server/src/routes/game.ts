import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function gameRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const pools = await prisma.pool.count();
        return {count: pools}
    })
}