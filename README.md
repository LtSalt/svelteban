# README

This is a personal project creating a kanban board with `Svelte`. It integrates `Sveltekit`, basic database management with `Prisma` and user authentication with `Lucia`, and it takes some babysteps in `Sass`.


## Setup

1. install dependencies
```fish
npm install
npm install sass -D
npm install -D @fontsource/poppins
npm install prisma -D
npm install lucia-auth @lucia-auth/sveltekit @lucia-auth/adapter-prisma

# commit
git init && add . && commit -m "Initial commit. Added dependencies for sveltekit, sass, fontsource, prisma, lucia & integrations for lucia with sveltekit and prisma."
```

...and create `README.md` to document process

2. create schema
```fish
npx prisma init --datasource-provider sqlite
```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  // fields required by lucia
  id      String    @id @unique
  session Session[]
  Key     Key[]

  // custom fields 
  username String @unique
  email    String @unique

  // connections
  boards   Board[]
  taglists Taglist[]
  tags     Tag[]
  tasks    Task[]

  // preferences
  theme           String @default("light")
  activeBoardId   Int?
  activeTaglistId Int    @default(1)

  @@map("user")
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  user           User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("session")
}

model Key {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  primary         Boolean
  expires         BigInt?
  user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("key")
}

model Board {
  id       Int    @id @default(autoincrement())
  title    String
  user     User   @relation(fields: [username], references: [username])
  username String

  @@unique([username, title])
}

model Taglist {
  id       Int    @id @default(autoincrement())
  title    String
  tags     Tag[]
  user     User   @relation(fields: [username], references: [username])
  username String

  @@unique([username, title])
}

model Tag {
  id        Int     @id @default(autoincrement())
  title     String
  taglist   Taglist @relation(fields: [taglistId], references: [id])
  taglistId Int
  user      User    @relation(fields: [username], references: [username])
  username  String

  @@unique([username, title])
}

model Task {
  id       Int    @id @default(autoincrement())
  title    String
  user     User   @relation(fields: [username], references: [username])
  username String
}
```

```fish
npx prisma db push

# commit
git add prisma
git commit -m "Created prisma schema and pushed it to db."
```

3. create client to not reinstantiate client on hot reload and set up prisma types
```ts
// src/app.d.ts
import type { PrismaClient } from "@prisma/client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	var prisma: PrismaClient
}

export {};
```

```ts
// src/lib/server/prisma.ts

import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
    global.prisma = prisma;
}

export { prisma }
```

```fish
# commit
git add .
git commit -m "Created prisma client and prisma client type"
```

4. set up lucia server logic, lucia hook and lucia types

```ts
// $lib/server/lucia.ts 

import lucia from "lucia-auth";
import prismaAdapter from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "$lib/server/prisma"

export const auth = lucia({
    adapter: prismaAdapter(prisma),
    env: dev ? "DEV" : "PROD",
    transformUserData: (userData) => {
        return {
            userId: userData.id,
            username: userData.username,
            email: userData.email
        }
    }
})

export type Auth = typeof auth;
```

```ts
// src/hooks.server.ts
import { handleHooks } from "@lucia-auth/sveltekit";
import { auth } from "../lib/server/lucia";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = handleHooks(auth)
```

```ts
// src/app.d.ts
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
```

```fish
# commit
git add .
git commit -m "Created lucia logic, hook and types"
```

5. Create Authentication form and server side logic to get started

```fish
# start server to have types generated for you
npm run dev
```







## TODO


## Ressouces 
- [Lucia prisma schema requirements](https://lucia-auth.com/learn/adapters/prisma)
- [Lucia docs on Sveltekit integration](https://lucia-auth.com/sveltekit/start-here/getting-started)
- [Start dev server for type generation](https://stackoverflow.com/questions/74060175/sveltekit-import-type-layoutserverload-pageload)



