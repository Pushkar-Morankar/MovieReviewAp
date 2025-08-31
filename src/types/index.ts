/**
 * Represents a single Genre object from the backend.
 */
export interface Genre {
  id: number;
  value: string;
  label: string;
}

/**
 * Represents the structure of a User object.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

/**
 * Represents the JWT token structure from the backend.
 */
export interface Tokens {
  refresh: string;
  access: string;
}

/**
 * Represents the structure of a Movie object.
 * UPDATED for Many-to-Many genres.
 */
export interface Movie {
  id: number;
  title: string;
  description: string
  genres: Genre[];
  release_date: string;
  duration: number;
  poster: string;
  director: string;
  cast: string;
  reviews?: Review[];
  average_rating?: number;
  created_by: number; 
  user_review?: Review | null;
}

/**
 * Represents a single movie review.
 */
export interface Review {
  id: number;
  user: number; 
  rating: number; 
  comment?: string;
  created_at: string;
  user_name?: string; 
}

/**
 * Represents a user's favorite movie entry.
 */
export interface Favorite {
  id: number;
  user: number;
  movie: number;
}