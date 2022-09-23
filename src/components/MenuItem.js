import React from "react";
const MenuItem = ({ isSelected, onClick, component: Component, children }) => {
  return (
    <Component onClick={onClick}>
      {({ active }) =>
        React.cloneElement(children, {
          className: `${
            active || isSelected ? "d-flex align-items-center" : " "
          } ps-1 py-2 pe-5 d-flex align-content-end fs-14`,
        })
      }
    </Component>
  );
};
export default MenuItem;
