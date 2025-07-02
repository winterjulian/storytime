export interface DbStepIssue {
  id: string;
  title: string;
  description: string;
  stepId: string;
  releaseId?: string;
}
