import type { PrismaClient } from "@prisma/client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			validate: import("@lucia-auth/sveltekit").Validate
			validateUser: import("@lucia-auth/sveltekit").ValidateUser
			setSesstion: import("@lucia-auth/sveltekit").SetSession
		}
	}
	var prisma: PrismaClient

	declare namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth
		type UserAttributes = {
			username: string
			email: string
		}
	}
}

export {};
