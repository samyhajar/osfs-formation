export interface PositionDetailed {
  position: string;
  province: string;
  from: string;
  to: string;
  isActive: boolean;
  /**
   * Indicates whether this position matches one of the target formation positions
   * defined in the API route (e.g. Novice Master, Formation Director, etc.)
   */
  isTargetPosition?: boolean;
}

/**
 * Simplified shape returned by `/api/formation-personnel`.
 *
 * All heavy WordPress logic lives server-side; the client only needs this
 * flattened member model for rendering & filtering.
 */
export interface FormationPersonnelMember {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  bio: string;
  deceased: boolean;
  /** Absolute URL of the profile image (or null if none). */
  profileImage: string | null;
  /** Positions matching the target list and currently active */
  activeTargetPositions: PositionDetailed[];
  /** Full position history */
  allPositions: PositionDetailed[];
  /** Convenience count of currently active positions */
  totalActivePositions: number;
}
