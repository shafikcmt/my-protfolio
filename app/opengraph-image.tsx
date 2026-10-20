import { ImageResponse } from 'next/og'

export const alt = 'Md Shafiqul Islam — Full Stack Developer, Garments ERP & Web Apps'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          background: 'linear-gradient(140deg,#0f172a 0%,#115e59 100%)',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 28, color: '#5eead4', letterSpacing: 4, textTransform: 'uppercase' }}>
          Open to remote work
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 20, lineHeight: 1.1 }}>Md Shafiqul Islam</div>
        <div style={{ fontSize: 40, marginTop: 20, color: '#ccfbf1' }}>
          Full Stack Developer · Garments ERP &amp; Web Apps
        </div>
        <div style={{ fontSize: 28, marginTop: 36, color: '#99f6e4' }}>Laravel · Next.js · MERN · www.shafiqul.dev</div>
      </div>
    ),
    size
  )
}
