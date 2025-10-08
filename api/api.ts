import axios from "axios";
import { type Story } from "../HackerNewsApp";
import { type HnUserCard } from "../components/hnUserCard/HnUserCard";

const baseUrl = "https://hn.algolia.com/api/v1";
const baseUrlPopularity = `${baseUrl}/search`;
const baseUrlDate = `${baseUrl}/search_by_date`;

export type Sort = "Popularity" | "Date";
export type Category =
  | "All"
  | "Stories"
  | "Ask HN"
  | "Show HN"
  | "Comments"
  | "Polls";
export type DateSelection =
  | "All Time"
  | "Last 24hrs"
  | "Past Week"
  | "Past Month"
  | "Past Year"
  | "Custom";

const api = {
  getLatestNews: async (state: (obj: Story) => void, page: number) => {
    try {
      const params: Record<string, string | number> = {
        tags: "front_page",
        page: page || 0,
        hitsPerPage: 12,
      };
      const currentStories = await axios.get<Story>(baseUrlPopularity, {
        params,
      });
      return state(currentStories.data);
    } catch (error) {
      throw new Error(
        `Something unexpected happened when fetching the latest hacker news! ${error}`
      );
    }
  },
  searchStories: async (
    state: (obj: Story) => void,
    searchString: string,
    page: number,
    category: Category,
    sort: Sort,
    dateSelection: DateSelection,
    from: Date | undefined,
    to: Date | undefined
  ) => {
    try {
      const getUnixSeconds = (days: number) => {
        const unixSeconds = Math.floor(Date.now() / 1000) - days * 86400;
        return unixSeconds;
      };

      const getCustomUnixSeconds = (from: Date, to: Date) => {
        const fromSeconds = Math.floor(from.getTime() / 1000);
        const toSeconds = Math.floor(to.getTime() / 1000);
        return { from: fromSeconds, to: toSeconds };
      };

      type CustomDateRange = {
        from: number | undefined;
        to: number | undefined;
      };

      const oneDay = getUnixSeconds(1);
      const oneWeek = getUnixSeconds(7);
      const oneMonth = getUnixSeconds(30);
      const oneYear = getUnixSeconds(365);
      const baseUrlBySort: Record<Sort, string> = {
        Popularity: baseUrlPopularity,
        Date: baseUrlDate,
      };

      const categoryByType: Record<Category, string | undefined> = {
        All: "(story,ask_hn,show_hn,comment,poll)",
        Stories: "story",
        "Ask HN": "ask_hn",
        "Show HN": "show_hn",
        Comments: "comment",
        Polls: "poll",
      };
      const dateSelectionByType: Record<DateSelection, number | undefined> = {
        "All Time": undefined,
        "Last 24hrs": oneDay,
        "Past Week": oneWeek,
        "Past Month": oneMonth,
        "Past Year": oneYear,
        Custom: undefined,
      };

      const params: Record<string, string | number> = {
        query: searchString,
        page,
        hitsPerPage: 12,
      };

      if (categoryByType[category]) params.tags = categoryByType[category];
      if (dateSelection !== "Custom") {
        if (dateSelectionByType[dateSelection])
          params.numericFilters = `created_at_i>${dateSelectionByType[dateSelection]}`;
      }
      if (dateSelection === "Custom" && from && to) {
        const customDateRange: CustomDateRange = getCustomUnixSeconds(from, to);
        const fromDate = customDateRange.from;
        const toDate = customDateRange.to;
        params.numericFilters = `created_at_i>${fromDate},created_at_i<${toDate}`;
      }

      const base = baseUrlBySort[sort];

      const queryStories = await axios.get<Story>(base, { params });
      return state(queryStories.data);
    } catch (error) {
      throw new Error(
        `Something unexpected happened when fetching query for ${searchString}! ${error}`
      );
    }
  },
  getUser: async (state: (obj: HnUserCard) => void, user: string) => {
    const url = `${baseUrl}/users/${user}`;
    try {
      const queryUsers = await axios.get<HnUserCard>(url!);
      return state(queryUsers.data);
    } catch (error) {
      throw new Error(
        `Something unexpected happened when fetching the user! ${error}`
      );
    }
  },
};

export default api;
