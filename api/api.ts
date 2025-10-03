import axios from "axios";
import { type Story } from "../HackerNewsApp";

const baseUrl = "http://hn.algolia.com/api/v1/search";
const api = {
  getLatestNews: async (state: (obj: Story) => void, page: number) => {
    try {
      const currentStories = await axios.get<Story>(
        `${baseUrl}?tags=front_page&${page}&hitsPerPage=30`
      );
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
    page: number
  ) => {
    try {
      const query = searchString;
      console.log("this is your query", query);
      const queryStories = await axios.get<Story>(
        `${baseUrl}?query=${query}&tags=story&page=${page}&hitsPerPage=30`
      );
      console.log("This is what was returned:", queryStories.data);
      return state(queryStories.data);
    } catch (error) {
      throw new Error(
        `Something unexpected happened when fetching the latest query! ${error}`
      );
    }
  },
};

export default api;
