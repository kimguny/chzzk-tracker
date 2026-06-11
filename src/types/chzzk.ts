export interface FetchFollowersParams {
  NID_AUT: string;
  NID_SES: string;
  id: string;
  maxCount?: number;
}

export interface ChzzkResponse {
  followers: string[];
  followings: string[];
  mutualFollows: string[];
  onlyFollowing: string[];
  onlyFollowers: string[];
}

export interface SavedSnapshot {
  timestamp: number;
  mutualFollows: string[];
  followers: string[];
  followings: string[];
}
