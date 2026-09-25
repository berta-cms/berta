export interface RequirementModel {
  key: string;
  group: 'server' | 'installation';
  label: string;
  ok: boolean;
  fatal: boolean;
  message: string;
}

export interface RequirementsResponse {
  /** `null` when the API could not boot and the installed state is unknown */
  installed: boolean | null;
  requirements: RequirementModel[];
}
