import { useRef, type FormEvent } from "react";
import "./hnSearchBox.css";
type HnSearchBoxProps = {
  onSearch: (searchFor: string) => void;
};
const HnSearchBox = ({ onSearch }: HnSearchBoxProps) => {
  const searchTerm = useRef<HTMLInputElement | null>(null);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = searchTerm.current!.value;
    event.currentTarget.reset();
    onSearch(search);
  };
  return (
    <form className="hn-search-container" onSubmit={handleSearch}>
      {/* <div className="hn-search-box-container"> */}
      <input
        type="text"
        id="hn-search-box"
        name="hn-search-box"
        className="hn-search-box"
        placeholder="Search Hacker News"
        ref={searchTerm}
      />
      {/* </div> */}
      <button className="hn-search-btn">Search</button>
    </form>
  );
};

export default HnSearchBox;
