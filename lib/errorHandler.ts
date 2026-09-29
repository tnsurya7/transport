import { NextResponse } from 'next/server';

/**
 * Standardized API error response helper.
 * Extracts clean user-friendly messages from Prisma, validation, or unexpected exceptions.
 */
export function handleApiError(error: any, fallbackMessage = 'An unexpected error occurred. Please try again.') {
  console.error('[API Error]:', error);

  // Prisma Unique Constraint Violation (P2002)
  if (error?.code === 'P2002') {
    const target = error.meta?.target;
    let field = 'record';
    if (Array.isArray(target) && target.length > 0) {
      field = target[0];
    } else if (typeof target === 'string') {
      field = target;
    }
    return NextResponse.json(
      {
        success: false,
        error: `A ${field} with this information already exists in the system.`,
      },
      { status: 409 }
    );
  }

  // Prisma Record Not Found (P2025)
  if (error?.code === 'P2025') {
    return NextResponse.json(
      {
        success: false,
        error: 'The requested record was not found or has already been removed.',
      },
      { status: 404 }
    );
  }

  // Prisma Foreign Key Constraint Violation (P2003)
  if (error?.code === 'P2003') {
    return NextResponse.json(
      {
        success: false,
        error: 'Cannot complete action because related records depend on this item.',
      },
      { status: 400 }
    );
  }

  // Custom thrown Error with user-friendly message
  if (error instanceof Error && error.message && !error.message.includes('PrismaClient') && !error.message.includes('invocation:')) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }

  // Generic fallback
  return NextResponse.json(
    {
      success: false,
      error: fallbackMessage,
    },
    { status: 500 }
  );
}
