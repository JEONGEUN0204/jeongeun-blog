import type { Experience } from './schema'

/**
 * /resume 의 Experience 하이라이트 — 경력기술서의 축약판.
 *
 * 회사명·재직기간은 여기에 두지 않는다. companyId 로 companies.ts 를 참조한다.
 * 제품 소제목도 마찬가지로 productId 로 products.ts 를 참조한다 — 예전에는 그룹 이름을
 * 문자열로 적어 두고 회사 MDX 의 <ProductGroup> 과 대조해서 갈라지는 것을 막고 있었다.
 * 7단 narrative 이관이 끝나면 이 목록은 projects 의 problem·decision·result 에서
 * 파생되어야 하며, 그때까지는 손으로 관리하는 압축본이다.
 */
export const experiences: Experience[] = [
  {
    companyId: 'codit',
    role: 'Frontend Engineer',
    summary:
      '정책·입법 데이터 플랫폼 「Codit」과 분리 서비스 「ChatCODIT」의 웹·iOS·Android 앱 프론트엔드 담당',
    groups: [
      {
        productId: 'codit-platform',
        highlights: [
          // codit-dashboard · codit-appshell · codit-agents-md · codit-tailwind-skill 은 productId 로 Codit 플랫폼에 속한다. 그룹을 따로 떼지 않는다.
          {
            /*
              codit-dashboard. 제목은 기존 값을 두고, 내용은 narrative.result 첫 문장을 그대로 옮겼다.
              예전 내용의 '초기 요청량 축소' 는 result 의 '전체 요청 수와 전송량은 줄지 않았지만' 과 맞지 않아 교체했다.
            */
            title: '대시보드 순차 로딩 아키텍처 설계',
            detail:
              '뉴스를 슬라이드 단위로 요청해 첫 화면이 기다리는 목록을 35건에서 9건으로 줄였고, 화면을 그리기 전 기다리던 썸네일도 35장에서 9장으로 줄어 LCP가 5.3초에서 1.8초로 줄었다.',
          },
          {
            // codit-appshell. 제목·설명 모두 입력 블록에 없어 TBD 다. verify 는 제목만 보고한다.
            title: 'TBD',
            detail: 'TBD',
          },
          {
            title: '도구 중립 단일 원본으로 저장소 규칙 정리',
            detail:
              '구조·규칙 문서가 없어 도구마다 참조 기준이 달랐던 저장소에, AGENTS.md를 단일 원본으로 두고 도구별 파일이 import 로 이를 불러오게 구성해 팀이 같은 문서를 참조하도록 정리',
          },
          {
            // codit-tailwind-skill. 제목은 입력 블록에 없어 TBD 다 (verify 가 목록으로 보고한다).
            title: 'TBD',
            detail:
              'styled-components·SCSS·Tailwind가 섞인 저장소에서, 확인에 드는 시간이 더 크다고 판단해 확인 절차를 먼저 정하고 그에 맞춘 작업 문서를 팀이 명령 하나로 쓰게 함',
          },
        ],
      },
      {
        productId: 'codit-chatcodit',
        highlights: [
          {
            title: '실시간 스트리밍 프로토콜 설계',
            detail:
              '거대한 JSON을 수동 파싱하던 기존 방식을 블록 단위 SSE 프로토콜(7종)로 직접 설계해 백엔드에 요청, 1,281줄에 달하던 수동 파서를 걷어내 파싱 로직 대폭 단순화',
          },
          {
            title: '대화형 문서 초안 작성(Draft)',
            detail:
              '기존 스트리밍 스토어에 블록 타입만 추가해 멀티턴 문서 생성을 무중단 확장, 에러 3분기·409 자기복구로 복원력 확보',
          },
          {
            title: '반응형 웹 · 0→1 구축',
            detail:
              'SSR 디바이스 감지·라우트 분리·Tailwind 토큰으로 반응형 대응, React → Next.js 마이그레이션·회원·인증·SEO·Bitbucket Pipeline 배포',
          },
        ],
      },
      {
        productId: 'codit-chatcodit-app',
        highlights: [
          {
            /*
              codit-chatcodit-app. 제목의 '웹→네이티브 마이그레이션' 은 사실과 달라 교체했다 —
              입력 블록의 제약이 '기존 React 모바일 웹은 그대로 유지' 라 웹을 앱으로 옮긴 게 아니라 앱을 더한 일이다.
              내용은 narrative.result 를 그대로 옮겼고, 예전의 '1.0.0 정식 출시' 는 beforeAfter.after 의
              '1.0.x 출시(결제 없음)' 과 어긋나 함께 걷어냈다.
            */
            title: 'iOS·Android 앱 추가',
            detail: 'iOS·Android 앱을 출시하고, 두 스토어 모두 인앱 구독을 붙여 운영 중',
          },
          {
            // codit-chatcodit-app. 제목은 기존 값을 두고, 내용은 narrative.decision.chosen 첫 문장을 옮겼다.
            title: '인앱결제(IAP)·구독 신뢰성 확보',
            detail:
              '서버 검증이 성공한 뒤에만 거래를 완료(finish)하고, 실패한 거래는 스토어 큐에 남겨 다음 실행·로그인 때 다시 검증한다',
          },
          {
            // codit-chatcodit-app-infra. 하위 프로젝트라 그룹을 따로 두지 않는다. 7단 서술을 받지 못해 기존 문구를 유지한다.
            title: '앱 보안·무중단 배포',
            detail:
              'reCAPTCHA·Firebase App Check 무결성 검증, EAS 환경 분리·OTA·rollback 자동 배포 체계 구축',
          },
        ],
      },
      {
        productId: 'codit-thecodit-app',
        highlights: [
          {
            // codit-thecodit-app. 제목은 기존 값을 두고, 내용은 narrative.result 첫 문장을 옮겼다.
            title: '코딧 웹을 WebView로 감싼 iOS·Android 앱',
            detail:
              '승인·머지까지 끝난 코드가 실서버 배포 전날 스테이징 확인에서 걸렸고, 앞서 얹은 방어 조건이 과했다는 걸 같은 릴리즈 안에서 철회',
          },
        ],
      },
    ],
  },
  {
    companyId: 'ezllabs',
    role: 'Frontend Engineer',
    summary:
      'MAU 30만 교통카드 충전·조회 서비스 「이즐충전소」 운영, 앱·웹·디자인 시스템·내부 AI 전반 개발',
    groups: [
      {
        productId: 'ezl-charge',
        /*
          ezl-charge. 제목은 roleDetail 의 첫 항목, 내용은 narrative.result 를 그대로 옮겼다.
          Sentry·재시도 플로우는 입력 블록에 서술이 없어 하이라이트를 두지 않는다.
        */
        highlights: [
          {
            title: '이즐워크 조회 API 호출 개선',
            detail:
              '페이지 진입당 미션 조회 API 호출을 4회에서 1회로 줄이고, 보상 버튼 연속 클릭 에러를 없애고, 불필요한 호출 코드를 삭제',
          },
        ],
      },
      {
        productId: 'ezl-backoffice',
        highlights: [
          {
            /*
              ezl-backoffice. 제목은 기존 값을 두고, 내용은 narrative.result 를 그대로 옮겼다.
              예전 내용의 '가독성·유지보수성 향상' 은 입력 블록에 없는 주장이라 함께 걷어냈다.

              제품을 그룹으로 나누기 전에는 백오피스·디자인 시스템·내부 AI 가 한 그룹이라 제목이
              제품을 가리켰다. 지금은 소제목이 같은 이름을 적어 겹친다 — 문구는 챗에서 확정해 바꾼다.
            */
            title: '백오피스',
            detail:
              '7개 도메인에 목록 단위 에러 경계를 적용했다. 일주일 뒤부터 동료 개발자가 같은 파일 규칙과 구성으로 다른 화면을 작성했고, 2025.09에는 동료가 쓴 기능별 README에 기본 구조로 실렸다.',
          },
        ],
      },
      {
        productId: 'ezl-design-system',
        highlights: [
          {
            /*
              ezl-design-system. 제목은 기존 값을 두고, 내용은 narrative.result 를 그대로 옮겼다.
              예전 내용의 '개발 시간 단축' 은 입력 블록에 없는 주장이라 함께 걷어냈다.
            */
            title: '디자인 시스템',
            detail: '신규·확장 컴포넌트가 이즐충전소 앱과 모바일 이즐 앱에 반영됨',
          },
        ],
      },
      {
        productId: 'ezl-ai',
        highlights: [
          {
            /*
              ezl-ai. 제목은 기존 값을 두고, 내용은 narrative.result 를 그대로 옮겼다.
              예전 내용의 '자연어 질의로 사내 데이터를 검색하는 내부 도구 구현' 은 도구 전체를 혼자 만든 것처럼 읽힌다 —
              입력 블록이 준 범위는 3인 프로젝트의 client 레이어까지고, 그 범위는 roleDetail·contribution 에 있다.
            */
            title: 'Jira/Confluence 검색 AI',
            detail:
              '수정한 flow가 배포 브랜치의 최종 버전으로 AWS ECS에 배포되어 사내에서 테스트 수준으로 사용됨. 회사 사정으로 본격 사용 전에 중단',
          },
        ],
      },
    ],
  },
]
