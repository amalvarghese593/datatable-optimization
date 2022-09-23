import React, { Fragment } from "react";
import { Popover } from "@headlessui/react";

const Export = ({ onExport }) => {
  let downloaded = "";
  let get_columns = [];
  const isSelected = () => {};
  const handleSelect = () => {};
  const downloadReport = () => {
    onExport();
  };
  return (
    <Fragment>
      <Popover className="">
        <Popover.Button className="export-button me-2 rounded-lg border-0">
          Export
        </Popover.Button>
        <Popover.Panel className="absolute z-10 left-0" style={{ left: "0" }}>
          <div className="bg-light px-2 py-1">
            <p className="mb-0 fs-16">
              Select columns you want to export &amp;{" "}
              <b>Press Apply and Filter</b>
            </p>
          </div>
          <div className="d-flex flex-column flex-wrap w-100 bg-white px-3 py-4 border-1 border shadow-sm  ">
            <small className="mb-2 fs-14" style={{ opacity: 0.6 }}>
              Do you want to export more? change limit(show) of page as you want
            </small>
            <div className="d-flex flex-row flex-wrap w-100 bg-white">
              {get_columns?.map((column, idx) => {
                return (
                  <span
                    className={`chip mb-1 me-2 ${
                      isSelected(column?.placeholder) ? "active" : ""
                    }`}
                    key={idx}
                    onClick={() =>
                      handleSelect(column?.placeholder, column?.accessor)
                    }>
                    {column?.placeholder}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center bg-light px-2 py-2 grid grid-2 grid-1:sm">
            <div className="progress w-100">
              <div
                className="progress-bar primary-color"
                role="progressbar"
                style={{ width: `${downloaded}%` }}
                aria-valuenow={downloaded}
                aria-valuemin="0"
                aria-valuemax="100">
                {downloaded}%
              </div>
            </div>
            <button
              className="btn buttonSecondary d-inline-block ms-auto border-0"
              onClick={downloadReport}>
              Apply &amp; Export
            </button>
          </div>
        </Popover.Panel>
      </Popover>
    </Fragment>
  );
};

export default Export;
