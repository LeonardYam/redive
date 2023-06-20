"use client";

import styles from "./styles.module.css";
import Post from "./Post";
import Header from "./Header";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/r/[subreddit]/LoadingSpinner";
import { z } from "zod";

const PostSchema = z
  .object({
    data: z.object({
      id: z.string(),
      subreddit: z.string(),
      title: z.string(),
      score: z.number(),
      permalink: z.string(),
      num_comments: z.number(),
      url: z.string(),
    }),
  })
  .required();

const ListingSchema = z
  .object({
    data: z
      .object({
        after: z.string(),
        children: PostSchema.array().min(5),
      })
      .required(),
  })
  .transform((listing) => listing.data);

export type Post = z.infer<typeof PostSchema>;

export default function PostCollection({
  listing,
  subreddit,
  token,
}: {
  listing: any;
  subreddit: string;
  token: string;
}) {
  const parsedListing = ListingSchema.safeParse(listing);
  if (!parsedListing.success) {
    throw new Error("Error accessing the subreddit!");
  }

  const [posts, setPosts] = useState(parsedListing.data.children);
  const [nextListing, setNextListing] = useState(parsedListing.data.after);
  const [topUnreadPostId, setTopUnreadPostId] = useState("");

  const hasTopUnreadPost = posts.some(
    (post) => post.data.id === topUnreadPostId
  );

  useEffect(() => {
    if (topUnreadPostId == null) {
      localStorage.setItem(subreddit, posts[0].data.id);
      setTopUnreadPostId(posts[0].data.id);
    }

    setTopUnreadPostId(localStorage.getItem(subreddit) as string);
    const fetchNext = async (): Promise<void> => {
      let apiUrl = `https://oauth.reddit.com/r/${subreddit}/top?t=all&limit=10&after=${nextListing}`;
      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      const data = await res.json();
      const parsedNextListing = ListingSchema.safeParse(data);
      if (parsedNextListing.success) {
        setPosts([...posts, ...parsedNextListing.data.children]);
        setNextListing(parsedNextListing.data.after);
      } else {
        throw parsedNextListing.error;
      }
    };

    if (!hasTopUnreadPost) {
      fetchNext().catch(console.error);
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchNext().catch(console.error);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1.0,
    });

    const observerId = posts.at(-5)?.data.id;
    if (observerId !== undefined) {
      observer.observe(document.getElementById(observerId)!);
    } else {
      console.error("Could not place intersection observer!");
    }
  }, [
    topUnreadPostId,
    setTopUnreadPostId,
    token,
    posts,
    subreddit,
    nextListing,
    hasTopUnreadPost,
  ]);

  const resetRedive = () => {
    for (const { data } of posts) {
      const isRead = Boolean(localStorage.getItem(data.id));
      if (!isRead) {
        localStorage.setItem(subreddit, data.id);
        setTopUnreadPostId(data.id);
        break;
      }
    }
  };

  return (
    <main>
      <Header
        subreddit={subreddit}
        topUnreadPostId={topUnreadPostId}
        canDive={hasTopUnreadPost}
      />
      <ol className={styles.postCollection} id={"infinite-scroll"}>
        {posts.map((p: Post) => (
          <Post key={p.data.id} post={p} resetRedive={resetRedive} />
        ))}
        <LoadingSpinner />
      </ol>
    </main>
  );
}
