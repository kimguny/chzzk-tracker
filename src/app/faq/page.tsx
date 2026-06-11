import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | 치지직 팔로우 분석기",
  description: "치지직 팔로우 분석기 자주 묻는 질문",
};

const faqs = [
  {
    q: "쿠키가 뭔가요? 어디서 가져오나요?",
    a: "NID_AUT, NID_SES는 네이버 로그인 정보가 담긴 브라우저 쿠키입니다. 치지직에 로그인한 상태에서 크롬 확장 프로그램 Cookie-Editor를 사용하거나, 개발자 도구(F12 / Cmd+Option+I) → Application → Cookies에서 복사할 수 있습니다. 메인 페이지의 입력값 가이드를 참고하세요.",
  },
  {
    q: "쿠키값이 유출되지 않나요?",
    a: "입력한 쿠키값은 치지직 API 조회에만 사용되며, 서버에 저장되지 않습니다. 조회가 완료되면 즉시 폐기됩니다.",
  },
  {
    q: "조회가 안 되거나 오류가 나요.",
    a: "쿠키값이 만료되었을 가능성이 높습니다. 치지직에 다시 로그인한 후 쿠키값을 새로 복사해서 입력해보세요. 채널 ID가 올바른지도 확인해주세요.",
  },
  {
    q: "이전 조회 기록은 어디 저장되나요?",
    a: "서버가 아닌 본인 브라우저의 로컬 저장소(localStorage)에 저장됩니다. 다른 기기나 다른 브라우저에서는 이전 기록이 보이지 않습니다.",
  },
  {
    q: "최대 조회 수는 얼마로 설정해야 하나요?",
    a: "기본값 50,000명으로 대부분 충분합니다. 팔로워나 팔로잉이 5만 명을 넘는다면 직접 숫자를 늘려서 설정하세요. 숫자가 클수록 조회 시간이 길어집니다.",
  },
  {
    q: "치지직 채널 관리자가 아니어도 되나요?",
    a: "팔로잉 목록은 누구나 조회 가능하지만, 팔로워 목록은 해당 채널의 관리자 권한이 필요합니다. 본인 채널의 채널 ID를 입력해야 팔로워 목록이 정상적으로 조회됩니다.",
  },
  {
    q: "모바일에서도 사용할 수 있나요?",
    a: "사이트 자체는 모바일에서도 접속 가능하지만, 쿠키값 복사는 PC 브라우저에서 하는 것을 권장합니다. 모바일 브라우저에서는 개발자 도구 접근이 어렵습니다.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex-1" style={{ color: "#fff" }}>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10">
          <Link href="/" className="text-sm" style={{ color: "#555" }}>
            ← 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight">
            자주 묻는 <span style={{ color: "#00FFA3" }}>질문</span>
          </h1>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
            >
              <p className="font-semibold mb-2" style={{ color: "#fff" }}>
                Q. {faq.q}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
