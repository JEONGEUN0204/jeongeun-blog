import Image from '@/components/Image'
import DeviceFrame from '@/components/DeviceFrame'
import type { ImageFrame } from '@/content/schema'

interface Props {
  images: string[]
  /** [표시 폭, 표시 높이]. 실제 높이는 h-auto 라 원본 비율을 따른다. */
  imageSize: [number, number]
  /** 있으면 스크린샷을 디바이스 프레임으로 감싼다. */
  imageFrame?: ImageFrame
  alt: string
}

/**
 * 제품·작업 스크린샷.
 *
 * 폭은 A4 인쇄 시 컨텐츠 폭(약 640px = 인쇄 폭 688px - 좌우 패딩) 안에서 한 제품의
 * 이미지가 gap-6(24px)을 포함해 한 줄에 모두 들어가도록 정한다. 예: 2장이면 폭 300.
 * 높이는 h-auto 라 비율이 다른 이미지가 섞여도 찌그러지지 않는다.
 *
 * 좁은 화면(sm 미만)에서는 이 폭으로 두면 한 줄에 한 장씩 왼쪽에 붙고 오른쪽이 빈다.
 * 그래서 폭 대신 그리드 칸을 채운다 — 웹 화면은 한 줄에 한 장, 디바이스 프레임은 두 장.
 * 넓은 화면·인쇄에는 폭 클래스를 걸지 않는다(max-sm: 만 쓴다). w-auto 라도 걸리면 width 속성을
 * 이겨서 이미지가 원본 픽셀 폭으로 커지고 인쇄 쪽수가 늘어난다.
 *
 * 인쇄에서는 묶음 전체를 zoom 으로 줄인다. 제품마다 새 쪽에서 시작하는데 스크린샷이 한 쪽의
 * 절반 가까이를 차지해, 서술의 마지막 칸(대개 결과)만 다음 쪽으로 넘어가 거의 빈 쪽이 생겼다.
 * 폭·높이 클래스 대신 zoom 을 쓰는 건 위의 width 속성 문제를 피하고 디바이스 프레임까지 같이 줄이기 위해서다.
 */
export default function Screenshots({ images, imageSize, imageFrame, alt }: Props) {
  if (images.length === 0) return null

  return (
    <div
      className={`not-prose flex flex-wrap items-start gap-6 max-sm:grid max-sm:gap-4 print:[zoom:0.6] ${
        imageFrame ? 'max-sm:grid-cols-2' : ''
      }`}
    >
      {images.map((image, index) => {
        const img = (
          <Image
            src={image}
            alt={`${alt} 스크린샷 ${index + 1}`}
            width={imageSize[0]}
            height={imageSize[1]}
            // 인쇄는 화면 밖 이미지를 불러오지 않은 채 쪽을 만든다 — lazy 면 아래쪽 스크린샷이 빈 칸으로 찍힌다
            loading="eager"
            className="h-auto max-w-full rounded-md max-sm:w-full"
          />
        )
        return (
          <div key={image} className="break-inside-avoid-page">
            {imageFrame ? <DeviceFrame variant={imageFrame}>{img}</DeviceFrame> : img}
          </div>
        )
      })}
    </div>
  )
}
