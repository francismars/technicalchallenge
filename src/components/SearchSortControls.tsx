import React from "react";

interface SearchSortControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderBy: 'first' | 'last' | 'email';
  setOrderBy: (field: 'first' | 'last' | 'email') => void;
  orderDirection: 'asc' | 'desc';
  setOrderDirection: (dir: 'asc' | 'desc') => void;
}

const SearchSortControls: React.FC<SearchSortControlsProps> = ({
  searchTerm,
  setSearchTerm,
  orderBy,
  setOrderBy,
  orderDirection,
  setOrderDirection,
}) => (
  <div className="flex flex-wrap gap-4 justify-center items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-4 shadow-sm">
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full max-w-2xl">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search by name or email..."
        className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 shadow flex-1 min-w-0"
      />
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded shadow px-2 py-1 border border-gray-200 dark:border-gray-700 w-full md:w-auto">
        <label className="font-medium text-gray-700 dark:text-gray-200 mr-1">Sort:</label>
        <select
          value={orderBy}
          onChange={e => setOrderBy(e.target.value as 'first' | 'last' | 'email')}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 w-full md:w-auto"
        >
          <option value="first">First Name</option>
          <option value="last">Last Name</option>
          <option value="email">Email</option>
        </select>
        <button
          onClick={() => setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc')}
          className="flex items-center px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-100 dark:hover:bg-blue-950 transition"
          title={orderDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {orderDirection === 'asc' ? (
            <svg className="w-4 h-4 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default SearchSortControls; 