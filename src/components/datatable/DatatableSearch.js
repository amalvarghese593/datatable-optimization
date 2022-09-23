import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncDebounce } from "react-table";

const GlobalFilter = ({
  // preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchLabel,
  query = URLSearchParams,
}) => {
  const navigate = useNavigate();
  // const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    query.set("search", value?.trim());
    navigate({ search: query.toString() });
    setGlobalFilter(value?.trim() || undefined);
  }, 300);

  //   useEffect(() => {}, [globalFilter]);
  return (
    <DataTableSearch
      searchLabel={searchLabel}
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
};

export default GlobalFilter;
const DataTableSearch = ({ searchLabel, onChange, value }) => {
  const inputRef = useRef(null);
  const foucsInput = () => (inputRef ? inputRef.current.focus() : () => {});
  return (
    <div className="table-search">
      <article className="table-search-input">
        <div onClick={foucsInput}>
          <i className="bi bi-search"></i>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={searchLabel || "Enter your keyword"}
        />
      </article>
    </div>
  );
};
