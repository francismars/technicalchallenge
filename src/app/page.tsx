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
  } = useUserStore();

  // Load users on mount
  React.useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <section className="w-full max-w-5xl bg-white/80 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center tracking-tight mb-2">User List</h1>
        <div className="flex flex-wrap gap-4 justify-center mb-2">
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
