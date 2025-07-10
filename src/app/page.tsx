"use client";
import React from "react";
import { useUserStore } from "@/store/userStore";
import FavoritesControls from "@/components/FavoritesControls";
import SearchSortControls from "@/components/SearchSortControls";
import UserCard from "@/components/UserCard";
import Pagination from "@/components/Pagination";

export default function Home() {
  const {
    paginatedUsers,
    totalPages,
    loading,
    error,
    page,
    setPage,
    nextPage,
    prevPage,
    toggleFavorite,
    favorites,
    showOnlyFavorites,
    setShowOnlyFavorites,
    clearAllFavorites,
    loadUsers,
    offline,
    setOffline,
    searchTerm,
    setSearchTerm,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
  } = useUserStore();

  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsOnline(typeof window !== "undefined" ? window.navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load users on mount (only once)
  const hasLoaded = React.useRef(false);
  React.useEffect(() => {
    if (!hasLoaded.current) {
      loadUsers();
      hasLoaded.current = true;
    }
    // eslint-disable-next-line
  }, []);

  // When offline toggle changes (but not on initial mount), reload users to simulate fallback
  React.useEffect(() => {
    if (hasLoaded.current) {
      loadUsers();
    }
    // eslint-disable-next-line
  }, [offline]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 p-4">
      <section className="w-full max-w-5xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-center tracking-tight dark:text-white">User List</h1>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={isOnline && !offline ? '#22c55e' : '#f87171'}
              className="w-5 h-5"
              aria-label={isOnline && !offline ? 'Online' : 'Offline'}
            >
              <path
                fillRule="evenodd"
                d="M2.166 7.924a.75.75 0 0 1 1.06.06A9.25 9.25 0 0 1 10 5.25c2.57 0 4.91.99 6.774 2.734a.75.75 0 1 1 1.02-1.1A10.75 10.75 0 0 0 10 3.75c-2.97 0-5.67 1.18-7.794 3.134a.75.75 0 0 1 .06 1.04zm2.12 2.12a.75.75 0 0 1 1.06.06A6.25 6.25 0 0 1 10 8.25c1.7 0 3.25.66 4.454 1.854a.75.75 0 1 1 1.02-1.1A7.75 7.75 0 0 0 10 6.75c-2.14 0-4.09.85-5.474 2.254a.75.75 0 0 1 .06 1.04zm2.12 2.12a.75.75 0 0 1 1.06.06c.47-.47 1.1-.73 1.77-.73.67 0 1.3.26 1.77.73a.75.75 0 1 1 1.02-1.1A4.25 4.25 0 0 0 10 10.25c-1.13 0-2.16.44-2.954 1.134a.75.75 0 0 1 .06 1.04zm2.12 2.12a.75.75 0 0 1 1.06.06.75.75 0 0 1-1.06 1.06.75.75 0 0 1 0-1.06z"
                clipRule="evenodd"
              />
            </svg>
            <button
              className={
                "px-4 py-1 rounded font-medium shadow transition " +
                (offline
                  ? "bg-orange-400 text-white hover:bg-orange-500 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700")
              }
              onClick={() => setOffline(!offline)}
              title={offline ? "Go Online" : "Go Offline"}
            >
              {offline ? "Go Online" : "Go Offline"}
            </button>
          </div>
        </div>
        <FavoritesControls
          showOnlyFavorites={showOnlyFavorites}
          setShowOnlyFavorites={setShowOnlyFavorites}
          clearAllFavorites={clearAllFavorites}
          favorites={favorites}
        />
        <SearchSortControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}
        />
        {offline && (
          <div className="text-center text-orange-500 text-sm font-semibold">Offline mode enabled (API requests will fail)</div>
        )}
        {error && <div className="text-center text-yellow-600 text-sm">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center text-gray-400">No users to display.</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-stretch">
            {paginatedUsers.map(user => (
              <UserCard
                key={user.uuid}
                user={user}
                isFavorite={!!favorites[user.uuid]}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </section>
    </main>
  );
}
