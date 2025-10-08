import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import "./hnDropdowns.css";
import type { FilterParam } from "../../HackerNewsApp";
import type { Category, DateSelection, Sort } from "../../api/api";
import { HnDropDownDatePicker } from "./hnDropDownDatePicker";
import { type SetURLSearchParams } from "react-router-dom";
import type { DateRange } from "react-day-picker";

type HnDropdownsType = {
  onSetDropdowns: (value: SetStateAction<FilterParam>) => void;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  setResetPageNum: (value: boolean) => void;
  setPage: (num: number) => void;
};

type FilterParamShort = {
  category: Category;
  sort: Sort;
  date: DateSelection;
};

const HnDropDowns = ({
  onSetDropdowns,
  searchParams,
  setSearchParams,
  setResetPageNum,
  setPage,
}: HnDropdownsType) => {
  const categoryOptions = [
    "All",
    "Stories",
    "Ask HN",
    "Show HN",
    "Comments",
    "Polls",
  ];
  const sortOptions = ["Popularity", "Date"];
  const dateOptions = [
    "All Time",
    "Last 24hrs",
    "Past Week",
    "Past Month",
    "Past Year",
    "Custom",
  ];
  const categorySelection = useRef<HTMLSelectElement | null>(null);
  const sortSelection = useRef<HTMLSelectElement | null>(null);
  const dateSelection = useRef<HTMLSelectElement | null>(null);
  const [currentSelected, setCurrentSelected] = useState<FilterParamShort>({
    category: (searchParams.get("category") as Category) || "All",
    sort: (searchParams.get("sortBy") as Sort) || "Popularity",
    date: (searchParams.get("date") as DateSelection) || "All Time",
  });
  const [calendarToggle, setCalendarToggle] = useState<boolean>(false);
  const [customDates, setCustomDates] = useState<DateRange | undefined>();

  const handleCalendarToggle = () => {
    setCalendarToggle(!calendarToggle);
  };
  useEffect(() => {
    // const handleSetCustomDates = () => {
    if (!calendarToggle && customDates && customDates.from && customDates.to) {
      const dateSelect = dateSelection.current!.value;
      onSetDropdowns((prev) => {
        return {
          ...prev,
          date: "Custom",
          from: customDates.from,
          to: customDates.to,
        };
      });
      setSearchParams((prev) => {
        return {
          ...prev,
          date: dateSelect,
          from: customDates.from,
          to: customDates.to,
        };
      });
      setCurrentSelected((prev) => {
        setPage(0);
        setResetPageNum(true);
        return { ...prev, date: "Custom" };
      });
    }
  }, [calendarToggle, customDates]);

  const handleSubmitCategory = () => {
    const category = categorySelection.current!.value;
    // onSetDropdowns(prev => {...prev, category});
    onSetDropdowns((prev) => {
      return { ...prev, category: category as Category };
    });
    setSearchParams((prev) => {
      return { ...prev, category: category as Category };
    });
    setCurrentSelected((prev) => {
      if (prev.category !== category) {
        setPage(0);
        setResetPageNum(true);
      }
      return { ...prev, category: category as Category };
    });
  };
  const handleSortSelection = () => {
    const sort = sortSelection.current!.value;
    onSetDropdowns((prev) => {
      return { ...prev, sort: sort as Sort };
    });
    setSearchParams((prev) => {
      return { ...prev, sortBy: sort as Sort };
    });
    setCurrentSelected((prev) => {
      if (prev.sort !== sort) {
        setPage(0);
        setResetPageNum(true);
      }
      return { ...prev, sort: sort as Sort };
    });
  };
  const handleSubmitDate = () => {
    const dateSelect = dateSelection.current!.value;
    if (dateSelect === "Custom") {
      setCalendarToggle(true);
      return;
    }
    onSetDropdowns((prev) => {
      return {
        ...prev,
        from: undefined,
        to: undefined,
        date: dateSelect as DateSelection,
      };
    });
    setSearchParams((prev) => {
      return {
        ...prev,
        from: undefined,
        to: undefined,
        date: dateSelect as DateSelection,
      };
    });
    setCurrentSelected((prev) => {
      if (prev.date !== dateSelect) {
        setPage(0);
        setResetPageNum(true);
      }
      return { ...prev, date: dateSelect as DateSelection };
    });
  };
  return (
    <div className="hn-dropdown-form">
      <DropDown
        label="Category"
        fn={handleSubmitCategory}
        dropDownRef={categorySelection}
        options={categoryOptions}
        currentSelection={currentSelected.category}
      />
      <DropDown
        label="Sort"
        fn={handleSortSelection}
        dropDownRef={sortSelection}
        options={sortOptions}
        currentSelection={currentSelected.sort}
      />
      <DropDown
        label="Date"
        fn={handleSubmitDate}
        dropDownRef={dateSelection}
        options={dateOptions}
        currentSelection={currentSelected.date}
      />
      {calendarToggle && (
        <HnDropDownDatePicker
          onCalendarToggle={handleCalendarToggle}
          calendarToggle={calendarToggle}
          onSetDates={setCustomDates}
          customDates={customDates}
        />
      )}
    </div>
  );
};

type DropDownTypes = {
  label: string;
  fn: (event: FormEvent<HTMLSelectElement>) => void;
  dropDownRef: RefObject<HTMLSelectElement | null>;
  options: string[];
  currentSelection: string;
};

const DropDown = ({
  label,
  fn,
  dropDownRef,
  options,
  currentSelection,
}: DropDownTypes) => {
  return (
    <form className="hn-form-select-container">
      <label htmlFor={`${label.toLowerCase()}`}>{label}</label>
      <select
        value={currentSelection}
        name={`${label.toLowerCase()}`}
        id={`${label.toLowerCase()}`}
        ref={dropDownRef}
        onChange={fn}
      >
        {options.map((option) => (
          <option id={option} key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );
};

export default HnDropDowns;
