import React from "react";

interface FavoritesControlsProps {
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (show: boolean) => void;
  clearAllFavorites: () => void;
  favorites: Record<string, boolean>;
}

const FavoritesControls: React.FC<FavoritesControlsProps> = ({
  showOnlyFavorites,
  setShowOnlyFavorites,
  clearAllFavorites,
  favorites,
}) => (
  <div className="flex flex-wrap gap-4 justify-center items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 mb-4 shadow-sm">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={showOnlyFavorites}
        onChange={e => setShowOnlyFavorites(e.target.checked)}
        className="accent-blue-500"
      />
      <span className="text-gray-700 dark:text-gray-200 font-medium">Show Favorites</span>
    </label>
    <button
      onClick={clearAllFavorites}
      className="px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition border border-red-200 dark:border-red-700 shadow-sm disabled:opacity-50"
      disabled={Object.keys(favorites).length === 0}
    >
      Clear Favorites
    </button>
  </div>
);

export default FavoritesControls; 