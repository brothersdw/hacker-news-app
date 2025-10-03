import { type Story } from "../../HackerNewsApp";
import { HnPagePicker } from "../hnPagePicker";
import { BookOpen } from "phosphor-react";
import "./latestHnTiles.css";

type LatestHnTilesProps = {
  stories: Story;
  loading: boolean;
  searched: boolean;
  searchedFor: string | null;
  onOpenHnModal: (url: string) => void;
  onSetPage: (page: number) => void;
};

const LatestHnTiles = ({
  stories,
  loading,
  searched,
  searchedFor,
  onOpenHnModal,
  onSetPage,
}: LatestHnTilesProps) => {
  const friendlyDate = (date: string) => {
    const newDate = new Date(`${date}`);
    const dateStringArray = newDate.toString().split(" ");
    const friendlyDate = `${dateStringArray[1]} ${dateStringArray[2]}, ${dateStringArray[0]} ${dateStringArray[3]} ${dateStringArray[4]} ${dateStringArray[5]} ${dateStringArray[6]} ${dateStringArray[7]} ${dateStringArray[8]}`;
    return friendlyDate;
  };

  if (!stories || loading)
    return (
      <div className="news-tiles-loading">
        <h1>Loading...</h1>
      </div>
    );
  return (
    <div className="news-tile-container">
      {searched ? (
        <h2 className="hn-results">Results for: '{searchedFor}'</h2>
      ) : (
        <h2 className="latest-news-title">Latest News</h2>
      )}
      <HnPagePicker pages={stories.nbPages} onSetPage={onSetPage} />
      {stories.hits.map((story) => {
        return (
          <div className="news-tile">
            <div className="story-title-container">
              <h2>{story.title}</h2>
            </div>
            <h3>By: {story.author}</h3>
            <p className="hn-news-tile-date">
              Last Updated: {friendlyDate(story.updated_at)}
            </p>
            <a href={story.url} target="_blank">
              <button className="story-button">Visit page</button>
            </a>
            <div className="news-iframe-container">
              {/* <a href={story.url}> */}

              <div
                className="iframe-pop-out-icon"
                onClick={() => onOpenHnModal(story.url)}
              >
                <p>
                  <BookOpen size={50} />
                </p>
              </div>
              <iframe src={story.url}></iframe>

              {/* </a> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default LatestHnTiles;
