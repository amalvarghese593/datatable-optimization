import { NavLink } from "react-router-dom";

const useRequirementColumns = () => {
  const columns = [
    {
      Header: "Company Name",

      accessor: "customerId.name",

      breakpoint: "xs sm md",
    },

    {
      Header: "Job ID",

      accessor: "job_id",

      sortable: false,

      searchable: true,

      breakpoint: "",
    },

    {
      Header: "Job Title",

      accessor: "job_title",

      sortable: true,

      searchable: true,

      breakpoint: "xs sm ",

      Cell: ({ row: { original: job } }) => {
        return (
          <NavLink to={"/job-details"}>
            <span className="text-capitalize">{job.job_title}</span>
          </NavLink>
        );
      },
    },

    // {

    //   display: isCustomer(auth),

    //   Header: "Hiring Manager",

    //   accessor: "createdBy.name",

    //   sortable: true,

    //   searchable: true,

    //   breakpoint: "xs xsm sm md xl lg xlg xxlg",

    // },

    {
      Header: "Requirement By",

      accessor: "createdBy.name",

      breakpoint: "xs sm md lg xlg",
    },

    {
      Header: "Job Type",

      accessor: "job_type",

      sortable: false,

      searchable: true,

      breakpoint: "xlg lg sm md xs",
    },

    {
      Header: "Skills",

      accessor: "skills",

      sortable: false,

      searchable: true,

      breakpoint: "xs sm md",
    },

    {
      // display: isCustomer(auth),

      Header: "Submissions",

      accessor: "submissionCount",

      breakpoint: "xs",
    },

    {
      Header: "Closing Date",

      accessor: "closing_date",

      sortable: true,

      searchable: true,

      breakpoint: "xs sm md lg xlg",
    },

    {
      Header: "Created on",

      accessor: "createdAt",

      sortable: true,

      searchable: true,

      breakpoint: "xs sm md lg xlg ",
    },

    {
      Header: "Requirement Type",

      accessor: "requirement_type",

      sortable: true,

      searchable: true,

      breakpoint: "xs sm md lg xlg",
    },

    {
      Header: "Locations",

      accessor: "locations",

      sortable: false,

      searchable: true,

      breakpoint: "xs sm md lg xlg",

      Cell: ({ value }) =>
        value?.map((loc, idx) => {
          return (
            <span className="chip me-2 mb-2" key={idx}>
              {loc}
            </span>
          );
        }),
    },

    {
      Header: "End Client",

      accessor: "referral_fee",

      sortable: true,

      searchable: true,

      breakpoint: "xs sm md lg xlg",
    },

    {
      Header: "Job Status",

      accessor: "status.isActive",

      sortable: false,

      searchable: true,

      breakpoint: `xs sm`,
    },

    {
      // display: isHm(auth),

      Header: "Set Status",

      accessor: "setsatus",

      breakpoint: "xs sm md lg xlg",
    },

    {
      Header: "Edit",

      accessor: "editjob",

      sortable: false,

      searchable: false,

      breakpoint: "",
    },
  ];

  return { columns };
};

export default useRequirementColumns;
