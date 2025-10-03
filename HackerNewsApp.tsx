import { useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { HnIframeModal, LatestHnTiles, HnSearchBox } from "./components";
import "./hackerNewsApp.css";

export type Story = {
  hits: [{ author: string; title: string; updated_at: string; url: string }];
  nbPages: number;
};

const HackerNewsApp = () => {
  const [stories, setStories] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [searchFor, setSearchFor] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const handleClearUrl = () => {
    setIframeUrl(null);
  };
  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
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
        api.getLatestNews(setStories, page);
        setSearched(false);
        return setTimeout(() => setLoading(false), 1000);
      }
      api.searchStories(setStories, searchFor, page);
      setSearched(true);
      setTimeout(() => setLoading(false), 1000);
    };
    getStories();
  }, [searchFor, page]);
  if (!stories)
    return (
      <div className="app-loading">
        <h1>Loading...</h1>
      </div>
    );
  return (
    <div className="hn-app-container">
      <HnIframeModal url={iframeUrl} onClearUrl={handleClearUrl} />
      <div className="hacker-news-app-container char-tiles">
        <h1 className="hn-app-title">Hacker News App</h1>
        <HnSearchBox onSearch={setSearchFor} />
        <LatestHnTiles
          stories={stories}
          onOpenHnModal={setIframeUrl}
          loading={loading}
          searched={searched}
          searchedFor={searchFor}
          onSetPage={setPage}
        />
      </div>
    </div>
  );
};

export default HackerNewsApp;
