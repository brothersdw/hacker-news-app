type HnPagePickerProps = {
  pages: number;
  onSetPage: (page: number) => void;
};
const HnPagePicker = ({ pages, onSetPage }: HnPagePickerProps) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i);
  return (
    <nav>
      {pageNumbers.map((pageNum) => (
        <button onClick={() => onSetPage(pageNum)}>{pageNum + 1}</button>
      ))}
    </nav>
  );
};

export default HnPagePicker;
