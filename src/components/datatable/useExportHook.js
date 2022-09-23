import React from "react";
import { ensurePluginOrder } from "react-table";

function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== "undefined") {
      return args[i];
    }
  }
}
// Get exported file name(do not specify extension here)
const defaultGetExportFileName = ({ fileType, all }) => {
  return `${all ? "all-" : ""}data`;
};

// To get column name while exporting
const defaultGetColumnExportValue = (col) => {
  let name = col.Header;
  if (typeof name === "object" || typeof name === "function") {
    name = col.id;
  }
  return name;
};

// To get cell value while exporting
const defaultGetCellExportValue = (row, col) => {
  return row.values[col.id];
};
// const defaultGetRowObject = (row, col) => {
//   // console.log("Row: ", col);
//   let customRow = {};
//   customRow[col.Header] = row.values[col.id];
//   return customRow;
// };

const defaultGetExportFileBlob = () => {
  throw new Error("React Table: Export Blob is mandatory");
};

export const useExportData = (hooks) => {
  hooks.useInstance.push(useInstance);
};

useExportData.pluginName = "useExportData";

function useInstance(instance) {
  const {
    rows,
    initialRows = [],
    allColumns,
    disableExport,
    getExportFileName = defaultGetExportFileName,
    getExportFileBlob = defaultGetExportFileBlob,
    plugins,
  } = instance;

  ensurePluginOrder(
    plugins,
    ["useColumnOrder", "useColumnVisibility", "useFilters", "useSortBy"],
    "useExportData"
  );

  // Adding `canExport` & `exportValue` meta data
  allColumns.forEach((column) => {
    const { accessor, getColumnExportValue = defaultGetColumnExportValue } =
      column;

    const canExport = accessor
      ? getFirstDefined(
          column.disableExport === true ? false : undefined,
          disableExport === true ? false : undefined,
          true
        )
      : false;

    column.canExport = canExport;
    column.exportValue = getColumnExportValue(column);
  });

  // This method will enable export of data on `instance` object
  const exportData = React.useCallback(
    (fileType, all = false) => {
      // Columns which are exportable
      const exportableColumns = allColumns.filter(
        (col) => col.canExport && (all || col.isVisible)
      );

      if (exportableColumns.length === 0) {
        console.warn("No exportable columns are available");
      }

      // Rows which are exportable
      let exportableRows = (all ? initialRows : rows).map((row) => {
        return exportableColumns.map((col) => {
          const { getCellExportValue = defaultGetCellExportValue } = col;

          return getCellExportValue(row, col);
        });
      });

      /**exporting code */
      // let exportableRowsData = (all ? initialRows : rows).map((row) => {
      //   let finalR = exportableColumns.map((col) => {
      //     const { getCellExportValue = defaultGetRowObject } = col;
      //     // return getCellExportValue(row, col);
      //   });
      //   return finalR;
      //   // console.log("defaultGetRowObject", finalR);
      // });

      let exportableRowsData = [];
      let myRowsData = all ? initialRows : rows;
      for (let row of myRowsData) {
        let newRow = {};
        for (let field of exportableColumns) {
          if (row.values[field.id]) {
            newRow[field.Header] = row.values[field.id];
          } else {
            newRow[field.Header] = "";
            // console.log("Vaue not there");
          }
        }
        exportableRowsData.push(newRow);
      }

      // Getting fileName
      const fileName = getExportFileName({ fileType, all });

      // Get `FileBlob` to download
      let fileBlob = getExportFileBlob({
        columns: exportableColumns,
        data: exportableRows,
        records: exportableRowsData,
        fileName,
        fileType,
      });

      // Trigger download in browser
      if (fileBlob) {
        downloadFileViaBlob(fileBlob, fileName, fileType);
      }
    },
    [getExportFileBlob, getExportFileName, initialRows, rows, allColumns]
  );

  Object.assign(instance, {
    exportData,
  });
}

function downloadFileViaBlob(fileBlob, fileName, type) {
  if (fileBlob) {
    // const dataUrl = URL.createObjectURL(fileBlob);
    // const link = document.createElement("a");
    // link.download = `${fileName}.${type}`;
    // link.href = dataUrl;
    // link.click();
  }
}
