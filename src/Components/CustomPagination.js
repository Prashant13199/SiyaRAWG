import React from "react";
import Pagination from '@mui/material/Pagination';

export default function CustomPagination({ setPage, numOfPages = 10 }) {

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <br />
      <div
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <Pagination
          onChange={(e) => handlePageChange(e.target.textContent)}
          count={numOfPages}
          color="success"
          hideNextButton
          hidePrevButton
        />
      </div>
      <br />
    </>
  )
}
