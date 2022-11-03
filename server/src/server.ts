import { PrismaClient } from "@prisma/client"
import Fastify from 'fastify'
import cors from '@fastify/cors';
import * as z from 'zod';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
    log: ['query'],
})

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true
    })

    fastify.get('/pools/count', async () => {
        const pools = await prisma.pool.count();
        return {count: pools}
    })
   
    fastify.get('/users/count', async () => {
        const users = await prisma.user.count();
        return {count: users}
    })
    
    fastify.get('/guesses/count', async () => {
        const guesses = await prisma.guess.count();
        return {count: guesses}
    })
    
    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })
        const { title } = createPoolBody.parse(request.body);
        const generate = new ShortUniqueId({length: 6});
        const code = String(generate()).toUpperCase();
        if (!title) {
            return reply.status(400).send({message: "Não é possível criar 'Bolão' sem o título"})
        }
        await prisma.pool.create({
            data: {
                title,
                code
            }
        })
        return reply.status(201).send({code})
    })

    await fastify.listen({
        port: 3333,
    })
}

bootstrap();