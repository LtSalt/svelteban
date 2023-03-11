import { prisma } from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals}) => {
    const { user, session } = await locals.validateUser();

    if (!(user && session)) {
        throw redirect(302, "/")
    }

    const userPreferences = await prisma.user.findUnique({
        where: {
            id: user.userId 
        },
        select: {
            theme: true,
            activeBoardId: true,
            activeTaglistId: true
        }
    })

    const userData = await prisma.user.findUnique({
        where: {
            id: user.userId
        },
        select: {
            boards: {
                select: {
                    id: true,
                    title: true
                }
            },
            taglists: {
                select: {
                    id: true,
                    title: true
                }
            },
            tags: {
                select: {
                    id: true,
                    title: true,
                    taglistId: true
                }
            },
            tasks: {
                select: {
                    id: true,
                    title: true,
                }
            },
        }
    })

    return { userPreferences, userData }
};


export const actions: Actions = {
    createBoard: async({ request, url }) => {
        const userId = String(url.searchParams.get("userId"))
        const { boardTitle } = Object.fromEntries(await request.formData())
        console.log("creating board")

        try {
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    boards: {
                        create: {
                            title: String(boardTitle)
                        }
                    }
                }
            })
        } catch(err) {
            console.log(err)
            return fail(500, { message: "Could not create new board"})
        }

        return {status: 201}
    },

    editBoard: async({ url, request }) => {
        const boardId = Number(url.searchParams.get("boardId"))
        const { boardTitle } = Object.fromEntries(await request.formData());
        console.log("editing board")

        try {
            await prisma.board.update({
                where: {
                    id: Number(boardId)
                },
                data: {
                    title: String(boardTitle)
                }
            })
        } catch(err) {
            console.log(err)
            return fail(500, { message: "Could not edit board title"})
        }

        return {status: 201}
    },

    removeBoard: async({ request }) => {
        const { boardId } = Object.fromEntries(await request.formData())
        console.log("removing board")

        try {
            await prisma.board.delete({
                where: {
                    id: Number(boardId)
                }
            })
        } catch(err) {
            console.log(err)
            return fail(500, { message: "Could not remove board"})
        }

        return { status: 201 }
    }
};