import FilterIcon from "./FilterIcon.jsx";

const SORT_OPTIONS = [
  { value: "newest", label: "Recently added" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

const SortFilterSelect = ({ value, onChange, id = "sort-filter" }) => (
  <div className="sort-filter">
    <FilterIcon className="sort-filter__icon" />
    <span className="sort-filter__label" id={`${id}-label`}>
      Filter
    </span>
    <svg
      className="sort-filter__chevron"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="sort-filter__select"
      aria-labelledby={`${id}-label`}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortFilterSelect;
