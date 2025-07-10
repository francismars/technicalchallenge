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
  offline: boolean;
  searchTerm: string;
  orderBy: 'first' | 'last' | 'email';
  orderDirection: 'asc' | 'desc';
  setOrderBy: (field: 'first' | 'last' | 'email') => void;
  setOrderDirection: (dir: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;
  setOffline: (offline: boolean) => void;
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

function orderUsers(users: User[], orderBy: 'first' | 'last' | 'email', orderDirection: 'asc' | 'desc') {
  return [...users].sort((a, b) => {
    const cmp = a[orderBy].localeCompare(b[orderBy]);
    return orderDirection === 'asc' ? cmp : -cmp;
  });
}

let isFetchingUsers = false;

export const useUserStore = create<UserStore>((set, get) => {
  // Load offline state from localStorage if present
  let initialOffline = false;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("offline");
    if (stored === "true") initialOffline = true;
  }
  return {
    users: [],
    paginatedUsers: [],
    totalPages: 1,
    loading: false,
    error: "",
    page: 1,
    favorites: {},
    showOnlyFavorites: false,
    offline: initialOffline,
    searchTerm: "",
    orderBy: 'first',
    orderDirection: 'asc',
    setOrderBy: (field) => {
      set({ orderBy: field, page: 1 });
      const { users, searchTerm, orderDirection } = get();
      let filtered = users;
      if (searchTerm) {
        filtered = users.filter(u =>
          u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const { orderBy } = get();
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, 1);
      set({ paginatedUsers, totalPages });
    },
    setOrderDirection: (dir) => {
      set({ orderDirection: dir, page: 1 });
      const { users, searchTerm, orderBy } = get();
      let filtered = users;
      if (searchTerm) {
        filtered = users.filter(u =>
          u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const { orderDirection } = get();
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, 1);
      set({ paginatedUsers, totalPages });
    },
    setSearchTerm: (term) => {
      set({ searchTerm: term, page: 1 });
      const { users, orderBy, orderDirection } = get();
      const filtered = users.filter(u =>
        u.first.toLowerCase().includes(term.toLowerCase()) ||
        u.last.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase())
      );
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, 1);
      set({ paginatedUsers, totalPages });
    },
    setOffline: (offline) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("offline", offline ? "true" : "false");
      }
      set({ offline });
    },
    setShowOnlyFavorites: async (show) => {
      set({ showOnlyFavorites: show, loading: true, error: "" });
      let users;
      if (show) {
        users = await db.users.filter(u => u.favorite === true).toArray();
      } else {
        users = await db.users.toArray();
      }
      const { searchTerm, orderBy, orderDirection } = get();
      let filtered = users;
      if (searchTerm) {
        filtered = users.filter(u =>
          u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, 1);
      set({ users, paginatedUsers, totalPages, page: 1, loading: false });
    },
    setPage: (page) => {
      const { users, searchTerm, orderBy, orderDirection } = get();
      let filtered = users;
      if (searchTerm) {
        filtered = users.filter(u =>
          u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, page);
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
      if (isFetchingUsers) return;
      isFetchingUsers = true;
      set({ loading: true, error: "" });
      let allUsers = await db.users.toArray();
      console.log('Users in DB before fetch:', allUsers.length, allUsers.map(u => u.uuid));
      const { offline, searchTerm, orderBy, orderDirection } = get();
      if (allUsers.length === 0) {
        try {
          if (offline) throw new Error("Simulated offline");
          console.log('Fetching from API...');
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
          console.log('Users in DB after fetch:', allUsers.length, allUsers.map(u => u.uuid));
        } catch {
          if (allUsers.length === 0) {
            set({ users: [], paginatedUsers: [], totalPages: 1, loading: false, error: "You are offline. No cached data available." });
            isFetchingUsers = false;
            return;
          } else {
            set({ error: "You are offline. Showing cached data." });
          }
        }
      }
      let filtered = allUsers;
      if (searchTerm) {
        filtered = allUsers.filter(u =>
          u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      const ordered = orderUsers(filtered, orderBy, orderDirection);
      const { paginatedUsers, totalPages } = paginate(ordered, 1);
      set({ users: allUsers, paginatedUsers, totalPages, page: 1, loading: false });
      // Load favorites from IndexedDB
      const favArr = allUsers.filter(u => u.favorite === true);
      const favs: Record<string, boolean> = {};
      favArr.forEach(u => { favs[u.uuid] = true; });
      set({ favorites: favs });
      isFetchingUsers = false;
    },
    toggleFavorite: async (user) => {
      const { favorites, showOnlyFavorites, setShowOnlyFavorites, page, users, searchTerm, orderBy, orderDirection } = get();
      const isFav = !!favorites[user.uuid];
      await db.users.update(user.uuid, { favorite: !isFav });
      set({ favorites: { ...favorites, [user.uuid]: !isFav } });
      if (showOnlyFavorites) {
        await setShowOnlyFavorites(true);
      } else {
        // Always re-sort and re-paginate after favorite toggle
        let filtered = users;
        if (searchTerm) {
          filtered = users.filter(u =>
            u.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        const ordered = orderUsers(filtered, orderBy, orderDirection);
        const { paginatedUsers, totalPages } = paginate(ordered, page);
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
  };
}); 