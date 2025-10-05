import axios from "axios";
import { type Story } from "../HackerNewsApp";

const baseUrl = "http://hn.algolia.com/api/v1/search";
const api = {
  getLatestNews: async (state: (obj: Story) => void, page: number) => {
    try {
      const currentStories = await axios.get<Story>(
        `${baseUrl}?tags=front_page&page=${page || 0}&hitsPerPage=12`
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
      const queryStories = await axios.get<Story>(
        `${baseUrl}?query=${query}&tags=story&page=${page || 0}&hitsPerPage=12`
      );
      return state(queryStories.data);
    } catch (error) {
      throw new Error(
        `Something unexpected happened when fetching the latest query! ${error}`
      );
    }
  },
};

export default api;
