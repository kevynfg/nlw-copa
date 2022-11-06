import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export default function authRoutes(fastify: FastifyInstance) {
    fastify.get('/me',{
        onRequest: [authenticate]
    }, async (request) => {
        //Antes de retornar dados do usuário, o método onRequest
        //Faz a verificação do JWT token e isso chega no request da Rota
        return { user: request.user };
    });

    fastify.post('/users', async (request) => {
        const createUserBody = z.object({
            access_token: z.string(),
        })
        const { access_token } = createUserBody.parse(request.body);

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const userData = await userResponse.json();
        const userInfo = makeUserSchemaValidator(userData);

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                  googleId: userInfo.id,
                  name: userInfo.name,
                  email: userInfo.email,   
                  avatarUrl: userInfo.picture
                }
            });
        };
        
        const token = fastify.jwt.sign({
            name: user.name,
            avatarUrl: user.avatarUrl
        }, {
            sub: user.id,
            expiresIn: '7 days'
        });

        return { token };
    })
}

const makeUserSchemaValidator = (userData: {}) => {
    return z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
    }).parse(userData);
}