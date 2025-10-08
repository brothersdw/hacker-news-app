import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

type HnDropDownDatePickerType = {
  onCalendarToggle: () => void;
  onSetDates: (value: DateRange | undefined) => void;
  customDates: DateRange | undefined;
  calendarToggle: boolean;
};
const HnDropDownDatePicker = ({
  onCalendarToggle,
  onSetDates,
  customDates,
}: HnDropDownDatePickerType) => {
  const handleDone = () => {
    onCalendarToggle();
  };

  const handleCancel = () => {
    onCalendarToggle();
  };

  return (
    <div className="hn-date-picker">
      <div className="hn-calendar-container">
        <DayPicker
          mode="range"
          captionLayout="dropdown"
          classNames={{
            root: "hn-calendar",
            day_button: "hn-calendar-day-button",
            range_start: "hn-calendar-range-start",
            range_middle: "hn-calendar-range-middle",
            range_end: "hn-calendar-range-end",
            chevron: "hn-calendar-chevron",
            button_next: "hn-calendar-button-next",
            button_previous: "hn-calendar-button-previous",
            nav: "hn-calendar-nav",
            months: "hn-calendar-months-container",
            month_caption: "hn-calendar-month-caption",
            months_dropdown: "hn-calendar-month-dropdown",
            years_dropdown: "hn-calendar-year-dropdown",
            dropdown: "hn-calendar-dropdown",
            caption_label: "hn-calendar-caption-label",
            day: "hn-calender-day",
          }}
          onSelect={onSetDates}
          selected={customDates}
        />
        <div className="hn-calendar-btn-container">
          <button
            className="hn-calendar-button hn-calendar-done-btn"
            onClick={handleDone}
          >
            Done
          </button>
          <button
            className="hn-calendar-button hn-calendar-cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export { HnDropDownDatePicker };
