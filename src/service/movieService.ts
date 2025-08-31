/**
 * @fileoverview Movie service for movie and review management operations
 * 
 * This file provides API functions for movie-related operations:
 * - Movie CRUD operations (Create, Read, Update, Delete)
 * - Review management (Create, Update, Delete)
 * - Paginated movie listing
 * - Genre information
 * 
 * All functions use the configured API client with proper error handling
 * and return typed responses for type safety.
 */

import { api } from './api';
import { Movie, Review } from '../types';

/**
 * Response structure for paginated movie listings
 * 
 * @interface PaginatedMoviesResponse
 * @property {number} count - Total number of movies available
 * @property {string|null} next - URL for the next page of results
 * @property {string|null} previous - URL for the previous page of results
 * @property {Movie[]} results - Array of movies for the current page
 */
export interface PaginatedMoviesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[];
}

/**
 * Genre information structure
 * 
 * @interface Genre
 * @property {number} id - Unique identifier for the genre
 * @property {string} value - Genre value used in API calls
 * @property {string} label - Human-readable genre name
 */
export interface Genre {
  id: number;
  value: string;
  label: string;
}

/**
 * Retrieves a paginated list of movies
 * 
 * @param {number} page - Page number for pagination (defaults to 1)
 * @returns {Promise<PaginatedMoviesResponse>} Paginated movie results
 * @throws {Error} When movie retrieval fails
 */
export const getMovies = async (page: number = 1): Promise<PaginatedMoviesResponse> => {
  const response = await api.get(`/movies/?page=${page}`);
  return response.data;
};

/**
 * Retrieves detailed information for a specific movie
 * 
 * @param {number} id - Unique identifier of the movie
 * @returns {Promise<Movie>} Complete movie information
 * @throws {Error} When movie retrieval fails or movie doesn't exist
 */
export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movies/${id}/`);
  return response.data;
};

/**
 * Creates a new movie in the system
 * 
 * @param {any} movieData - Movie information to create
 * @returns {Promise<Movie>} Created movie with assigned ID
 * @throws {Error} When movie creation fails
 */
export const createMovie = async (movieData: any): Promise<Movie> => {
  const response = await api.post('/movies/', movieData);
  return response.data;
};

/**
 * Updates an existing movie's information
 * 
 * @param {number} movieId - Unique identifier of the movie to update
 * @param {any} movieData - Updated movie information
 * @returns {Promise<Movie>} Updated movie data
 * @throws {Error} When movie update fails
 */
export const updateMovie = async (movieId: number, movieData: any): Promise<Movie> => {
  const response = await api.put(`/movies/${movieId}/`, movieData);
  return response.data;
};

/**
 * Deletes a movie from the system
 * 
 * @param {number} movieId - Unique identifier of the movie to delete
 * @returns {Promise<void>} Resolves when movie is deleted successfully
 * @throws {Error} When movie deletion fails
 */
export const deleteMovie = async (movieId: number): Promise<void> => {
  await api.delete(`/movies/${movieId}/`);
};

/**
 * Creates a new review for a specific movie
 * 
 * @param {number} movieId - Unique identifier of the movie to review
 * @param {Object} reviewData - Review information
 * @param {number} reviewData.rating - Rating value (1-5)
 * @param {string} [reviewData.comment] - Optional review comment
 * @returns {Promise<Review>} Created review with assigned ID
 * @throws {Error} When review creation fails
 */
export const createReview = async (
  movieId: number,
  reviewData: { rating: number; comment?: string }
): Promise<Review> => {
  const response = await api.post(`/movies/${movieId}/reviews/`, reviewData);
  return response.data;
};

/**
 * Updates an existing review
 * 
 * @param {number} reviewId - Unique identifier of the review to update
 * @param {Object} reviewData - Updated review information
 * @param {number} reviewData.rating - New rating value (1-5)
 * @param {string} [reviewData.comment] - New comment text
 * @returns {Promise<Review>} Updated review data
 * @throws {Error} When review update fails
 */
export const updateReview = async (
  reviewId: number,
  reviewData: { rating: number; comment?: string }
): Promise<Review> => {
  const response = await api.put(`/movies/reviews/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Deletes a review from the system
 * 
 * @param {number} reviewId - Unique identifier of the review to delete
 * @returns {Promise<void>} Resolves when review is deleted successfully
 * @throws {Error} When review deletion fails
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/movies/reviews/${reviewId}/`);
};