# Dashboard
The dashboard is composed of a frontend and backend section. Rather than splitting the backend and frontend, this application serves both, the static frontend files and the dynamic API-endpoints that fetch from the database. **The dashboard also does not need a proxy for managing HTTPS as it can manage HTTPS by itself.** This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

> **Attention!!:** Make sure to use the same Node.js version during development as the target environment on the server! In our case this is the version 12.22.12

## Getting Started
To develop the application, it is recommended to use the Google cloud shell and its editor. You should copy the project into the cloud shell and follow the next steps.

First, install the correct node version inside the cloud shell environment using the following command:
```bash
nvm install 12.22.12
```
Then download all dependencies using the following command:
```bash
npm i
```

Now you can start the development database stack.  
The following command starts a PostgreSQL and pgAdmin instance using docker and docker compose.
```bash
../pg_inv.sh dev -s
```

The last step is to start the development server for the dashboard. This server auto-detects changes in the source code files and rebuilds the application. Every time you change a file inside the dashboard folder and safe the changes, these changes are immediately available under http://localhost:8080
 
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Folder Structure

- **backend** This folder contains necessary files for configuring and starting the dashboard.
- **build** This folder contains all build artifacts (see next section).
- **components** This folder contains reusable component that make up the greater pages and UI.
- **config** This folder contains the configuration for the Material UI component library. This configuration is responsible for setting the base color scheme.
- **hooks** This folder contains React hooks that contain business logic for the frontend part.  
- **models** This folder contains the data model.
- **pages** This folder contains the source code for all pages, and all API endpoints. The folder structure doubles as the website routes. A file inside the `api -> instance` folder therefore can be access on the web using the following URL `https://example.domain/api/instance`.
- **public** This folder contains static assets like the favicon and static images.
- **styles** This folder contains the global CSS file that configures the initial styles of the application.

## Build the application for deployment

To build the application for usage in production environments, you can use the following command:

```bash
../pg_inv.sh dashboard -b
```

This command builds the application, packs it as a tar.gz archive and places it inside the `dashboard/build/` folder. You can then replace the `dashboard.tar.gz` file inside the dashboard/build folder of your target environment (e.g. prod server) with this newly build file and run the `./pg_inv.sh dashboard -i` install command on your target environment (prod server) to install your newly build version in production and overwrite the current version.