import React from "react";
import { User } from "@/db";
import Image from "next/image";

export interface UserCardProps {
  user: User;
  isFavorite: boolean;
  toggleFavorite: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isFavorite, toggleFavorite }) => (
  <div className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-0 overflow-hidden h-full min-w-0 max-w-[180px] w-[90%] sm:w-[180px] mx-auto transition-transform hover:scale-105">
    <div className="w-full aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-800" style={{ maxWidth: 160, maxHeight: 160 }}>
      <Image
        src={user.thumbnail}
        alt="avatar"
        width={160}
        height={160}
        className="object-cover w-full h-full rounded-xl ring-2 ring-blue-200 dark:ring-blue-900"
      />
    </div>
    <div className="flex flex-col items-center p-4 w-full">
      <div className="font-semibold text-base text-gray-900 dark:text-gray-100 mb-1 truncate w-full text-center tracking-tight">{user.first} {user.last}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 break-all w-full text-center">{user.email}</div>
      <button
        className={
          "text-xl transition " + (isFavorite ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400 dark:text-gray-600 dark:hover:text-yellow-400")
        }
        title={isFavorite ? "Unfavorite" : "Mark as favorite"}
        onClick={() => toggleFavorite(user)}
      >
        ★
      </button>
    </div>
  </div>
);

export default UserCard; 