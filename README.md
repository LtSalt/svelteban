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

3. set up prisma types and create client to not reinstantiate client on hot reload
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
