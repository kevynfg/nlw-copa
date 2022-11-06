import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export default function guessesRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async () => {
        const guesses = await prisma.guess.count();
        return {count: guesses}
    })
}