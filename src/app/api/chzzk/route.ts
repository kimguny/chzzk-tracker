import { NextRequest, NextResponse } from "next/server";
import { FetchFollowersParams, ChzzkResponse } from "@/types/chzzk";

export const maxDuration = 60;

const CHZZK_HEADERS = (cookie: string) => ({
  Cookie: cookie,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
});

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const FOLLOWER_PAGE_SIZE = 10000;
const FOLLOWING_PAGE_SIZE = 500;

async function fetchFollowers(id: string, cookie: string, maxCount: number): Promise<string[]> {
  const followers: string[] = [];
  const maxPages = Math.ceil(maxCount / FOLLOWER_PAGE_SIZE);
  for (let page = 0; page < maxPages; page++) {
    await delay(300);
    const url = `https://api.chzzk.naver.com/manage/v1/channels/${id}/followers?page=${page}&size=${FOLLOWER_PAGE_SIZE}&userNickname=`;
    const res = await fetch(url, { headers: CHZZK_HEADERS(cookie) });
    const json = await res.json();
    const data = json?.content?.data;
    if (!Array.isArray(data) || data.length === 0) break;
    for (const item of data) {
      const nickname = item?.user?.nickname;
      if (nickname) followers.push(nickname);
    }
  }
  return followers;
}

async function fetchFollowings(cookie: string, maxCount: number): Promise<string[]> {
  const followings: string[] = [];
  const maxPages = Math.ceil(maxCount / FOLLOWING_PAGE_SIZE);
  for (let page = 0; page < maxPages; page++) {
    await delay(300);
    const url = `https://api.chzzk.naver.com/service/v1/channels/followings?size=${FOLLOWING_PAGE_SIZE}&page=${page}`;
    const res = await fetch(url, { headers: CHZZK_HEADERS(cookie) });
    const json = await res.json();
    const list = json?.content?.followingList;
    if (!Array.isArray(list) || list.length === 0) break;
    for (const item of list) {
      const channelName = item?.channel?.channelName;
      if (channelName) followings.push(channelName);
    }
  }
  return followings;
}

export async function POST(req: NextRequest) {
  let body: FetchFollowersParams;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 본문을 파싱할 수 없습니다." }, { status: 400 });
  }

  const { NID_AUT, NID_SES, id, maxCount = 50000 } = body;
  if (!NID_AUT || !NID_SES || !id) {
    return NextResponse.json({ error: "NID_AUT, NID_SES, id는 필수입니다." }, { status: 400 });
  }

  const cookie = `NID_AUT=${NID_AUT}; NID_SES=${NID_SES}`;

  const [followers, followings] = await Promise.all([
    fetchFollowers(id, cookie, maxCount),
    fetchFollowings(cookie, maxCount),
  ]);

  const followersSet = new Set(followers);
  const followingsSet = new Set(followings);

  const mutualFollows: string[] = [];
  const onlyFollowers: string[] = [];
  for (const name of followers) {
    if (followingsSet.has(name)) mutualFollows.push(name);
    else onlyFollowers.push(name);
  }

  const onlyFollowing: string[] = [];
  for (const name of followings) {
    if (!followersSet.has(name)) onlyFollowing.push(name);
  }

  const result: ChzzkResponse = {
    followers,
    followings,
    mutualFollows,
    onlyFollowing,
    onlyFollowers,
  };

  return NextResponse.json(result);
}
