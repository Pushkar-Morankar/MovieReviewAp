/**
 * @fileoverview Movie genre definitions and data
 * 
 * This file provides a comprehensive list of movie genres used throughout the app:
 * - Genre interface definition with ID, value, and label
 * - Complete list of available genres for movie categorization
 * - Consistent genre mapping between backend values and display labels
 * 
 * Genres are used for movie filtering, categorization, and form validation.
 */

export interface Genre {
  id: number;
  value: string;
  label: string;
}

/**
 * Complete list of available movie genres
 * 
 * Each genre includes:
 * - id: Unique numeric identifier
 * - value: Backend API value (uppercase, underscore-separated)
 * - label: Human-readable display name
 */
export const ALL_GENRES: Genre[] = [
  { id: 1, value: 'ACTION', label: 'Action' },
  { id: 2, value: 'COMEDY', label: 'Comedy' },
  { id: 3, value: 'DRAMA', label: 'Drama' },
  { id: 4, value: 'HORROR', label: 'Horror' },
  { id: 5, value: 'ROMANCE', label: 'Romance' },
  { id: 6, value: 'SCI_FI', label: 'Science Fiction' },
  { id: 7, value: 'THRILLER', label: 'Thriller' },
  { id: 8, value: 'DOCUMENTARY', label: 'Documentary' },
  { id: 9, value: 'ANIMATION', label: 'Animation' },
  { id: 10, value: 'FANTASY', label: 'Fantasy' },
  { id: 11, value: 'MYSTERY', label: 'Mystery' },
  { id: 12, value: 'CRIME', label: 'Crime' },
  { id: 13, value: 'ADVENTURE', label: 'Adventure' },
  { id: 14, value: 'FAMILY', label: 'Family' },
  { id: 15, value: 'MUSICAL', label: 'Musical' },
  { id: 16, value: 'WAR', label: 'War' },
  { id: 17, value: 'WESTERN', label: 'Western' },
  { id: 18, value: 'BIOGRAPHY', label: 'Biography' },
  { id: 19, value: 'HISTORY', label: 'History' },
  { id: 20, value: 'SPORT', label: 'Sport' },
];