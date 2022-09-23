import { createContext } from "react";

const DataExportContext = createContext({
  downloadReport: () => {},
  downloaded: 0,
});
export default DataExportContext;
