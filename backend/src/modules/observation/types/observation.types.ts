export enum ObservationCategory {
  CLASS_PARTICIPATION = "class_participation",
  ATTENDANCE_BEHAVIOR = "attendance_behavior",
  PEER_INTERACTION = "peer_interaction",
  EMOTIONAL_SIGNAL = "emotional_signal",
  RULE_VIOLATION = "rule_violation",
  SUPPORT_NEED = "support_need",
}

export enum ObservationFlagStatus {
  NORMAL = "normal",
  NEEDS_REVIEW = "needs_review",
  REVIEWED = "reviewed",
}

export type CreateObservationInput = {
  studentId: string;
  category: ObservationCategory;
  observedAt: Date;
  summary: string;
  details: string;
};

export type ObservationRecord = {
  id: string;
  studentId: string;
  category: ObservationCategory;
  observedAt: Date;
  summary: string;
  details: string;
  recordedBy: string;
  recordedByRole: string;
  createdAt: Date;
  updatedAt: Date;
  flagStatus: ObservationFlagStatus;
};
