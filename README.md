# Chamsmobile

This repository contains the Chamsmobile project, a simple banking application. The application consists of both frontend and backend components, enabling users to perform various banking operations.


### Application Features

The application should provide the following features:

- Create a new user account.
- Enable existing users to log in.
- Facilitate money transfers between users with valid account numbers.
- Display transaction history.
- Show account balances.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- Node.js: Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).
- PostgreSQL: Install PostgreSQL and create a database for Chamsmobile.
- Docker: Install Docker for containerization.

## Getting Started

Follow these steps to set up and run the Chamsmobile project on your local machine.

### Step 1: Install Dependencies

In the project root directory, run the following command to install the required dependencies:

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root directory and use the content of `.env.example` as a template. Replace the placeholders with your own values:

```env
CHAMSMOBILE_API="https://**.app/api"
CHAMSMOBILE_ORG_KEY="e9e9e9297f023d4a915"
JWT_SECRET="242424"

DATABASE_URL="postgresql://postgres@dlocal:5432/postgres"
```

### Step 3: Run Prisma Migrations

Run the Prisma migrations to set up the database schema:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 4: Seed the Database

Seed the database with initial data (if needed):

```bash
npx prisma db seed
```

### Step 5: Start the Development Server

Start the Chamsmobile development server by running the following command:

```bash
npm run dev
```

Your Next.js application should now be up and running at [http://localhost:3000](http://localhost:3000).

