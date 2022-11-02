import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() { 
    const user = await prisma.user.create({
        data: {
            name: 'Teste um',
            email: 'Teste@aaaaa.com',
            avatarUrl: 'https://github.com/kevynfg.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example pool',
            code: 'kev123',
            ownerId: user.id,
            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-02T12:00:36.757Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'DE'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-02T12:00:36.757Z',
            firstTeamCountryCode: 'FR',
            secondTeamCountryCode: 'GB',
            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 3,
                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
};

main();