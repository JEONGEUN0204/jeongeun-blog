import type { Experience } from './schema'

/**
 * /resume 의 Experience 회사 머리 — 역할과 한 줄 요약만 둔다.
 *
 * 회사명·재직기간은 companyId 로 companies.ts 를 참조한다. 하이라이트도 여기 적지 않는다 —
 * 제품 소제목은 products.ts, 하이라이트의 제목·설명은 각 작업의 name · highlight 에서 온다
 * (content/highlight.ts 의 resumeGroups). 예전에는 이 파일에 하이라이트 문장을 손으로 옮겨 적어
 * 작업 서술이 바뀔 때마다 두 곳을 같이 고쳐야 했다.
 */
export const experiences: Experience[] = [
  {
    companyId: 'codit',
    role: 'Frontend Engineer',
    summary:
      '정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」의 웹·iOS·Android 앱 프론트엔드 담당',
  },
  {
    companyId: 'ezllabs',
    role: 'Frontend Engineer',
    summary:
      'MAU 30만 교통카드 충전·조회 서비스 「이즐충전소」 운영, 앱·웹·디자인 시스템·내부 AI 전반 개발',
  },
]
