import { NextResponse } from "next/server";

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
  headers?: Record<string, string>,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status, headers },
  );
}
