# Neon, Clerk, and Vercel Example

Companion repository for [this article on the Neon blog (COMING SOON)](https://neon.tech/blog).

A sample application that demonstrates how to use Clerk for authentication and
user managment in Next.js, with Neon's Serverless Postgres and Drizzle ORM.

## Local Development

Requires Node.js 18.x. 

1. Sign up to [Neon](https://neon.tech/github/) to access serverless Postgres by creating a project.
1. Sign up to [Clerk](https://clerk.com/) for user management and authentication. Create an application that supports sign in using a providers such as Discord and Google;
1. Clone this repository, install dependencies, and prepare a `.env.local` file:
    ```bash
    git clone $REPO_URL neon-clerk-vercel

    cd neon-clerk-vercel
    
    npm install

    cp .env.example .env.local
    ```
1. Replace the Neon (`DATABASE_URL`) and Clerk variables with the values from your accounts on each platform. Note that the `CLERK_WEBHOOK_SECRET` will be explained later.
    > [!TIP]
    > Consider creating a separate [Neon database branch](https://neon.tech/docs/manage/branches#create-a-branch) for your local development.
1. Generate and push the database schemas, and insert seed data:
    ```bash
    npm run drizzle:generate -- dotenv_config_path=.env.local
    npm run drizzle:push -- dotenv_config_path=.env.local
    npm run seed -- dotenv_config_path=.env.local
    ```

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
1. Navigate to the webhooks screen.
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
