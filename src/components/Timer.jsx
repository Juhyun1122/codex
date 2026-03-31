import { useState, useEffect, useRef } from 'react'
import './Timer.css'

// 초를 MM:SS 형식으로 변환
const formatTime = (secs) => {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const PRESETS = [
  { label: '1분', secs: 60 },
  { label: '3분', secs: 180 },
  { label: '5분', secs: 300 },
  { label: '10분', secs: 600 },
]

export default function Timer() {
  const [total, setTotal] = useState(300)       // 설정된 총 시간 (초)
  const [remaining, setRemaining] = useState(300) // 남은 시간 (초)
  const [running, setRunning] = useState(false)  // 실행 중 여부
  const intervalRef = useRef(null)               // setInterval 참조 (정리용)

  // running이 바뀔 때마다 인터벌 시작/정지
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalRef.current)
  }, [running])

  const applyPreset = (secs) => {
    setRunning(false)
    setTotal(secs)
    setRemaining(secs)
  }

  const toggle = () => {
    if (remaining === 0) {
      // 시간 다 됐으면 리셋 후 시작
      setRemaining(total)
      setRunning(true)
    } else {
      setRunning(prev => !prev)
    }
  }

  const reset = () => {
    setRunning(false)
    setRemaining(total)
  }

  // 진행률 (0~1)
  const progress = total > 0 ? remaining / total : 0
  const isUrgent = remaining <= 30 && remaining > 0

  return (
    <div className="timer">
      <div className="tile-label">타이머</div>

      {/* 시간 표시 */}
      <div className={`timer-display ${isUrgent ? 'urgent' : ''} ${remaining === 0 ? 'done' : ''}`}>
        {formatTime(remaining)}
      </div>

      {/* 진행 바 */}
      <div className="timer-bar">
        <div
          className={`timer-fill ${isUrgent ? 'urgent' : ''}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* 프리셋 버튼 */}
      <div className="timer-presets">
        {PRESETS.map(p => (
          <button
            key={p.secs}
            className={`preset-btn ${total === p.secs ? 'active' : ''}`}
            onClick={() => applyPreset(p.secs)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 제어 버튼 */}
      <div className="timer-controls">
        <button className="btn primary" onClick={toggle}>
          {running ? '일시정지' : remaining === 0 ? '다시 시작' : '시작'}
        </button>
        <button className="btn" onClick={reset}>초기화</button>
      </div>
    </div>
  )
}
