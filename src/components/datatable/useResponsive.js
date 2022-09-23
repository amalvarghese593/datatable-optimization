// import { useEffect } from "react";
import useViewport, { isVisible } from "./useDataTableViewPort";

export const useResponsive = (hooks) => {
  hooks.useInstance.push(useInstance);
};
useResponsive.pluginName = "useResponsive";
function useInstance(instance) {
  const { allColumns, /* expandedRows, hiddenColumns, */ state } = instance;
  const { breakpoint } = useViewport(state?.tableId || null);

  allColumns.forEach((column) => {
    if (!isVisible(column.breakpoint, breakpoint?.name)) {
      column.collapsed = true;
    }
  });
  // useEffect(() => {
  //   console.log(breakpoint);
  //   allColumns.forEach((column) => {
  //     if (!isVisible(column.breakpoint, breakpoint?.name)) {
  //       // column.toggleHidden(true);
  //       column.collapsed = true;
  //     }
  //   });
  //   /*eslint-disable react-hooks/exhaustive-deps */
  // }, [expandedRows, hiddenColumns]);
}
