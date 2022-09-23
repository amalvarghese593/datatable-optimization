import { Listbox } from "@headlessui/react";
import React, { Fragment } from "react";
import MenuItem from "../MenuItem";

const ColumnHidding = ({
  allColumns,
  hiddenColumns = [],
  // getToggleHideAllColumnsProps,
}) => {
  return (
    <Listbox
      multiple
      value={hiddenColumns || []}
      onChange={() => {}}
      as="div"
      className="relative inline-block text-left">
      <div>
        <Listbox.Button
          as={"button"}
          className="text-dark me-2 mr-2 rounded-3 columns-btn nav-link bg-light flex items-center justify-center text-sm font-medium ">
          All
          <i className="ms-2 fs-13 fa-solid fa-angle-down"></i>
        </Listbox.Button>
      </div>
      <Listbox.Options
        style={{ zIndex: 11 }}
        className="rounded-1 absolute  mt-2 w-56 text-start rounded-md bg-white shadow-lg px-0 listbox-options">
        <div className="border-bottom px-1 py-2">
          <h4 className="fs-15 ps-2">Select the option</h4>
        </div>
        <ul className="list-group px-1 py-2 flex-column flex ">
          {allColumns?.map?.((column, idx) => {
            if (hiddenColumns.includes(column.id)) {
              return null;
            }
            return (
              typeof column?.Header === "string" && (
                <Fragment key={idx}>
                  <MenuItem
                    isSelected={column.getToggleHiddenProps()?.checked}
                    component={Listbox.Option}
                    onClick={() => {}}>
                    <div className="flex items-center">
                      <label className={`checkbox-container ps-1`}>
                        {column.getToggleHiddenProps()?.checked ? (
                          <i class="fa-regular fa-square-check pe-2"></i>
                        ) : (
                          <i class="fa-regular fa-square pe-2"></i>
                        )}
                        {typeof column?.Header === "string"
                          ? column?.Header
                          : "Function"}
                        <input
                          {...column.getToggleHiddenProps()}
                          type="checkbox"
                          style={{ display: "none" }}
                        />
                        {/* <span className={`checkbox-checkmark `}></span> */}
                      </label>
                    </div>
                  </MenuItem>
                </Fragment>
              )
            );
          })}
        </ul>
      </Listbox.Options>
    </Listbox>
  );
};

export default ColumnHidding;
