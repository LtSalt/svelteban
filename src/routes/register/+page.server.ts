// TODO validate user input, e.g. with zod

import { auth } from "$lib/server/lucia";
import { prisma } from "$lib/server/prisma.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.validate()
    if (session) {
        throw redirect(302, "/")
    }
};

export const actions: Actions = {
    default: async({ request }) => {
        const { username, email, password } = Object.fromEntries(await request.formData()) as Record<string, string>

        try {
            await auth.createUser({
                key:{
                    providerId: "username",
                    providerUserId: username,
                    password
                },
                attributes: {
                    username,
                    email,
                }
            })
        } catch(err) {
            console.log(err)
            return fail(400, { message: "Could not create new user"})
        }

        try {
            await prisma.user.update({
                where: {
                    username: username
                },
                data: {
                    boards: {
                        create: { title: "Firlefanz"},
                    },
                    taglists: {
                        create: { title: "todo" }
                    }
                }
            })
        } catch(err) {
            console.log(err)
            return fail(500, { message: "Could not create template board and taglist"})
        }
        
        throw redirect(302, "/login")
    }
};
