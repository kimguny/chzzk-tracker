import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 치지직 팔로우 분석기",
  description: "치지직 팔로우 분석기 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1" style={{ color: "#fff" }}>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10">
          <Link href="/" className="text-sm" style={{ color: "#555" }}>
            ← 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            개인정보 <span style={{ color: "#00FFA3" }}>처리방침</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#555" }}>
            최종 수정일: 2026년 6월 11일
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#aaa" }}>
          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>1. 수집하는 정보</h2>
            <p>
              치지직 팔로우 분석기는 서비스 이용 시 다음 정보를 처리합니다.
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>네이버 로그인 쿠키 (NID_AUT, NID_SES) — 치지직 API 조회 목적으로만 사용</li>
              <li>치지직 채널 ID — 팔로워 조회 목적으로만 사용</li>
            </ul>
            <p className="mt-2">
              위 정보는 서버에 저장되지 않으며, API 조회 완료 후 즉시 폐기됩니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>2. 로컬 저장소 사용</h2>
            <p>
              맞팔 취소 감지 기능을 위해 이전 조회 결과(닉네임 목록, 조회 시각)를 사용자 본인의 브라우저 로컬 저장소(localStorage)에 저장합니다.
              이 데이터는 서버로 전송되지 않으며, 브라우저에서 직접 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>3. 제3자 서비스</h2>
            <p>본 서비스는 다음 제3자 서비스를 사용합니다.</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>
                <span style={{ color: "#fff" }}>Google AdSense</span> — 광고 게재 목적. Google의 광고 쿠키가 사용될 수 있습니다.
              </li>
              <li>
                <span style={{ color: "#fff" }}>Vercel Analytics</span> — 페이지뷰 및 방문자 통계 수집. 개인 식별 정보는 수집하지 않습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>4. 쿠키</h2>
            <p>
              본 서비스 자체는 쿠키를 직접 사용하지 않습니다. 다만 Google AdSense를 통해 광고 관련 쿠키가 설정될 수 있으며,
              브라우저 설정에서 쿠키를 비활성화할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>5. 정보 보유 및 삭제</h2>
            <p>
              서버에 개인정보를 보유하지 않습니다. 브라우저 로컬 저장소에 저장된 데이터는 사용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold" style={{ color: "#fff" }}>6. 문의</h2>
            <p>
              개인정보처리방침에 관한 문의는 아래로 연락해주세요.
            </p>
            <p className="mt-1" style={{ color: "#00FFA3" }}>kimguny12@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
