import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import styles from './styles.module.css';



const SearchTable = ({ searchQuery }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default is 5

  const maxPageSize = 10; // Maximum cities per page

  // Simulated API call to fetch paginated places data
  useEffect(() => {
    if (searchQuery === "") {
      return; // Skip fetching if search query is empty
    }

    setLoading(true);
    setTimeout(() => {
      // Example response, should come from API
      const allResults = [
        { placeName: "Paris", country: "France", countryID: "FR" },
        { placeName: "Tokyo", country: "Japan", countryID: "JP" },
        { placeName: "New York", country: "United States", countryID: "US" },
        { placeName: "Berlin", country: "Germany", countryID: "DE" },
        { placeName: "Sydney", country: "Australia", countryID: "AU" },
        { placeName: "Toronto", country: "Canada", countryID: "CA" },
        { placeName: "Rio de Janeiro", country: "Brazil", countryID: "BR" },
        { placeName: "Moscow", country: "Russia", countryID: "RU" },
        { placeName: "Rome", country: "Italy", countryID: "IT" },
        { placeName: "Beijing", country: "China", countryID: "CN" },
      ];

      const filteredResults = allResults.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );

      setResults(filteredResults);
      setTotalResults(allResults.length);
      setLoading(false);
    }, 2000); // Simulate a 2 second fetch time
  }, [searchQuery, currentPage, pageSize]);

  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (e) => {
    const value = Math.min(maxPageSize, Math.max(1, e.target.value)); // Enforce the limit
    setPageSize(parseInt(value));
    setCurrentPage(1); // Reset to first page after page size change
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
                <td>{result.placeName}</td>
                <td>
                  <img
                    src={`https://flagsapi.com/${result.countryID}/flat/32.png`}
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
      <div className={styles['footer-wrapper']}>
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
              min="1"
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
