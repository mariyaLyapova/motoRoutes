import { useState, useEffect } from 'react';
import { routeService } from '../services/routeService';
import RouteCard from '../components/routes/RouteCard';

export default function RoutesListPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: '',
    search: '',
  });

  useEffect(() => {
    fetchRoutes();
  }, [currentPage, filters]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (filters.difficulty) {
        filterParams.difficulty = filters.difficulty;
      }
      if (filters.search) {
        filterParams.search = filters.search;
      }

      const response = await routeService.getRoutes(currentPage, filterParams);

      setRoutes(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRoutes();
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading && routes.length === 0) {
    return (
      <div className="routes-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading routes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="routes-page">
      <div className="container">
        <div className="page-header">
          <h1>Motorcycle Routes</h1>
          <p>Discover amazing routes shared by our community</p>
        </div>

        <div className="filters-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              name="search"
              placeholder="Search routes..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <div className="filter-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {routes.length === 0 && !loading ? (
          <div className="empty-state">
            <p>No routes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="routes-grid">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>

            {pagination.count > 20 && (
              <div className="pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.previous}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {currentPage} of {Math.ceil(pagination.count / 20)}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.next}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
