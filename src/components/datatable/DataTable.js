import React, { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useRowSelect,
  useExpanded,
} from "react-table";
import "./index.css";
import { useExportData } from "./useExportHook";
import { useResponsive } from "./useResponsive";
import DatatablePagination from "./DatatablePagination";
import DataTableCollapsableRow from "./DataTableCollapsableRow";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import useDataExportCall from "../data-export/data-export/useDataExportCall";
import ColumnHidding from "./ColumnHidding";
import GlobalFilter from "./DatatableSearch";
const Styles = styled.div`
  .pagination button {
    margin: 0px 3px;
    border: 1px solid #0e4692;
    background: #fff;
    padding: 5px 10px;
    color: #0e4692;
  }
  .pagination button:disabled {
    background: #fff;
    color: rgba(16, 16, 16, 0.3);
    border: 1px solid #f2eeeec7;
  }
  .pagination span {
    margin: 0px 5px;
  }
  .pagination select {
    margin-left: 10px;
  }
`;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, isAllChecked, disableSelection, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <label className={`my-0 mr-3 {checkbox  }`}>
          <input
            type="checkbox"
            disabled={disableSelection}
            ref={resolvedRef}
            {...rest}
          />
          <span
            className={`checkbox-indicator ${
              isAllChecked ? "checked-all" : ""
            }`}
          ></span>
        </label>
      </>
    );
  }
);
// const useFilterTypes = () =>
//   React.useMemo(
//     () => ({
//       text: (rows, id, filterValue) => {
//         return rows.filter((row) => {
//           const rowValue = row.values[id];
//           return rowValue !== undefined
//             ? String(rowValue)
//                 .toLowerCase()
//                 .startsWith(String(filterValue).toLowerCase())
//             : true;
//         });
//       },
//     }),
//     []
//   );
const DataTable = ({
  id: tableId,
  exportable,
  title,
  onSelect,
  hidden = [],
  loading: isLoading,
  columns,
  data,
  enableSelect,
  onCheckboxRender,
  disableCheckboxFn,
  countTitleLabel,
  // getExportFileBlob,
  disablePagination,
  disableSearch,
  customPageSize = 20,
  searchLabel,
  cta,
  ssp,
  fetchData,
  paginationData,
}) => {
  // const filterTypes = useFilterTypes();
  /*eslint-disable   no-unused-vars*/
  const [accHiddenColumns, setAccHiddenColumns] = useState(hidden || []);

  const [expanded, setExpanded] = useState({ firstName: true });
  const [collapsed, setCollapsed] = useState("");
  /*eslint-disable no-unused-vars */
  const [query, setQuery] = useSearchParams();
  const navigate = useNavigate();
  const { downloadReport, downloaded } = useDataExportCall();

  const sPagination = useMemo(() => {
    let pn = { totalPages: paginationData?.totalPages || 0 };
    return pn;
  }, [paginationData]);

  const getDefaultPage = useMemo(() => query.get("page"), [query]);
  const getDefaultPageLimit = useMemo(() => query.get("limit"), [query]);

  const exportFromApi = ({ /* columns, data, fileName, */ records }) => {
    downloadReport({ data: records, title: title });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    exportData,
    /*eslint-disable no-unused-vars */
    getToggleHideAllColumnsProps,
    allColumns,
    state: { pageIndex, pageSize, selectedRowIds, hiddenColumns, globalFilter },
  } = useTable(
    {
      columns,
      data,
      manualGlobalFilter: ssp ? true : false,
      // filterTypes,
      getExportFileBlob: exportFromApi,
      onExpandedChange: setExpanded,
      expanded: { expanded },
      manualPagination: ssp ? true : false,
      pageCount: sPagination?.totalPages,
      initialState: {
        tableId: tableId,
        autoResetPage: false,
        hiddenColumns: hidden,
        showPagination: false,
        disableSortBy: true,
        globalFilter: query.get("search") || "",
        pageIndex: parseInt(getDefaultPage) || 0,
        pageSize: disablePagination
          ? 350
          : getDefaultPageLimit || customPageSize,
      },
    },
    // useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useExportData,
    useResponsive,

    (hooks) => {
      if (!enableSelect) return null;
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => {
            if (onCheckboxRender) {
              onCheckboxRender(row.original);
            }
            return (
              <div>
                <IndeterminateCheckbox
                  disableSelection={
                    disableCheckboxFn
                      ? disableCheckboxFn?.(row.original)
                      : false
                  }
                  {...row.getToggleRowSelectedProps()}
                />
              </div>
            );
          },
        },
        ...columns,
      ]);
    }
  );
  useEffect(() => {
    setCollapsed(true);
    query.set("page", parseInt(pageIndex));
    navigate({ search: query.toString() });
  }, [pageIndex]);

  useEffect(() => {
    if (fetchData) {
      fetchData({
        pageIndex:
          pageIndex === "0" || pageIndex === 0 ? 1 : parseInt(pageIndex) + 1,
        pageSize,
        search: query.get("search"),
      });
    }
    /*eslint-disable   react-hooks/exhaustive-deps*/
  }, [pageSize, pageIndex, query.get("search")]);

  const onPageChange = useCallback(
    (pageNumArg) => gotoPage(pageNumArg),
    /*eslint-disable   react-hooks/exhaustive-deps*/
    [gotoPage]
  );
  const onPageLimitChange = useCallback(
    (limitArg) => {
      setPageSize(limitArg);
      setTimeout(() => {
        query.set("limit", limitArg);
        query.set("page", 0);
        navigate({ search: query.toString() });
      });
    },
    [query]
  );
  const noRowsSelected = useMemo(
    () => Object.keys(selectedRowIds)?.length === 0,
    [selectedRowIds]
  );
  const onSelectRow = () => {
    const selectedIds = Object.keys(selectedRowIds);
    var selectedRowsData = selectedIds
      .map((x) => data[x])
      .filter((x) => x != null);
    if (onSelect) {
      onSelect(selectedRowsData);
    }
  };
  const handleCollapse = (rowIndex) => setCollapsed(rowIndex);
  const hasAnyCollapsed = useMemo(() =>
    allColumns.some((column) => column?.collapsed)
  );

  const isFirstColumn = useMemo(() => {
    let uncollapsedColumns = [];
    for (let column of allColumns) {
      if (!column.collapsed && column.isVisible) {
        uncollapsedColumns.push(column);
      }
    }
    return uncollapsedColumns?.[0] || {};
  }, [allColumns, hiddenColumns]);

  const onNextPageHandler = () => nextPage();
  const onPrevPageHandler = () => previousPage();
  const showingRecordsHint = useMemo(() => {
    let docsCount = paginationData.totalDocs;
    let lastIndex = (parseInt(pageIndex) + 1) * pageSize;
    let firstIndex = lastIndex - pageSize + 1;
    return `Showing ${firstIndex} to ${Math.min(
      lastIndex,
      docsCount
    )} of ${docsCount}`;
  }, [pageCount, pageSize, pageIndex]);
  return (
    <Styles>
      <div className="pb-4 bg-white shadowContainer">
        <div className="d-flex flex-column tableFilter">
          <section className="table-headerArea">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="m-0 fs-20">{title}</h4>
              {cta}
            </div>
          </section>
          <section className="d-flex justify-content-between align-content-center paginationShow">
            {!disablePagination ? (
              <DatatablePagination
                defaultValue={pageIndex}
                setPageSize={onPageLimitChange}
                gotoPage={onPageChange}
                pageSize={pageSize}
                pageCount={pageCount}
              />
            ) : (
              <div className="datatable-title">
                {typeof title === "string" ? (
                  <h4>{title}</h4>
                ) : (
                  typeof title !== "undefined" && title
                )}

                {enableSelect && (
                  <small style={{ opacity: "0.8", fontWeight: "lighter" }}>
                    Select rows to save by clicking on checkbox
                  </small>
                )}
              </div>
            )}
            {!disableSearch && (
              <div className="text-end my-2 d-flex flex-row align-items-center ">
                {exportable === true && (
                  <button
                    className="export-button me-2 mr-2 rounded-3 columns-btn nav-link bg-light flex justify-between items-center inline-flex justify-center rounded-1 font-medium d-sm-block d-none"
                    onClick={() => {
                      exportData("xlsx", false);
                    }}
                  >
                    <i className="fa fa-file-export me-1"></i> Export
                  </button>
                )}
                {exportable && (
                  <span className="d-sm-block d-none">
                    <ColumnHidding
                      hiddenColumns={accHiddenColumns}
                      allColumns={allColumns}
                      getToggleHideAllColumnsProps={
                        getToggleHideAllColumnsProps
                      }
                    />
                  </span>
                )}
                <GlobalFilter
                  searchLabel={searchLabel}
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  query={query}
                />
              </div>
            )}
          </section>
          <div className="d-flex justify-content-between align-items-center">
            <small
              className="fs-15"
              style={{
                opacity: "0.9",
              }}
            >
              {showingRecordsHint}
            </small>
            {onSelect && (
              <button
                className={`btn btn-primary border-0`}
                style={{
                  opacity: noRowsSelected ? "0.7" : 1,
                  pointerEvents: noRowsSelected ? "none" : "all",
                  cursor: noRowsSelected ? "not-allowed" : "pointer",
                }}
                disabled={noRowsSelected}
                onClick={onSelectRow}
              >
                Submit
              </button>
            )}
          </div>
          {/* <small>Showing 2 of</small> */}
        </div>

        <div
          className="tableContainer"
          style={{ borderBottom: disablePagination ? 0 : "2px solid #f7f7f7" }}
        >
          <table {...getTableProps()} id={tableId || "table"}>
            <thead className="cf">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) =>
                    column.collapsed && column.collapsed === true ? null : (
                      <th
                        style={{ width: 20, overflow: "hidden" }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <div
                          className={`d-flex justify-content-between align-content-center ${
                            column.render("Header") === "Action" &&
                            "justify-content-center"
                          }`}
                        >
                          <div className="headerLable">
                            {column.render("Header")}
                            {column.collapsed}
                          </div>
                          {column.canSort && (
                            <div className="me-4 d-flex align-items-center justify-content-center sortableSection">
                              <i className="fas fa-caret-up sortUp fs-17"></i>
                              <i className="fas fa-caret-down sortDown fs-17"></i>
                            </div>
                          )}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {isLoading || page.length === 0 ? (
                <tr>
                  <></>
                  <td
                    style={{ width: 20, overflow: "hidden" }}
                    className="text-center"
                    colSpan={columns.length}
                  >
                    {isLoading ? (
                      <Fragment>
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </Fragment>
                    ) : (
                      "No data"
                    )}
                  </td>
                </tr>
              ) : (
                page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Fragment key={i}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, cellIdx) => {
                          return typeof cell.column.collapsed !== "undefined" ||
                            collapsed === false ? null : (
                            <td {...cell.getCellProps()} key={cellIdx}>
                              <div className="d-flex ">
                                {hasAnyCollapsed &&
                                  isFirstColumn.id === cell?.column?.id && (
                                    <CollapseButton
                                      handleCollapse={handleCollapse}
                                      collapsed={collapsed}
                                      index={i}
                                    />
                                  )}
                                {cell.render("Cell")}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      {i === collapsed && (
                        <tr className="collapsed-tableRow">
                          <td colSpan={row.cells?.length}>
                            <DataTableCollapsableRow
                              row={row}
                              hiddenColumns={allColumns
                                ?.filter((col) => col.collapsed === true)
                                .map((c) => c.id)}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!disablePagination && (
          <div className="pagination mt-4 d-flex justify-content-between bg-white">
            <div>
              <span>
                Page
                <strong>
                  {pageIndex + 1} of {pageCount}
                </strong>
              </span>
            </div>
            <div>
              {/* <button
                className="double-backward-arrow"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}>
                <DoubleArrowIcon />
              </button> */}
              <button
                className="backward-arrow"
                onClick={onPrevPageHandler}
                disabled={!canPreviousPage}
              >
                <UniqueArrowIcon />
              </button>
              <button
                className="forward-arrow"
                onClick={onNextPageHandler}
                disabled={!canNextPage}
              >
                <UniqueArrowIcon />
              </button>
              {/* <button
                className="double-forward-arrow"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}>
                <DoubleArrowIcon />
              </button> */}
            </div>
          </div>
        )}
      </div>
    </Styles>
  );
};

export default DataTable;

const CollapseButton = ({ collapsed, handleCollapse, index }) => {
  return (
    <Fragment>
      <button
        className="p-0 m-0 border-0 bg-transparent collapse-row-btn"
        onClick={() =>
          index === collapsed ? handleCollapse("") : handleCollapse(index)
        }
      >
        {index === collapsed ? (
          <i className="fas fa-minus-circle me-2 fs-18 text-primary"></i>
        ) : (
          <i className="fas fa-plus-circle fs-18 textPrimary me-2"></i>
        )}
      </button>
    </Fragment>
  );
};

const DoubleArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    fill="currentColor"
    className="bi bi-chevron-double-left"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
    <path
      fillRule="evenodd"
      d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
  </svg>
);
const UniqueArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    fill="currentColor"
    className="bi bi-chevron-left"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
    />
  </svg>
);
