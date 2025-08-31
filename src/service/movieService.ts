import { api } from './api';
import { Movie, Review } from '../types';

export interface PaginatedMoviesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Movie[];
}

export interface Genre {
  id: number;
  value: string;
  label: string;
}

export const getMovies = async (page: number = 1): Promise<PaginatedMoviesResponse> => {
  const response = await api.get(`/movies/?page=${page}`);
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get(`/movies/${id}/`);
  return response.data;
};

export const createMovie = async (movieData: any): Promise<Movie> => {
  const response = await api.post('/movies/', movieData);
  return response.data;
};

export const updateMovie = async (movieId: number, movieData: any): Promise<Movie> => {
  const response = await api.put(`/movies/${movieId}/`, movieData);
  return response.data;
};

export const deleteMovie = async (movieId: number): Promise<void> => {
  await api.delete(`/movies/${movieId}/`);
};

export const createReview = async (
  movieId: number,
  reviewData: { rating: number; comment?: string }
): Promise<Review> => {
  const response = await api.post(`/movies/${movieId}/reviews/`, reviewData);
  return response.data;
};

export const updateReview = async (
  reviewId: number,
  reviewData: { rating: number; comment?: string }
): Promise<Review> => {
  const response = await api.put(`/movies/reviews/${reviewId}/`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/movies/reviews/${reviewId}/`);
};