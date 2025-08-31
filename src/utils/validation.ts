/**
 * @fileoverview Form validation schemas and type definitions
 * 
 * This file provides Yup validation schemas for form validation across the app:
 * - Login form validation (email, password)
 * - Registration form validation (username, email, names, password)
 * - Movie form validation (title, description, genre, dates, etc.)
 * 
 * Uses Yup for schema validation with TypeScript type inference for type safety.
 * All schemas include proper error messages and validation rules.
 */

import * as Yup from 'yup';

/**
 * Validation schema for the login form.
 */
export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

// Infer type from schema for type safety
export type LoginCredentials = Yup.InferType<typeof LoginSchema>;


/**
 * Validation schema for the registration form.
 */
export const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Username is too short').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  password_confirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export type RegisterData = Yup.InferType<typeof RegisterSchema>;


/**
 * Validation schema for the add/update movie form.
 */
export const MovieSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  genre: Yup.array().of(Yup.string()).min(1, 'At least one genre is required')
    .required('Genre is required'),  release_date: Yup.date().required('Release date is required'),
  duration: Yup.number().positive('Duration must be a positive number').required('Duration is required'),
  director: Yup.string().required('Director is required'),
  cast: Yup.string().required('Cast is required'),
});