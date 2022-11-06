import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export default function userRoutes(fastify: FastifyInstance) {
    fastify.get('/users/count', async () => {
        const users = await prisma.user.count();
        return {count: users}
    })
}