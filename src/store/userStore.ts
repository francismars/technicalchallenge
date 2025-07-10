import { create } from "zustand";
import { db, User } from "@/db";

const PAGE_SIZE = 3;

interface UserStore {
  users: User[];
  paginatedUsers: User[];
  totalPages: number;
  loading: boolean;
  error: string;
  page: number;
  favorites: Record<string, boolean>;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (show: boolean) => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  loadUsers: () => void;
  toggleFavorite: (user: User) => void;
  clearAllFavorites: () => void;
}

function paginate(users: User[], page: number) {
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { paginatedUsers, totalPages };
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  paginatedUsers: [],
  totalPages: 1,
  loading: false,
  error: "",
  page: 1,
  favorites: {},
  showOnlyFavorites: false,
  setShowOnlyFavorites: async (show) => {
    set({ showOnlyFavorites: show, loading: true, error: "" });
    let users;
    if (show) {
      users = await db.users.filter(u => u.favorite === true).toArray();
    } else {
      users = await db.users.toArray();
    }
    const { paginatedUsers, totalPages } = paginate(users, 1);
    set({ users, paginatedUsers, totalPages, page: 1, loading: false });
  },
  setPage: (page) => {
    const { users } = get();
    const { paginatedUsers, totalPages } = paginate(users, page);
    set({ page, paginatedUsers, totalPages });
  },
  nextPage: () => {
    const { page, totalPages, setPage } = get();
    if (page < totalPages) setPage(page + 1);
  },
  prevPage: () => {
    const { page, setPage } = get();
    if (page > 1) setPage(page - 1);
  },
  loadUsers: async () => {
    set({ loading: true, error: "" });
    let allUsers = await db.users.toArray();
    if (allUsers.length === 0) {
      try {
        const res = await fetch(`https://randomuser.me/api/?page=1&results=10`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const mapped: User[] = data.results.map((u: any) => ({
          uuid: u.login.uuid,
          first: u.name.first,
          last: u.name.last,
          email: u.email,
          thumbnail: u.picture.thumbnail,
          page: 1,
          favorite: false,
        }));
        await db.users.bulkAdd(mapped);
        allUsers = mapped;
      } catch {
        set({ users: [], paginatedUsers: [], totalPages: 1, loading: false, error: "Failed to fetch users and no local data." });
        return;
      }
    }
    const { paginatedUsers, totalPages } = paginate(allUsers, 1);
    set({ users: allUsers, paginatedUsers, totalPages, page: 1, loading: false });
    // Load favorites from IndexedDB
    const favArr = allUsers.filter(u => u.favorite === true);
    const favs: Record<string, boolean> = {};
    favArr.forEach(u => { favs[u.uuid] = true; });
    set({ favorites: favs });
  },
  toggleFavorite: async (user) => {
    const { favorites, showOnlyFavorites, setShowOnlyFavorites, page, users } = get();
    const isFav = !!favorites[user.uuid];
    await db.users.update(user.uuid, { favorite: !isFav });
    set({ favorites: { ...favorites, [user.uuid]: !isFav } });
    if (showOnlyFavorites) {
      await setShowOnlyFavorites(true);
    } else {
      const { paginatedUsers, totalPages } = paginate(users, page);
      set({ paginatedUsers, totalPages });
    }
  },
  clearAllFavorites: async () => {
    const { favorites, showOnlyFavorites, setShowOnlyFavorites, page, users } = get();
    const uuids = Object.keys(favorites);
    await Promise.all(uuids.map(uuid => db.users.update(uuid, { favorite: false })));
    set({ favorites: {} });
    if (showOnlyFavorites) {
      await setShowOnlyFavorites(true);
    } else {
      const { paginatedUsers, totalPages } = paginate(users, page);
      set({ paginatedUsers, totalPages });
    }
  },
})); 