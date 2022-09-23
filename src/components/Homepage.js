import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DataTable from "./datatable/DataTable";
import useRequirementColumns from "../hooks/useRequirementColumns";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMjYxMDkyZjEzNGQ2MWUzYjg4Yzk1MCIsImlhdCI6MTY2Mzg0MDQ0NSwiZXhwIjoxNjY2NDMyNDQ1fQ.0ygGr_3o0jusnRWA0_lmExgsvaW7ct5_yjqTvHys8L4";

export const Homepage = () => {
  const [data, setData] = useState([]);
  const { columns } = useRequirementColumns();
  const [pager, setPager] = useState({});

  const fetchData = useCallback(async ({ pageSize, pageIndex, search }) => {
    // dispatch(getRequirements(pageIndex || 1, search, pageSize || 20));
    if (typeof pageIndex !== "string" && typeof pageIndex !== "number")
      pageIndex = 1;

    let createdUrl = search
      ? `/api/v1/auth/requirements?page=${pageIndex}&search=${search}&limit=${pageSize}`
      : `/api/v1/auth/requirements?page=${pageIndex}&limit=${pageSize}`;
    try {
      const res = await axios({
        method: "get",
        url: `https://nextmov.webpipl.com${createdUrl}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data);
      setData(res.data.result.docs);
      delete res.data.result.docs;
      setPager(res.data.result);
    } catch (err) {
      console.log({ err });
    }
    /*eslint-disable react-hooks/exhaustive-deps*/
  }, []);
  // useEffect(() => {
  //   console.log("page:", pager);
  // }, [pager]);
  return (
    <div>
      <h1>table</h1>
      <DataTable
        // exportable={!isFreelancer(auth)}
        ssp
        // cta={addButton}
        columns={columns}
        // loading={isLoading}
        fetchData={fetchData}
        id="otherReqUsersTable"
        title="Job Requisitions"
        data={data}
        // data={requirements?.all || []}
        paginationData={pager}
        // hidden={hiddenColumns}
      />
    </div>
  );
};
