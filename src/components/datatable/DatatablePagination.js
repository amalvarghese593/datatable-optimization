import React from "react";

const GoToPage = ({ defaultValue, pageCount, gotoPage }) => {
  return (
    <select
      value={defaultValue || 0}
      onChange={(e) => {
        const page = e.target.value;
        gotoPage(page);
      }}
    >
      <option value="">--Select--</option>
      {[...Array(pageCount || 5)].map((p, pIdx) => (
        <option value={pIdx} key={pIdx}>
          Page {pIdx + 1}
        </option>
      ))}
    </select>
  );
};

const DatatablePagination = ({
  defaultValue,
  setPageSize,
  gotoPage,
  pageSize,
  pageCount,
}) => {
  return (
    <div className="py-lg-3 py-md-3 py-sm-3 py-2">
      <span>
        <GoToPage
          gotoPage={gotoPage}
          defaultValue={defaultValue}
          pageCount={pageCount}
        />
      </span>
      <select
        className="mx-2"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        style={{ fontSize: "15px" }}
      >
        {[
          10, 20, 30, 40, 50, 80, 150, 200, 250, 300, 350, 400, 450, 500, 550,
          600, 650,
        ].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DatatablePagination;
