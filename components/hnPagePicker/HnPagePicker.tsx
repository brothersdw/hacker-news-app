import { useContext, useEffect, useState } from "react";
import "./hnPagePicker.css";
import { LatestHnTilesContext } from "../latestHnTiles/LatestHnTiles";

type HnPagePickerProps = {
  pages: number;
  onSetPage: (page: number) => void;
};
const HnPagePicker = ({ pages, onSetPage }: HnPagePickerProps) => {
  const hnContext = useContext(LatestHnTilesContext);
  if (!hnContext) throw new Error("error");
  const { searchParams, setPage } = hnContext;
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")!)
  );

  useEffect(() => {});
  const pageNumbers = Array.from({ length: pages }, (_, i) => i);
  return (
    <div className="hn-page-nav-container">
      <nav className="hn-page-nav">
        {pageNumbers.map((pageNum, idx) => (
          <button
            onClick={() => {
              onSetPage(pageNum);
              setPage(pageNum);
              setCurrentPage(pageNum);
              // setCurrentPage((prevPage) => {
              //   const pageString = searchParams.get("page");
              //   const pageNumber = parseInt(pageString!);
              //   return pageNumber ? pageNumber : 0;
              // });
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
