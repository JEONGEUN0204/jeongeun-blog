import { ReactNode } from 'react'

/**
 * 모바일·태블릿 스크린샷을 감싸는 디바이스 프레임.
 *
 * 원본 스크린샷 PNG에는 목업의 두꺼운 검정 베젤(폭의 약 10%)이 픽셀로 구워져 있어
 * 축소하면 테두리만 두껍게 보였다. 베젤은 이미지에서 잘라냈고, 대신 얇은 CSS 프레임을 씌운다.
 * 안쪽 라운드가 원본 화면 모서리의 잔여 검정 호보다 크므로 남은 흔적까지 함께 잘린다.
 */
export const deviceRadii = {
  phone: { outer: 'rounded-[1.75rem]', inner: 'rounded-[1.6rem]' },
  tablet: { outer: 'rounded-[1.1rem]', inner: 'rounded-[0.95rem]' },
}

export default function DeviceFrame({
  variant = 'phone',
  children,
}: {
  variant?: keyof typeof deviceRadii
  children: ReactNode
}) {
  const { outer, inner } = deviceRadii[variant]
  return (
    <div
      className={`break-inside-avoid-page bg-gray-900 p-[3px] shadow-md ring-1 ring-black/5 dark:ring-white/10 ${outer}`}
    >
      <div className={`overflow-hidden ${inner}`}>{children}</div>
    </div>
  )
}
