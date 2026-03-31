import { useState } from 'react'
import './App.css'
import DiceRoller from './components/DiceRoller'
import SensoryWords from './components/SensoryWords'
import Timer from './components/Timer'
import NPCGenerator from './components/NPCGenerator'
import GMReminder from './components/GMReminder'
import SceneCueCard from './components/SceneCueCard'

// 슬라이드업 오버레이에 표시할 패널 목록
const OVERLAYS = ['이름 뽑기', '퀵 룰']

export default function App() {
  // 현재 열려 있는 슬라이드업 패널 이름 (null이면 닫힘)
  const [overlay, setOverlay] = useState(null)

  const toggleOverlay = (name) => {
    setOverlay(prev => prev === name ? null : name)
  }

  return (
    <div className="app">

      {/* ── 상단 바 ── */}
      <header className="app-header">
        <span className="app-title">Codex</span>
        <div className="overlay-btns">
          {OVERLAYS.map(name => (
            <button
              key={name}
              className={`btn ${overlay === name ? 'primary' : ''}`}
              onClick={() => toggleOverlay(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </header>

      {/* ── 메인 대시보드 그리드 ── */}
      <main className="dashboard">

        {/* 주사위 */}
        <div className="tile tile-dice">
          <DiceRoller />
        </div>

        {/* 감각 묘사 */}
        <div className="tile tile-sensory">
          <SensoryWords />
        </div>

        {/* 타이머 */}
        <div className="tile tile-timer">
          <Timer />
        </div>

        {/* NPC 뽑기 */}
        <div className="tile tile-npc">
          <NPCGenerator />
        </div>

        {/* 씬 큐카드 */}
        <div className="tile tile-cuecard">
          <SceneCueCard />
        </div>

        {/* GM 리마인더 */}
        <div className="tile tile-reminder">
          <GMReminder />
        </div>

      </main>

      {/* ── 슬라이드업 오버레이 ── */}
      {overlay && (
        <div className="overlay" onClick={() => setOverlay(null)}>
          <div className="overlay-panel" onClick={e => e.stopPropagation()}>
            <div className="overlay-header">
              <span className="overlay-title">{overlay}</span>
              <button className="btn" onClick={() => setOverlay(null)}>닫기</button>
            </div>
            <div className="overlay-body">
              {/* Phase 2에서 컴포넌트 연결 예정 */}
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                {overlay} — 준비 중
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
