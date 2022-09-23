import React from "react";
import useDownload from "../../hooks/useDownload";
import http from "api-services/http";
import DataExportContext from "./DataExportContext";
const DataExportProvider = ({ children }) => {
  const [downloaded, setDownloaded] = React.useState(0);
  const download = useDownload();
  const downloadReport = async ({ data, title }) => {
    try {
      const response = await http.post(
        `/api/v1/auth/dashboard/exportData`,
        data,
        {
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percentOfDownload = Math.floor((loaded * 100) / total);
            setDownloaded(percentOfDownload);
          },
        }
      );
      var blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
      });
      download(
        blob,
        `${title?.replace(
          /\s/,
          ""
        )}-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}-report.xls`
      );
    } catch (error) {}
  };

  React.useEffect(() => {
    if (downloaded === 100) setTimeout(() => setDownloaded(0), 3800);
  }, [downloaded]);

  return (
    <DataExportContext.Provider
      value={{ donwloaded: downloaded, downloadReport }}>
      {children}
    </DataExportContext.Provider>
  );
};

export default DataExportProvider;
