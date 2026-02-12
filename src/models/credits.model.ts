export type CastMember = {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
};

export type CrewMember = {
  credit_id: string;
  department: string;
  job: string;
  name: string;
  profile_path: string | null;
};

export type CreditsResponse = {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
};
