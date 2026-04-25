// lib/api/responses.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validation error response
 */
export function validationErrorResponse(errors: any[]) {
  return NextResponse.json(
    {
      error: 'Validation failed',
      details: errors
    },
    { status: 400 }
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Not found response
 */
export function notFoundResponse(resource = 'Resource') {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

/**
 * Handle API errors uniformly
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  // Zod validation error
  if (error instanceof ZodError) {
    return validationErrorResponse(error.issues);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return errorResponse('A record with this data already exists', 409);
      case 'P2025':
        return notFoundResponse('Record');
      case 'P2003':
        return errorResponse('Related record not found', 400);
      default:
        return errorResponse('Database error', 500);
    }
  }

  // Generic error
  if (error instanceof Error) {
    return errorResponse(error.message);
  }

  return errorResponse('Internal server error');
}
