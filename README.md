Redive is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Redive is a web-app made for deep dives on all-time top posts on subreddits.

## Getting Started

First, set up your personal OAuth credentials following the steps outlined [in Reddit's API documentation](https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example).

Then, make a `.env.local` file under the `redive/` root folder. Example:

```
REDDIT_USER=username
REDDIT_PW=password
CLIENT_ID=givenID
CLIENT_SECRET=givenSECRET
``` 

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

