import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";
import {
  HnStoryTiles,
  HnSearchBox,
  HnIframeModal,
  HnPagePicker,
  HnDropDowns,
} from "./components";
import { Footer } from "../../components";
import "./hackerNewsApp.css";
import type { Category, DateSelection, Sort } from "./api/api";

export type Story = {
  hits: [
    {
      author: string;
      title: string;
      updated_at: string;
      created_at: string;
      url: string;
      story_tile: string;
      story_url: string;
      comment_text: string;
      points: number | null;
    }
  ];
  nbPages: number;
  nbHits: number;
};

export type FilterParam = {
  category: Category;
  sort: Sort;
  date: DateSelection;
  from: Date | undefined;
  to: Date | undefined;
};

const cleanParamStr = (str: string | null) => {
  if (!str) return;
  const strLowercase = str.toLowerCase();
  if (strLowercase === "ask hn") {
    return "Ask HN";
  }
  if (strLowercase === "show hn") {
    return "Show HN";
  }
  const cleanStr = strLowercase
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return cleanStr;
};

const HackerNewsApp = () => {
  // Comment test
  const [stories, setStories] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams({ page: "0" });
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [resetPageNum, setResetPageNum] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(searchParams.get("query")!);
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page")!));
  const [clearSearch, setClearSearch] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [filterParams, setFilterParams] = useState<FilterParam>({
    category:
      (cleanParamStr(searchParams.get("category")) as Category) || "All",
    sort: (cleanParamStr(searchParams.get("sortBy")) as Sort) || "Popularity",
    date:
      (cleanParamStr(searchParams.get("date")) as DateSelection) || "All Time",
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : undefined,
    to: searchParams.get("from")
      ? new Date(searchParams.get("to")!)
      : undefined,
  });
  const handleClearUrl = () => {
    setIframeUrl(null);
  };

  const handleQuery = (newQuery: string) => {
    if (!newQuery) return;
    setQuery(newQuery);
    setResetPageNum(true);
  };

  const handlePagination = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (initialLoad) {
      setSearchParams({ page: "0" });
      setInitialLoad(false);
    }
  }, [initialLoad]);

  useEffect(() => {
    const onClearSearch = () => {
      if (clearSearch) {
        setLoading(true);
        setPage(0);
        setQuery("");
        setResetPageNum(true);
        setSearchParams({ page: "0" });
        setFilterParams({
          category: "All",
          sort: "Popularity",
          date: "All Time",
          from: undefined,
          to: undefined,
        });
        api.getLatestNews(setStories, page);
        setSearched(false);
        setTimeout(() => setLoading(false), 1000);
        setClearSearch(false);
        return;
      }
    };

    const searchStories = async () => {
      if (!query) {
        setLoading(true);
        api.getLatestNews(setStories, page);
        setSearched(false);
        setSearchParams({
          page: page.toString(),
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      if (filterParams.from && filterParams.to) {
        setSearchParams({
          page: page.toString(),
          query: query,
          category: filterParams.category,
          sortBy: filterParams.sort,
          date: filterParams.date,
          from: filterParams.from!.toString(),
          to: filterParams.to!.toString(),
        });
      }

      if (!filterParams.from && !filterParams.to) {
        setSearchParams({
          page: page.toString(),
          query: query,
          category: filterParams.category,
          sortBy: filterParams.sort,
          date: filterParams.date,
        });
      }
      api.searchStories(
        setStories,
        query,
        page,
        filterParams.category,
        filterParams.sort,
        filterParams.date,
        filterParams.from,
        filterParams.to
      );
      setSearched(true);
      setLoading(false);
    };
    onClearSearch();
    searchStories();
  }, [query, page, resetPageNum, searched, clearSearch, filterParams]);

  if (!stories || loading)
    return (
      <div className="news-tiles-loading">
        <h1>Loading...</h1>
      </div>
    );
  return (
    <>
      <HnIframeModal url={iframeUrl} onClearUrl={handleClearUrl} />
      <div className="hn-app-container">
        <div className="hacker-news-app-container">
          <h1 className="hn-app-title">Hacker News App</h1>
          <HnSearchBox onQuery={handleQuery} />
          <div className="news-tile-container">
            {searched ? (
              <>
                <button
                  className="clear-search-button"
                  onClick={() => setClearSearch(true)}
                >
                  Clear Search
                </button>
                <HnDropDowns
                  onSetDropdowns={setFilterParams}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  setResetPageNum={setResetPageNum}
                  setPage={setPage}
                />
                <h2 className="hn-results">Results for: ({query})</h2>
                <p>
                  {stories.nbHits > 1000
                    ? `Showing 1,000 of the most relevant results out of ${stories.nbHits.toLocaleString(
                        "en-US"
                      )} hits`
                    : `${stories.nbHits} Hits`}
                </p>
              </>
            ) : (
              <h2 className="latest-news-title">Latest News</h2>
            )}

            <HnPagePicker
              pages={stories!.nbPages}
              onSetPage={handlePagination}
              resetPageNum={resetPageNum}
              setResetPageNum={setResetPageNum}
              searchParams={searchParams}
            />

            <HnStoryTiles stories={stories} setIframeUrl={setIframeUrl} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HackerNewsApp;
