import { useRef, type FormEvent } from "react";
import "./hnSearchBox.css";
type HnSearchBoxProps = {
  onQuery: (newQuery: string) => void;
};
const HnSearchBox = ({ onQuery }: HnSearchBoxProps) => {
  const searchTerm = useRef<HTMLInputElement | null>(null);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = searchTerm.current!.value;
    onQuery(search);
    event.currentTarget.reset();
  };

  return (
    <form className="hn-search-container" onSubmit={handleSearch}>
      <input
        type="text"
        id="hn-search-box"
        name="hn-search-box"
        className="hn-search-box"
        placeholder="Search Hacker News"
        ref={searchTerm}
      />
      <button className="hn-search-btn">Search</button>
    </form>
  );
};

export default HnSearchBox;
