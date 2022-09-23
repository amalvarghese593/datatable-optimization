import React from "react";

const DataTableCollapsableRow = ({ row, hiddenColumns }) => {
  return (
    <div className="row">
      {row?.allCells.map((cell, idx) => {
        return cell.column.collapsed ? (
          cell.column.isVisible === true ? (
            <div
              className={
                cell.column?.detailedGrid
                  ? `${cell.column?.detailedGrid} mb-2`
                  : `col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-2`
              }
              key={idx}>
              <span className="fs-14 fw-600 text_SecondaryColor">
                {cell.column.Header}:
              </span>
              <div className="fs-15">{cell.render("Cell")}</div>
            </div>
          ) : null
        ) : null;
      })}
    </div>
  );
};

export default DataTableCollapsableRow;
