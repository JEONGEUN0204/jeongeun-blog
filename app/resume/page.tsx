import { redirect } from 'next/navigation'

/*
  이력서는 홈(/)으로 옮겼다. 이미 제출한 지원서에 /resume 링크가 남아 있을 수 있어 경로는 지우지 않는다.
  정적 export 에서 redirect() 는 meta refresh 가 담긴 HTML 로 나온다.
*/
export default function Resume() {
  redirect('/')
}
