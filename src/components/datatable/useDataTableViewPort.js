import React from "react";
class BreakPoint {
  constructor(name, width) {
    this.width = width;
    this.name = name;
  }
}
const getDeviceConfig = (parentWidth) => {
  let breakpoints = { xs: 320, sm: 480, md: 768, lg: 1020, xlg: 1200 };
  let array = [];
  for (let bpname in breakpoints) {
    array.push(new BreakPoint(bpname, breakpoints[bpname]));
  }
  array.sort((a, b) => b.width - a.width);
  let current = null;
  let hidden = [];
  let breakpoint;
  let prev = null;
  let width = parentWidth;
  let Breakpoint = BreakPoint;
  for (var i = 0, len = array.length; i < len; i++) {
    breakpoint = array[i];
    if (
      (!current && i === len - 1) ||
      (width >= breakpoint.width &&
        (prev instanceof Breakpoint ? width < prev.width : true))
    ) {
      current = breakpoint;
    }
    if (!current) hidden.push(breakpoint.name);
    prev = breakpoint;
  }

  hidden.push(current.name);
  hidden = hidden.join(" ");
  return current;
};
const useViewport = (tableId) => {
  // let dTable = document.getElementById(tableId || "table");
  const [currentBreakpoint, setBreakpoint] = React.useState("md");
  React.useEffect(() => {
    setTimeout(() => {
      setBreakpoint(
        getDeviceConfig(
          document.getElementById(tableId || "table")?.parentElement
            ?.clientWidth || window.innerWidth
        )
      );
    });
  }, [tableId]);
  React.useEffect(() => {
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
    };
    /*eslint-disable react-hooks/exhaustive-deps */
  }, []);
  const handle = () => {
    setTimeout(() => {
      setBreakpoint(
        getDeviceConfig(
          document.getElementById(tableId || "table")?.parentElement
            ?.clientWidth || window.innerWidth
        )
      );
    });
  };
  return {
    breakpoint: currentBreakpoint,
  };
};

export const isVisible = (brekpoints, currentBreakpoint) => {
  if (!brekpoints) return true;
  let parts = brekpoints.split(" ");

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === currentBreakpoint) {
      return false;
    }
  }
  return true;
};
export default useViewport;
