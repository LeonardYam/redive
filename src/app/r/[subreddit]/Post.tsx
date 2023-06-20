import styles from "./styles.module.css";
import { Post } from "./PostCollection";
import { MouseEvent, useLayoutEffect, useState } from "react";
import { decode } from "html-entities";

export default function Post({
  post,
  resetRedive,
}: {
  post: Post;
  resetRedive: () => void;
}) {
  const { id, title, permalink, score, num_comments, url } = post.data;
  const [isRead, setIsRead] = useState(false);
  const READ_FLAG = "X";

  // HTML5 entities such as &amp needs to be decoded before rendering.
  const decodedTitle = decode(title);

  useLayoutEffect(() => {
    setIsRead(localStorage.getItem(id) == READ_FLAG);
  }, [id, isRead, setIsRead]);
  const clickHandler = () => {
    localStorage.setItem(id, READ_FLAG);
    setIsRead(true);
    resetRedive();
  };

  const handleUnread = (e: MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem(id);
    setIsRead(false);
    resetRedive();
  };

  return (
    <li
      className={isRead ? styles.readPost : styles.unreadPost}
      onClick={clickHandler}
      onAuxClick={clickHandler}
      id={id}
    >
      <a className={styles.primaryLink} href={url}>
        {decodedTitle}
      </a>
      <div className={styles.postInformation}>
        {`${score} karma |`}
        <a
          className={styles.interactive}
          href={`https://www.reddit.com${permalink}`}
        >{`${num_comments} comments`}</a>
        <button onClick={handleUnread} className={styles.interactive}>
          unread
        </button>
      </div>
    </li>
  );
}
