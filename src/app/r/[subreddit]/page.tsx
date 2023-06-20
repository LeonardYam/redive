import PostCollection from "./PostCollection";

let token: string;
let expiryDate: Date;

async function getToken() {
  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: process.env.REDDIT_USER!,
      password: process.env.REDDIT_PW!,
    }),
    mode: "cors",
  });
  return res.json();
}

async function refreshToken() {
  const now = new Date();
  if (!expiryDate || now > expiryDate) {
    const data = await getToken();
    token = data.access_token;
    expiryDate = new Date(Date.now() + data.expires_in);
  }
}

async function getSubredditListing(subreddit: string) {
  await refreshToken();
  const apiUrl = `https://oauth.reddit.com/r/${subreddit}/top?t=all&limit=25`;
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  return res.json();
}

export default async function Page({
  params,
}: {
  params: { subreddit: string };
}) {
  const { subreddit } = params;
  const listing = await getSubredditListing(subreddit);
  return (
    <PostCollection listing={listing} subreddit={subreddit} token={token} />
  );
}
