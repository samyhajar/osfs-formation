/**
 * Generic response type for auth-related operations initiated from the client.
 *
 * This mirrors the JSON structures returned by auth-related API routes.
 */
export interface AuthOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type PasswordResetResponse = AuthOperationResponse;

export type PasswordUpdateResponse = AuthOperationResponse;
