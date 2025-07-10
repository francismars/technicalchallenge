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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">User List</h1>
        <div className="flex gap-2 justify-center mb-2">
          <button
            className={
              "px-3 py-1 rounded " +
              (showOnlyFavorites
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-yellow-100")
            }
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? "Show All" : "Show Favorites"}
          </button>
          <button
            className="px-3 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300"
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
          <ul className="space-y-2">
            {paginatedUsers.map(user => (
              <li key={user.uuid} className="flex items-center gap-3 border rounded px-2 py-1 bg-gray-100">
                <img src={user.thumbnail} alt="avatar" className="rounded-full w-8 h-8" />
                <div className="flex-1">
                  <div className="font-semibold">{user.first} {user.last}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <button
                  className={
                    "ml-2 text-xl " + (favorites[user.uuid] ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400")
                  }
                  title={favorites[user.uuid] ? "Unfavorite" : "Mark as favorite"}
                  onClick={() => toggleFavorite(user)}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={prevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="self-center">{page} / {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={nextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
