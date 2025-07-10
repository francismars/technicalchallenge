"use client";
import { useEffect, useState } from "react";
import { db, User as DBUser } from "@/db";

const PAGE_SIZE = 10;

type User = DBUser;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`https://randomuser.me/api/?page=${page}&results=${PAGE_SIZE}`)
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(async data => {
        const mapped: User[] = data.results.map((u: any) => ({
          uuid: u.login.uuid,
          first: u.name.first,
          last: u.name.last,
          email: u.email,
          thumbnail: u.picture.thumbnail,
          page,
        }));
        if (!cancelled) {
          setUsers(mapped);
          setLoading(false);
        }
        // Save to IndexedDB
        await db.users.bulkPut(mapped);
      })
      .catch(async () => {
        // On error or offline, load from IndexedDB
        const cached = await db.users.where({ page }).toArray();
        if (!cancelled) {
          setUsers(cached);
          setLoading(false);
          setError(cached.length === 0 ? "No cached data available." : "Loaded from cache.");
        }
      });
    return () => { cancelled = true; };
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">User List</h1>
        {error && <div className="text-center text-yellow-600 text-sm">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user.uuid} className="flex items-center gap-3 border rounded px-2 py-1 bg-gray-100">
                <img src={user.thumbnail} alt="avatar" className="rounded-full w-8 h-8" />
                <div>
                  <div className="font-semibold">{user.first} {user.last}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="self-center">Page {page}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
