import { prisma } from "$lib/server/prisma";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const { user, session } = await locals.validateUser()

    if (!(user && session)) {
        return {status: 200 }
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

    if (!userData) {
        return fail(500, { message: "No user data found in database"})
    }

    return { userData, userPreferences }
    
};