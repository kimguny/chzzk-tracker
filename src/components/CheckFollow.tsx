"use client";

import { useState } from "react";
import { FetchFollowersParams, ChzzkResponse, SavedSnapshot } from "@/types/chzzk";
import { loadSnapshot, saveSnapshot, detectUnfollowers } from "@/lib/snapshot";

type TabKey = "followers" | "followings" | "mutualFollows" | "onlyFollowing" | "onlyFollowers";

const TABS: { key: TabKey; label: string; accent: boolean }[] = [
  { key: "followers", label: "팔로워", accent: false },
  { key: "followings", label: "팔로잉", accent: false },
  { key: "mutualFollows", label: "맞팔", accent: true },
  { key: "onlyFollowing", label: "나만 팔로우", accent: false },
  { key: "onlyFollowers", label: "상대만 팔로워", accent: false },
];

function ResultTabs({ result }: { result: ChzzkResponse }) {
  const [activeTab, setActiveTab] = useState<TabKey>("followers");
  const [query, setQuery] = useState("");

  const items = result[activeTab] ?? [];
  const filtered = query
    ? items.filter((name) => name.toLowerCase().includes(query.toLowerCase()))
    : items;

  const activeAccent = TABS.find((t) => t.key === activeTab)?.accent ?? false;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
      {/* Tab bar */}
      <div className="flex overflow-x-auto" style={{ background: "#111", borderBottom: "1px solid #2a2a2a" }}>
        {TABS.map((tab) => {
          const count = result[tab.key]?.length ?? 0;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setQuery(""); }}
              className="flex-shrink-0 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
              style={{
                color: isActive ? (tab.accent ? "#00FFA3" : "#fff") : "#555",
                borderBottom: isActive ? `2px solid ${tab.accent ? "#00FFA3" : "#fff"}` : "2px solid transparent",
                background: "transparent",
              }}
            >
              {tab.label}
              <span
                className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: isActive ? "#2a2a2a" : "#1a1a1a", color: isActive ? "#aaa" : "#444" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="px-4 py-3" style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="닉네임 검색..."
          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFA3]"
          style={{ background: "#111", border: "1px solid #2a2a2a", color: "#fff" }}
        />
        {query && (
          <p className="mt-1.5 text-xs" style={{ color: "#555" }}>
            {filtered.length}명 / {items.length}명
          </p>
        )}
      </div>

      {/* List */}
      <div className="px-4 py-3" style={{ background: "#1a1a1a", minHeight: "200px" }}>
        {filtered.length > 0 ? (
          <ul className="space-y-0.5 text-sm" style={{ color: "#ccc" }}>
            {filtered.map((name, i) => (
              <li
                key={i}
                className="py-2 px-2 rounded transition-colors hover:bg-[#222]"
                style={{ borderBottom: "1px solid #222" }}
              >
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-sm text-center" style={{ color: "#444" }}>
            {query ? "검색 결과 없음" : "없음"}
          </p>
        )}
      </div>
    </div>
  );
}

function GuideSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl overflow-hidden" style={{ border: "1px solid #2a2a2a" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-colors"
        style={{ background: "#1a1a1a", color: "#00FFA3" }}
      >
        <span>입력값 가이드 — 어디서 가져오나요?</span>
        <span style={{ color: "#555" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 py-4 space-y-4 text-sm" style={{ background: "#111", color: "#aaa" }}>
          <div>
            <p className="font-semibold mb-1" style={{ color: "#fff" }}>① NID_AUT / NID_SES 쿠키</p>
            <p className="mb-2">
              <span style={{ color: "#00FFA3" }}>방법 1 — 크롬 확장 프로그램 (더 간편)</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              <li>크롬 웹스토어에서 <span style={{ color: "#00FFA3" }}>Cookie-Editor</span> 확장 설치</li>
              <li>chzzk.naver.com 접속 후 로그인</li>
              <li>확장 아이콘 클릭 → <span style={{ color: "#00FFA3" }}>NID_AUT</span>, <span style={{ color: "#00FFA3" }}>NID_SES</span> 값 복사</li>
            </ol>
            <p className="mb-2">
              <span style={{ color: "#888" }}>방법 2 — 개발자 도구</span>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>chzzk.naver.com 접속 후 로그인</li>
              <li>개발자 도구 열기 <span style={{ color: "#555" }}>(Windows: F12 / Mac: Cmd+Option+I)</span></li>
              <li>Application 탭 → Cookies → <span style={{ color: "#00FFA3" }}>https://chzzk.naver.com</span> 선택</li>
              <li><span style={{ color: "#00FFA3" }}>NID_AUT</span>와 <span style={{ color: "#00FFA3" }}>NID_SES</span>의 Value 값을 각각 복사</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold mb-1" style={{ color: "#fff" }}>② 치지직 채널 ID</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>치지직 로그인 후 우측 상단 프로필 → <span style={{ color: "#00FFA3" }}>내 채널</span> 클릭</li>
              <li>주소창 URL 확인: <span style={{ color: "#555" }}>chzzk.naver.com/</span><span style={{ color: "#00FFA3" }}>여기가채널ID</span></li>
              <li>해당 값을 채널 ID 입력칸에 붙여넣기</li>
            </ol>
          </div>
          <div className="text-xs space-y-1" style={{ color: "#555" }}>
            <p>※ 쿠키값은 이 서버에 저장되지 않으며, 치지직 API 조회 후 즉시 폐기됩니다.</p>
            <p>
              ※ 본 서비스의 전체 코드는{" "}
              <a
                href="https://github.com/kimguny/chzzk-tracker"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00FFA3" }}
              >
                GitHub에 공개
              </a>
              되어 있어 누구나 직접 확인할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckFollow() {
  const [nidAut, setNidAut] = useState("");
  const [nidSes, setNidSes] = useState("");
  const [channelId, setChannelId] = useState("");
  const [maxCount, setMaxCount] = useState(50000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<ChzzkResponse | null>(null);
  const [unfollowers, setUnfollowers] = useState<string[] | null>(null);
  const [prevSnapshot, setPrevSnapshot] = useState<SavedSnapshot | null>(null);

  const handleSubmit = async () => {
    if (!nidAut || !nidSes || !channelId) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const prev = loadSnapshot();
    setPrevSnapshot(prev);

    try {
      const body: FetchFollowersParams = { NID_AUT: nidAut, NID_SES: nidSes, id: channelId, maxCount };
      const res = await fetch("/api/chzzk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "요청 실패");
      }

      const data: ChzzkResponse = await res.json();
      setResult(data);

      if (prev) setUnfollowers(detectUnfollowers(prev, data.mutualFollows));

      saveSnapshot({
        timestamp: Date.now(),
        mutualFollows: data.mutualFollows,
        followers: data.followers,
        followings: data.followings,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FFA3]";
  const inputStyle = { background: "#111", border: "1px solid #2a2a2a", color: "#fff" };
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wider";
  const labelStyle = { color: "#888" };

  return (
    <div className="flex-1" style={{ color: "#fff" }}>
      <div className="mx-auto max-w-4xl px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">
            치지직 <span style={{ color: "#00FFA3" }}>팔로우 분석기</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#666" }}>
            팔로워/팔로잉 현황 확인 · 맞팔 취소한 사람 감지
          </p>
        </div>

        {/* Guide */}
        <GuideSection />

        {/* Form */}
        <div className="mb-6 rounded-xl p-6 space-y-4" style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>NID_AUT</label>
              <input
                type="text"
                value={nidAut}
                onChange={(e) => setNidAut(e.target.value)}
                placeholder="네이버 NID_AUT 쿠키 값"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>NID_SES</label>
              <input
                type="text"
                value={nidSes}
                onChange={(e) => setNidSes(e.target.value)}
                placeholder="네이버 NID_SES 쿠키 값"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>채널 ID</label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="URL 뒤에 붙는 채널 고유 ID"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>최대 조회 수</label>
              <input
                type="number"
                value={maxCount}
                min={1}
                onChange={(e) => setMaxCount(Math.max(1, Number(e.target.value)))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {error && <p className="text-sm" style={{ color: "#ff4d4d" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-lg py-3 text-sm font-bold tracking-wide transition-opacity disabled:opacity-40"
            style={{ background: "#00FFA3", color: "#0a0a0a" }}
          >
            {isLoading ? "조회 중..." : "팔로우 분석 시작"}
          </button>
        </div>

        {/* Previous snapshot info */}
        {prevSnapshot && (
          <p className="mb-4 text-xs" style={{ color: "#444" }}>
            이전 조회: {new Date(prevSnapshot.timestamp).toLocaleString("ko-KR")} · 맞팔 {prevSnapshot.mutualFollows.length}명
          </p>
        )}

        {/* Unfollowers alert */}
        {unfollowers && unfollowers.length > 0 && (
          <div className="mb-6 rounded-xl p-5" style={{ background: "#1a0a0a", border: "1px solid #ff4d4d" }}>
            <h2 className="mb-3 font-bold" style={{ color: "#ff4d4d" }}>
              맞팔 취소한 사람 {unfollowers.length}명
            </h2>
            <ul className="text-sm space-y-1" style={{ color: "#ff8080" }}>
              {unfollowers.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        {unfollowers && unfollowers.length === 0 && result && (
          <p className="mb-4 text-sm" style={{ color: "#00FFA3" }}>
            이전 조회 대비 맞팔 취소한 사람이 없습니다.
          </p>
        )}

        {/* Results */}
        {result && <ResultTabs result={result} />}
      </div>
    </div>
  );
}
