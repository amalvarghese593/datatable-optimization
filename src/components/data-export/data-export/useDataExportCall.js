import { useContext } from "react";
import DataExportContext from "./DataExportContext";

const useDataExportCall = () => {
  return useContext(DataExportContext);
};
export default useDataExportCall;
