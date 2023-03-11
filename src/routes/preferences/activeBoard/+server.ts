import { prisma } from "$lib/server/prisma"

export async function POST({ request }) {
    const { userId, boardId } = await request.json()

    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                activeBoardId: Number(boardId)
            }
        })
    } catch(err) {
        console.log(err)
            return new Response("todo")
        }
        return new Response("todo")
    }