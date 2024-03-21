# Neon, Clerk, and Vercel Example

Companion repository for [this article on the Neon blog (COMING SOON)](https://neon.tech/blog).

A sample application that demonstrates how to use [Clerk](https://clerk.com/) authentication with [Next.js](https://nextjs.org/), and store user identifiers in [Neon's Serverless Postgres](https://neon.tech/github/) using [Drizzle ORM](https://orm.drizzle.team/).

## Local Development

Requires Node.js 18.x. 

1. Sign up to [Neon](https://neon.tech/github/) to access serverless Postgres by creating a project.
1. Sign up to [Clerk](https://clerk.com/) for user management and authentication. Create an application that supports sign in using a providers such as Discord and Google;
1. Clone this repository, install dependencies, and prepare a _.env.local_ file:
    ```bash
    git clone $REPO_URL neon-clerk-vercel

    cd neon-clerk-vercel
    
    npm install

    cp .env.example .env.local
    ```
1. Replace the values in _.env.local_ as follows:
    *  `DATABASE_URL` - With your Neon [connection string](https://neon.tech/docs/connect/connect-from-any-app)`
    * `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - With the value from the **API Keys** section in the Clerk dashboard.
    * `CLERK_SECRET_KEY` - With the value from the **API Keys** section in the Clerk dashboard.
    * `CLERK_WEBHOOK_SECRET` - This will be obtained later.
1. Generate and push the database schemas, and insert seed data:
    ```bash
    npm run drizzle:generate -- dotenv_config_path=.env.local
    npm run drizzle:push -- dotenv_config_path=.env.local
    npm run seed -- dotenv_config_path=.env.local
    ```

> [!TIP]
> Consider creating a separate [Neon database branch(es)](https://neon.tech/docs/manage/branches#create-a-branch) for your development environment(s).

Since this application uses Clerk webhooks to create user references in the
Neon Postgres database, you need a way to expose the application from your
local network as a public HTTPS endpoint during local development. You can use
[localtunnel](https://www.npmjs.com/package/localtunnel) to do this.

1. Open a terminal and start the Next.js application in development mode:
    ```bash
    npm run dev
    ```
1. Open another terminal and run the following command to obtain a public HTTPS URL to access your Next.js application:
    ```bash
    npx localtunnel@2.0 –port 3000 -s $USER
    ```
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) and select your application.
1. Navigate to the **Webhooks** screen.
1. Click the **Add Endpoint** button.
1. Enter the public HTTPS URL provided by localtunnel followed by _/api/webhooks/clerk_ in the **Endpoint URL** field.
1. Under the **Message Filtering** section select the user events.
1. Click the **Create** button.

You can now visit http://localhost:3000/ to verify the application is working
end-to-end. The application should display a login page, and once you've logged
in your user's ID should be inserted into your Postgres users table a few
seconds later.

## Vercel Deployment

TODO: Vercel Deploy.
