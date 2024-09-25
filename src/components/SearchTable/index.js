import React, { useState, useEffect } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./styles.module.css";

const SearchTable = ({ searchQuery }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default is 5

  const maxPageSize = 10; // Maximum cities per page

  useEffect(() => {
    if (searchQuery === "") {
      return; // Skip fetching if search query is empty
    }

    setLoading(true);

    const fetchPlaces = async () => {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: { limit: pageSize, namePrefix: searchQuery },
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_API_KEY,
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const allResults = response?.data?.data || [];
        const filteredResults = allResults.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

        setResults(filteredResults);
        setTotalResults(allResults.length);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchPlaces();
  }, [searchQuery, currentPage, pageSize]);

  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (e) => {
    const inputVal = e.target.value;
    if (inputVal !== "") {
      const value = Math.min(maxPageSize, Math.max(1, e.target.value)); // Enforce the limit
      setPageSize(parseInt(value));
      setCurrentPage(1); // Reset to first page after page size change
    }
  };

  return (
    <div className={styles["table-container"]}>
      {/* Spinner while loading */}
      {loading && <ClipLoader size={50} color={"#7952b3"} loading={loading} />}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Place Name</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {searchQuery === "" ? (
            <tr>
              <td colSpan="3">Start searching</td>
            </tr>
          ) : results.length === 0 && !loading ? (
            <tr>
              <td colSpan="3">No result found</td>
            </tr>
          ) : (
            results.map((result, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>{result.city}</td>
                <td>
                  <img
                    src={`https://flagsapi.com/${result.countryCode}/flat/32.png`}
                    alt={result.country}
                    style={{ marginRight: "8px" }}
                  />
                  {result.country}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles["footer-wrapper"]}>
        {totalResults > 0 && (
          <div className={styles["pagination"]}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`${styles["pagination-button"]} ${
                  index + 1 === currentPage ? styles["active"] : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
        <div className={styles["controls"]}>
          <label>
            Cities per page:
            <input
              type="number"
              value={pageSize}
              min="0"
              max={maxPageSize}
              onChange={handlePageSizeChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
