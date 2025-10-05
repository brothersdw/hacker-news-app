// import { useEffect, useState, type ReactNode } from "react";
import { useState, createContext } from "react";
import { useSearchParams } from "react-router-dom";
// import { api } from "./api";
// import { HnIframeModal, LatestHnTiles, HnSearchBox } from "./components";
import { LatestHnTiles, HnSearchBox, HnIframeModal } from "./components";
import "./hackerNewsApp.css";

export type Story = {
  hits: [{ author: string; title: string; updated_at: string; url: string }];
  nbPages: number;
};

type HnAppRootContextType = {
  setSearchFor: (query: string) => void;
};

export const HnAppRootContext = createContext<HnAppRootContextType | null>(
  null
);
const HackerNewsApp = () => {
  // const [stories, setStories] = useState<Story | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [searchFor, setSearchFor] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const handleClearUrl = () => {
    setIframeUrl(null);
  };
  // const [searched, setSearched] = useState<boolean>(false);
  // const [clearSearch, setClearSearch] = useState<boolean>(false)

  // useEffect(() => {
  //   const getStories = async () => {
  //     setLoading(true);
  //     // let topStoryId: number;
  //     // try {
  //     //   const topStoryIds = await axios.get<number[]>(
  //     //     "https://hacker-news.firebaseio.com/v0/topstories.json"
  //     //   );
  //     //   topStoryId = topStoryIds.data[0];
  //     // } catch (error) {
  //     //   throw new Error(
  //     //     `Something unexpected happened when fetching top story ids! ${error}`
  //     //   );
  //     // }
  //     if (!searchFor) {
  //       api.getLatestNews(setStories, page);
  //       setSearched(false);
  //       return setTimeout(() => setLoading(false), 1000);
  //     }
  //     api.searchStories(setStories, searchFor, page);
  //     setSearched(true);
  //     setTimeout(() => setLoading(false), 1000);
  //   };
  //   getStories();
  // }, [searchFor, page]);
  // if (!stories)
  //   return (
  //     <div className="app-loading">
  //       <h1>Loading...</h1>
  //     </div>
  //   );

  const value = {
    setSearchFor,
  };
  return (
    <HnAppRootContext.Provider value={value}>
      <div className="hn-app-container">
        <div className="hacker-news-app-container">
          <h1 className="hn-app-title">Hacker News App</h1>
          <HnSearchBox />
          <HnIframeModal url={iframeUrl} onClearUrl={handleClearUrl} />
          {/* <HnSearchBox onSearch={setSearchFor} /> */}
          <LatestHnTiles
            // stories={stories}
            // onOpenHnModal={setIframeUrl}
            // loading={loading}
            // searched={searched}
            searchFor={searchFor}
            setIframeUrl={setIframeUrl}
            // setPage={setPage}
            // page={page}
          />
        </div>
      </div>
    </HnAppRootContext.Provider>
  );
};

export default HackerNewsApp;
