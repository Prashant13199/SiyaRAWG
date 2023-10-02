import React from "react";
import Pagination from '@mui/material/Pagination';

export default function CustomPagination({ setPage, numOfPages = 10 }) {

  const handlePageChange = (page) => {
    setPage(page);
    window.scroll(0, 0);
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
          color="info"
          hideNextButton
          hidePrevButton
        />
      </div>
      <br />
    </>
  )
}
