import type { Project } from '../schema'

/**
 * ChatCODIT App 의 인증·보안·배포 작업. 입력 블록이 다루지 않은 범위라 상위에서 떼어 냈다.
 *
 * 2026.09 codit-chatcodit-app 입력 블록은 구축·스트리밍·구독 결제만 다뤘는데, 예전 서술에는
 * 소셜 로그인·딥링크·reCAPTCHA Enterprise·Firebase App Check·EAS 배포가 함께 들어 있었다.
 * 상위의 7단 서술로 덮으면 그 사실이 사라지고, 한 프로젝트에 남겨 두면 입력 블록에 없는 내용이
 * 상위 서술과 섞인다. 그래서 parentId 하위 프로젝트로 떼어 기존 서술을 그대로 보존한다.
 *
 * narrative 는 아직 없다 — 이 작업의 7단 서술 블록을 받지 못했다. 그때까지 /careers 는
 * codit.mdx 의 손으로 쓴 09 Section 이, /portfolio 는 상위 본문 끝의 하위 프로젝트 자리가
 * data/projects/codit-chatcodit-app-infra.mdx 의 summary 로 대신한다.
 *
 * role·contribution 은 입력 블록에 없어 TBD 다. roleDetail·stack 은 예전 codit.mdx 09 의
 * <Meta> 에 확정돼 있던 값을 그대로 옮겼다.
 *
 * periodOverride 는 상위와 같은 2026.03 ~ 현재 다. 회사 기간(2025.11 ~ 현재)을 상속하면
 * /portfolio 하위 프로젝트 자리의 기간이 앱 시작보다 넉 달 앞서 찍힌다.
 */
export const coditChatCoditAppInfra: Project = {
  id: 'codit-chatcodit-app-infra',
  companyId: 'codit',
  parentId: 'codit-chatcodit-app',
  name: '인증·보안·배포',
  periodOverride: { start: '2026.03', end: 'present' },
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
