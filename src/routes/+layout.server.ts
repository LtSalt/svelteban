import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals}) => {
    console.log("checking locals")
    const { user } = await locals.validateUser();
    return { user }
};