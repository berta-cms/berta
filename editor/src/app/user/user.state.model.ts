export interface UserStateModel {
  name: string | null;
  token: string | null;
  features: string[];
  profileUrl: string | null;
  nextUrl?: string;
  intercom?: {
    appId: string;
    userHash: string;
    userName: string;
  };
  helpcrunch?: {
    organization: string;
    appId: string;
    user_id: string;
    security_hash: string;
    email: string;
  };
}
