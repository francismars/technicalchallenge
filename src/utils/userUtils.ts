export const PAGE_SIZE = 3;

import { User } from "@/db";

export function paginate(users: User[], page: number) {
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { paginatedUsers, totalPages };
}

export function orderUsers(users: User[], orderBy: 'first' | 'last' | 'email', orderDirection: 'asc' | 'desc') {
  return [...users].sort((a, b) => {
    const cmp = a[orderBy].localeCompare(b[orderBy]);
    return orderDirection === 'asc' ? cmp : -cmp;
  });
} 