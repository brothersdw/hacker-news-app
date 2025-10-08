import { useEffect, useState } from "react";
import "./hnPagePicker.css";

type HnPagePickerProps = {
  pages: number;
  onSetPage: (page: number) => void;
  setResetPageNum: (reset: boolean) => void;
  resetPageNum: boolean;
  searchParams: URLSearchParams;
};
const HnPagePicker = ({
  pages,
  onSetPage,
  resetPageNum,
  setResetPageNum,
  searchParams,
}: HnPagePickerProps) => {
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")!)
  );

  useEffect(() => {
    if (resetPageNum) {
      onSetPage(0);
      setCurrentPage(0);
      setResetPageNum(false);
    }
  }, [resetPageNum]);

  const pageNumbers = Array.from({ length: pages }, (_, i) => i);
  return (
    <div className="hn-page-nav-container">
      <nav className="hn-page-nav">
        {pageNumbers.map((pageNum, idx) => (
          <button
            onClick={() => {
              onSetPage(pageNum);
              setCurrentPage(pageNum);
            }}
            className={
              idx === currentPage ? "page-btn-active" : "page-btn-inactive"
            }
            key={Math.random()}
          >
            {pageNum + 1}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HnPagePicker;
