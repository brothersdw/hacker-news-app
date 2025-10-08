import { type Story } from "../../HackerNewsApp";
import "./hnStoryTiles.css";

type HnStoryTilesProps = {
  setIframeUrl: (url: string) => void;
  stories: Story;
};

const baseUrl = "/portfolio/hacker-news-app/users";

const HnStoryTiles = ({ stories }: HnStoryTilesProps) => {
  const friendlyDate = (date: string) => {
    const newDate = new Date(`${date}`);
    const dateStringArray = newDate.toString().split(" ");
    const friendlyDate = `${dateStringArray[1]} ${dateStringArray[2]}, ${dateStringArray[0]} ${dateStringArray[3]} ${dateStringArray[4]} ${dateStringArray[5]} ${dateStringArray[6]} ${dateStringArray[7]} ${dateStringArray[8]}`;
    return friendlyDate;
  };

  const decodeHtml = (encodedTxt: string) => {
    const div = document.createElement("div");
    div.innerHTML = encodedTxt;
    return div.innerHTML;
  };

  return stories.hits.map((story, idx) => {
    const decoded = decodeHtml(story.comment_text);
    return (
      <div className="news-tile" key={`news-tile-${idx}`}>
        <div className="story-title-container">
          <h2>{story.title || story.story_tile}</h2>
        </div>
        <h3>
          By:{" "}
          <a
            href={`${baseUrl}/${encodeURIComponent(story.author)}`}
            target="_blank"
          >
            {story.author}
          </a>
        </h3>
        <p className="hn-news-tile-date">
          <strong>Creation Date:</strong> {friendlyDate(story.created_at)}
        </p>
        {!story.url && !story.story_url ? (
          <p>Story page no longer exists</p>
        ) : (
          <a href={story.url || story.story_url} target="_blank">
            <button className="story-button">Visit page</button>
          </a>
        )}
        {story.comment_text && <p>Comment:</p>}
        <div
          className={`news-comment-container ${
            story.comment_text && "news-comment-background"
          }`}
        >
          {story.comment_text && (
            <div dangerouslySetInnerHTML={{ __html: decoded! }}></div>
          )}
        </div>
      </div>
    );
  });
};
export default HnStoryTiles;
