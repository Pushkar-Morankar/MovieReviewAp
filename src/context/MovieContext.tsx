/**
 * @fileoverview Movie Context for managing movie-related state and operations
 * 
 * This file provides a React context for managing movie data including:
 * - Movie listing with pagination
 * - Individual movie details
 * - Review management (CRUD operations)
 * - Movie updates and deletion
 * - Loading states and error handling
 * 
 * Uses constate for optimized context creation and movieService for API operations.
 */

import React, { useState } from 'react';
import constate from 'constate';
import * as movieService from '../service/movieService';
import { Movie } from '../types';

/**
 * Custom hook for managing movie state and operations
 * 
 * @returns {Object} Movie context with state and methods
 * @returns {Movie[]} returns.movies - List of movies for display
 * @returns {Movie|null} returns.movie - Currently selected movie details
 * @returns {boolean} returns.isListLoading - Loading state for movie list operations
 * @returns {boolean} returns.isDetailLoading - Loading state for movie detail operations
 * @returns {string|null} returns.error - Current error message or null
 * @returns {boolean} returns.isFetchingMore - Loading state for pagination
 * @returns {number} returns.currentPage - Current page number for pagination
 * @returns {boolean} returns.hasNextPage - Whether more pages are available
 * @returns {Function} returns.fetchMovies - Function to fetch initial movie list
 * @returns {Function} returns.fetchMoreMovies - Function to fetch next page of movies
 * @returns {Function} returns.fetchMovieById - Function to fetch specific movie details
 * @returns {Function} returns.addReview - Function to add a new review
 * @returns {Function} returns.updateMovie - Function to update movie information
 * @returns {Function} returns.deleteMovie - Function to delete a movie
 * @returns {Function} returns.deleteReview - Function to delete a review
 * @returns {Function} returns.updateReview - Function to update a review
 */
function useMovieHook() {
  // State for the main list of movies
  const [movies, setMovies] = useState<Movie[]>([]);
  // State for a single, detailed movie view
  const [movie, setMovie] = useState<Movie | null>(null);

  // --- SEPARATE LOADING STATES ---
  const [isListLoading, setIsListLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // A general error state
  const [error, setError] = useState<string | null>(null);

  // --- PAGINATION STATE ---
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  /**
   * Fetches the initial list of movies from the API
   * Resets pagination state and handles loading/error states
   * 
   * @returns {Promise<void>} Resolves when movies are fetched
   */
  const fetchMovies = async () => {
    if (isListLoading) return;
    setIsListLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovies(1);
      setMovies(data.results);
      setHasNextPage(data.next !== null);
      setCurrentPage(2); 
    } catch (err: any) {
      setError(err.message || 'Failed to fetch movies');
    } finally {
      setIsListLoading(false);
    }
  };

  /**
   * Fetches additional movies for pagination
   * Appends new movies to existing list and updates pagination state
   * 
   * @returns {Promise<void>} Resolves when additional movies are fetched
   */
  const fetchMoreMovies = async () => {
    if (isFetchingMore || !hasNextPage) return;
    setIsFetchingMore(true);
    try {
      const data = await movieService.getMovies(currentPage);
      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setHasNextPage(data.next !== null);
      setCurrentPage(prevPage => prevPage + 1);
    } catch (err: any) {
      console.error("Failed to fetch more movies:", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  /**
   * Fetches detailed information for a specific movie by ID
   * 
   * @param {number} id - The unique identifier of the movie
   * @returns {Promise<void>} Resolves when movie details are fetched
   */
  const fetchMovieById = async (id: number) => {
    setIsDetailLoading(true);
    setError(null);
    try {
      const data = await movieService.getMovieById(id);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch movie details');
    } finally {
      setIsDetailLoading(false);
    }
  };

  /**
   * Adds a new review to a specific movie
   * 
   * @param {number} movieId - The ID of the movie to review
   * @param {Object} reviewData - Review data containing rating and comment
   * @param {number} reviewData.rating - Rating value (1-5)
   * @param {string} reviewData.comment - Review comment text
   * @returns {Promise<void>} Resolves when review is added successfully
   * @throws {Error} When review creation fails
   */
  const addReview = async (movieId: number, reviewData: { rating: number; comment: string }) => {
    try {
      await movieService.createReview(movieId, reviewData);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Add Review Failed", err.response?.data || err.message);
      throw err; 
    }
  };

  /**
   * Updates an existing review
   * 
   * @param {number} reviewId - The ID of the review to update
   * @param {Object} reviewData - Updated review data
   * @param {number} reviewData.rating - New rating value
   * @param {string} reviewData.comment - New comment text
   * @param {number} movieId - The ID of the movie the review belongs to
   * @returns {Promise<void>} Resolves when review is updated successfully
   * @throws {Error} When review update fails
   */
  const updateReview = async (reviewId: number, reviewData: { rating: number; comment: string }, movieId: number) => {
    try {
      await movieService.updateReview(reviewId, reviewData);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Update Review Failed", err.response?.data || err.message);
      throw err;
    }
  };

  /**
   * Deletes a review from a movie
   * 
   * @param {number} reviewId - The ID of the review to delete
   * @param {number} movieId - The ID of the movie the review belongs to
   * @returns {Promise<void>} Resolves when review is deleted successfully
   * @throws {Error} When review deletion fails
   */
  const deleteReview = async (reviewId: number, movieId: number) => {
    try {
      await movieService.deleteReview(reviewId);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Delete Review Failed", err.response?.data || err.message);
      throw err;
    }
  };

  /**
   * Updates movie information
   * 
   * @param {number} movieId - The ID of the movie to update
   * @param {any} movieData - Updated movie data
   * @returns {Promise<void>} Resolves when movie is updated successfully
   * @throws {Error} When movie update fails
   */
  const updateMovie = async (movieId: number, movieData: any) => {
    try {
      await movieService.updateMovie(movieId, movieData);
      await fetchMovieById(movieId);
      await fetchMovies();
    } catch (err: any) {
      console.error("Context: Update Movie Failed", err.response?.data || err.message);
      throw err;
    }
  };

  /**
   * Deletes a movie from the system
   * 
   * @param {number} movieId - The ID of the movie to delete
   * @returns {Promise<void>} Resolves when movie is deleted successfully
   * @throws {Error} When movie deletion fails
   */
  const deleteMovie = async (movieId: number) => {
    try {
      await movieService.deleteMovie(movieId);
      await fetchMovies();
    } catch (err: any) {
      console.error("Context: Delete Movie Failed", err.response?.data || err.message);
      throw err;
    }
  };

  return {
    movies,
    movie,
    isListLoading,
    isDetailLoading,
    error,
    isFetchingMore,
    currentPage,
    hasNextPage,
    fetchMovies,
    fetchMoreMovies,
    fetchMovieById,
    addReview,
    updateMovie,
    deleteMovie,
    deleteReview,
    updateReview,
  };
}

/**
 * Movie context provider and hook
 * 
 * Provides movie state and operations to the component tree
 * Uses constate for optimized context creation
 */
export const [MovieProvider, useMovieContext] = constate(useMovieHook);