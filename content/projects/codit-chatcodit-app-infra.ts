import type { Project } from '../schema'

/**
 * ChatCODIT App 의 인증·보안·배포 작업. 입력 블록이 다루지 않은 범위라 구축·결제에서 떼어 냈다.
 *
 * 2026.09 입력 블록은 구축·스트리밍·구독 결제만 다뤘는데, 예전 서술에는 소셜 로그인·딥링크·
 * reCAPTCHA Enterprise·Firebase App Check·EAS 배포가 함께 들어 있었다. 구축·결제의 7단 서술로
 * 덮으면 그 사실이 사라지고, 한 작업에 남겨 두면 입력 블록에 없는 내용이 그 서술과 섞인다.
 * 그래서 같은 제품 안의 형제 작업으로 떼어 기존 서술을 그대로 보존한다.
 *
 * narrative 는 아직 없다 — 이 작업의 7단 서술 블록을 받지 못했다. 그때까지 /careers 는
 * codit.mdx 의 손으로 쓴 09 Section 이, /portfolio 는 제품 본문의 작업 섹션이
 * data/projects/codit-chatcodit-app-infra.mdx 의 summary 로 대신한다.
 *
 * role·contribution 은 입력 블록에 없어 TBD 다. roleDetail·stack 은 예전 codit.mdx 09 의
 * <Meta> 에 확정돼 있던 값을 그대로 옮겼다.
 */
export const coditChatCoditAppInfra: Project = {
  id: 'codit-chatcodit-app-infra',
  companyId: 'codit',
  productId: 'codit-chatcodit-app',
  name: '인증·보안·배포',
  role: 'TBD',
  roleDetail: '소셜 로그인·딥링크 처리·앱 보안·EAS 무중단 배포 담당',
  contribution: 'TBD',
  stack: {
    primary: ['React Native', 'Expo'],
    secondary: ['reCAPTCHA Enterprise', 'Firebase App Check', 'EAS'],
  },
  metricIds: [],
  depth: 'supporting',
  kind: 'build',
}
