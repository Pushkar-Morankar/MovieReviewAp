import React, { useState } from 'react';
import constate from 'constate';
import * as movieService from '../service/movieService';
import { Movie } from '../types';

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

  const addReview = async (movieId: number, reviewData: { rating: number; comment: string }) => {
    try {
      await movieService.createReview(movieId, reviewData);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Add Review Failed", err.response?.data || err.message);
      throw err; 
    }
  };

  const updateReview = async (reviewId: number, reviewData: { rating: number; comment: string }, movieId: number) => {
    try {
      await movieService.updateReview(reviewId, reviewData);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Update Review Failed", err.response?.data || err.message);
      throw err;
    }
  };

  const deleteReview = async (reviewId: number, movieId: number) => {
    try {
      await movieService.deleteReview(reviewId);
      await fetchMovieById(movieId);
    } catch (err: any) {
      console.error("Context: Delete Review Failed", err.response?.data || err.message);
      throw err;
    }
  };

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

export const [MovieProvider, useMovieContext] = constate(useMovieHook);