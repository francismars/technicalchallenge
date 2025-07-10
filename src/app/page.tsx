"use client";
import React from "react";
import { useUserStore } from "@/store/userStore";
import { db, User as DBUser } from "@/db";

type User = DBUser;

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
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <section className="w-full max-w-5xl bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-center tracking-tight">User List</h1>
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
                (offline ? "bg-orange-400 text-white hover:bg-orange-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300")
              }
              onClick={() => setOffline(!offline)}
              title={offline ? "Go Online" : "Go Offline"}
            >
              {offline ? "Go Online" : "Go Offline"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-700 shadow w-full max-w-xs mb-2"
          />
          <button
            className={
              "px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition font-medium shadow " +
              (showOnlyFavorites ? "ring-2 ring-yellow-400" : "")
            }
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? "Show All" : "Show Favorites"}
          </button>
          <button
            className="px-4 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300 transition font-medium shadow"
            onClick={clearAllFavorites}
            disabled={Object.keys(favorites).length === 0}
          >
            Clear Favorites
          </button>
        </div>
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
              <div key={user.uuid} className="flex flex-col items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-0 overflow-hidden h-full min-w-0 max-w-[180px] w-[90%] sm:w-[180px] mx-auto transition-transform hover:scale-105">
                <div className="w-full aspect-square flex items-center justify-center bg-gray-100" style={{ maxWidth: 160, maxHeight: 160 }}>
                  <img src={user.thumbnail} alt="avatar" className="object-cover w-full h-full rounded-xl ring-2 ring-blue-200" />
                </div>
                <div className="flex flex-col items-center p-4 w-full">
                  <div className="font-semibold text-base text-gray-900 mb-1 truncate w-full text-center tracking-tight">{user.first} {user.last}</div>
                  <div className="text-xs text-gray-500 mb-2 break-all w-full text-center">{user.email}</div>
                  <button
                    className={
                      "text-xl transition " + (favorites[user.uuid] ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400")
                    }
                    title={favorites[user.uuid] ? "Unfavorite" : "Mark as favorite"}
                    onClick={() => toggleFavorite(user)}
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4 gap-2">
          <button
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50 font-medium shadow"
            onClick={prevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-base font-semibold text-gray-700">{page} / {totalPages}</span>
          <button
            className="px-4 py-1 rounded bg-gray-200 font-medium shadow"
            onClick={nextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
