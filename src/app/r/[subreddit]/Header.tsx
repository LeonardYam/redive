"use client";

import styles from "./styles.module.css";

export default function Header({
  subreddit,
  topUnreadPostId,
  canDive,
}: {
  subreddit: string;
  topUnreadPostId: string;
  canDive: boolean;
}) {
  const handleClick = () => {
    const post = document.getElementById(topUnreadPostId)!;
    post.scrollIntoView();
  };

  return (
    <div className={styles.header}>
      <h2>r/{subreddit}</h2>
      <button
        className={styles.rediveButton}
        onClick={handleClick}
        disabled={!canDive}
      >
        redive
      </button>
    </div>
  );
}
