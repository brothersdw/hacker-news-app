import { useEffect, useState, createContext, useContext } from "react";
import { type Story } from "../../HackerNewsApp";
import { HnPagePicker, HnSearchBox, HnIframeModal } from "../";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import { BookOpen, NewspaperClipping } from "phosphor-react";
import "./latestHnTiles.css";

type LatestHnTilesProps = {
  // stories: Story;
  // loading: boolean;
  // searched: boolean;
  searchFor: string | null;
  setIframeUrl: (url: string) => void;
};

// const LatestHnTiles = ({
//   // stories,
//   // loading,
//   // searched,
//   // searchedFor,
// onOpenHnModal
//   // onSetPage,
// }: LatestHnTilesProps) => {
// const LatestHnTiles = ({ onOpenHnModal }: LatestHnTilesProps) => {
type LatestHnTilesContextType = {
  searchParams: URLSearchParams;
  setPage: (page: number) => void;
};
export const LatestHnTilesContext =
  createContext<LatestHnTilesContextType | null>(null);
const LatestHnTiles = ({ searchFor, setIframeUrl }: LatestHnTilesProps) => {
  const [stories, setStories] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams({
    page: "0",
    query: "",
  });
  // const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page")!));

  const friendlyDate = (date: string) => {
    const newDate = new Date(`${date}`);
    const dateStringArray = newDate.toString().split(" ");
    const friendlyDate = `${dateStringArray[1]} ${dateStringArray[2]}, ${dateStringArray[0]} ${dateStringArray[3]} ${dateStringArray[4]} ${dateStringArray[5]} ${dateStringArray[6]} ${dateStringArray[7]} ${dateStringArray[8]}`;
    return friendlyDate;
  };

  // const handleClearUrl = () => {
  //   setIframeUrl(null);
  // };

  const handlePagination = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };
  useEffect(() => {
    const searchStories = async () => {
      // let topStoryId: number;
      // try {
      //   const topStoryIds = await axios.get<number[]>(
      //     "https://hacker-news.firebaseio.com/v0/topstories.json"
      //   );
      //   topStoryId = topStoryIds.data[0];
      // } catch (error) {
      //   throw new Error(
      //     `Something unexpected happened when fetching top story ids! ${error}`
      //   );
      // }
      if (!searchFor) {
        setLoading(true);
        api.getLatestNews(setStories, page);
        setSearched(false);
        return setLoading(false);
        // return setTimeout(() => setLoading(false), 1000);
      }
      setLoading(true);
      api.searchStories(setStories, searchFor, page);
      setSearched(true);
      setLoading(false);
      // setTimeout(() => setLoading(false), 1000);
    };
    searchStories();
  }, [searchFor, searchParams, page]);

  if (!stories || loading)
    return (
      <div className="news-tiles-loading">
        <h1>Loading...</h1>
      </div>
    );

  const value = {
    searchParams: searchParams,
    setPage,
  };
  return (
    <LatestHnTilesContext.Provider value={value}>
      <div className="news-tile-container">
        {searched ? (
          <h2 className="hn-results">Results for: '{searchFor}'</h2>
        ) : (
          <h2 className="latest-news-title">Latest News</h2>
        )}

        {/* {(page > 0 || stories) && ( */}
        <HnPagePicker pages={stories!.nbPages} onSetPage={handlePagination} />
        {/* )} */}
        {/* {stories && !loading ? ( */}
        <>
          {stories.hits.map((story) => {
            return (
              <div className="news-tile" key={Math.random()}>
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
                    onClick={() => setIframeUrl(story.url)}
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
        </>
        {/* ) : (
          <div className="hn-tiles-loading">
            <h1>Loading...</h1>
          </div>
        )} */}
      </div>
    </LatestHnTilesContext.Provider>
  );
};
export default LatestHnTiles;
