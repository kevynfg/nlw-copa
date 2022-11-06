import Fastify from 'fastify'
import cors from '@fastify/cors';
import guessesRoutes from "./routes/guess";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { gameRoutes } from "./routes/game";
import poolRoutes from "./routes/pool";
import jwt from '@fastify/jwt';

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true
    })
    console.log(process.env.JWT_SECRET);
    await fastify.register(jwt, {
        secret: process.env.JWT_SECRET ?? 'dogs'
    });

    await fastify.register(poolRoutes);
    await fastify.register(guessesRoutes);
    await fastify.register(gameRoutes);
    await fastify.register(authRoutes);
    await fastify.register(userRoutes);

    await fastify.listen({
        port: 3333,
    })
}

bootstrap();