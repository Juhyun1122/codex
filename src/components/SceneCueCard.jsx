import { useState, useEffect } from 'react'
import './SceneCueCard.css'

// ── localStorage 키 ──────────────────────────────────────────
const LS_SCENARIOS = 'codex_scenarios'
const LS_CUECARDS  = 'codex_cuecards'

// ── 초기 데이터 로더 ─────────────────────────────────────────
function loadScenarios() {
  try { return JSON.parse(localStorage.getItem(LS_SCENARIOS)) || [] }
  catch { return [] }
}
function loadCueCards() {
  try { return JSON.parse(localStorage.getItem(LS_CUECARDS)) || [] }
  catch { return [] }
}

// ── ID 생성 (crypto.randomUUID 없는 환경 대비) ───────────────
const uid = () => Math.random().toString(36).slice(2, 10)

// ── 빈 카드 템플릿 ───────────────────────────────────────────
const blankCard = (scenarioId, order) => ({
  id: uid(),
  scenarioId,
  order,
  title: '',
  description: '',
  keyPoints: '',
})

// ────────────────────────────────────────────────────────────
export default function SceneCueCard() {
  const [scenarios,    setScenarios]    = useState(loadScenarios)
  const [cards,        setCards]        = useState(loadCueCards)
  const [activeScId,   setActiveScId]   = useState(null)   // 선택된 시나리오 id
  const [cardIndex,    setCardIndex]    = useState(0)       // 현재 카드 인덱스
  const [mode,         setMode]         = useState('view')  // 'view' | 'edit' | 'manage'

  // ── 편집 폼 상태 ──────────────────────────────────────────
  const [form, setForm] = useState({ title: '', description: '', keyPoints: '' })
  // 시나리오 추가 폼
  const [scForm, setScForm] = useState({ title: '' })

  // ── 파생 데이터 ───────────────────────────────────────────
  // 선택된 시나리오의 카드 목록 (order 순 정렬)
  const sceneCards = cards
    .filter(c => c.scenarioId === activeScId)
    .sort((a, b) => a.order - b.order)

  const currentCard = sceneCards[cardIndex] || null
  const total       = sceneCards.length

  // ── localStorage 동기화 ───────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LS_SCENARIOS, JSON.stringify(scenarios))
  }, [scenarios])

  useEffect(() => {
    localStorage.setItem(LS_CUECARDS, JSON.stringify(cards))
  }, [cards])

  // 시나리오 바뀌면 첫 카드로 리셋
  useEffect(() => {
    setCardIndex(0)
    setMode('view')
  }, [activeScId])

  // ── 네비게이션 ────────────────────────────────────────────
  const goPrev = () => setCardIndex(i => Math.max(0, i - 1))
  const goNext = () => setCardIndex(i => Math.min(total - 1, i + 1))

  // ── 카드 편집 ─────────────────────────────────────────────
  const startEdit = () => {
    if (currentCard) {
      setForm({
        title:       currentCard.title,
        description: currentCard.description,
        keyPoints:   currentCard.keyPoints,
      })
    } else {
      setForm({ title: '', description: '', keyPoints: '' })
    }
    setMode('edit')
  }

  const saveCard = () => {
    if (!activeScId) return
    if (currentCard) {
      // 기존 카드 수정
      setCards(prev =>
        prev.map(c => c.id === currentCard.id ? { ...c, ...form } : c)
      )
    } else {
      // 새 카드 추가
      const newCard = blankCard(activeScId, total)
      setCards(prev => [...prev, { ...newCard, ...form }])
      setCardIndex(total) // 새로 추가한 카드로 이동
    }
    setMode('view')
  }

  const addCard = () => {
    setForm({ title: '', description: '', keyPoints: '' })
    setMode('edit')
    // cardIndex를 마지막 다음으로 — saveCard()에서 total 기준으로 추가됨
    setCardIndex(total)
  }

  const deleteCard = () => {
    if (!currentCard) return
    if (!confirm(`"${currentCard.title || '이 카드'}"를 삭제할까요?`)) return
    setCards(prev => {
      const filtered = prev.filter(c => c.id !== currentCard.id)
      // 삭제 후 order 재정렬
      const reordered = filtered
        .filter(c => c.scenarioId === activeScId)
        .sort((a, b) => a.order - b.order)
        .map((c, i) => ({ ...c, order: i }))
      const others = filtered.filter(c => c.scenarioId !== activeScId)
      return [...others, ...reordered]
    })
    setCardIndex(i => Math.max(0, i - 1))
    setMode('view')
  }

  // ── 시나리오 추가 ─────────────────────────────────────────
  const addScenario = () => {
    const title = scForm.title.trim()
    if (!title) return
    const newSc = { id: uid(), title, campaignId: null }
    setScenarios(prev => [...prev, newSc])
    setActiveScId(newSc.id)
    setScForm({ title: '' })
    setMode('manage') // 시나리오 선택 패널 닫고 싶으면 'view'로
  }

  const deleteScenario = (scId) => {
    if (!confirm('시나리오와 모든 큐카드를 삭제할까요?')) return
    setScenarios(prev => prev.filter(s => s.id !== scId))
    setCards(prev => prev.filter(c => c.scenarioId !== scId))
    if (activeScId === scId) setActiveScId(null)
  }

  // ── 렌더 ──────────────────────────────────────────────────
  return (
    <div className="cue-root">
      <div className="tile-label">씬 큐카드</div>

      {/* ── 시나리오 선택 바 ── */}
      <div className="cue-scenario-bar">
        <select
          className="cue-select"
          value={activeScId || ''}
          onChange={e => setActiveScId(e.target.value || null)}
        >
          <option value="">— 시나리오 선택 —</option>
          {scenarios.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <button
          className="btn icon cue-manage-btn"
          title="시나리오 관리"
          onClick={() => setMode(m => m === 'manage' ? 'view' : 'manage')}
        >
          ⚙
        </button>
      </div>

      {/* ── 시나리오 관리 패널 ── */}
      {mode === 'manage' && (
        <div className="cue-manage-panel">
          <div className="cue-manage-add">
            <input
              className="cue-input"
              placeholder="새 시나리오 제목"
              value={scForm.title}
              onChange={e => setScForm({ title: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addScenario()}
            />
            <button className="btn primary" onClick={addScenario}>추가</button>
          </div>
          <ul className="cue-manage-list">
            {scenarios.length === 0 && (
              <li className="cue-empty-hint">시나리오 없음</li>
            )}
            {scenarios.map(s => (
              <li key={s.id} className="cue-manage-item">
                <span
                  className={`cue-manage-name ${s.id === activeScId ? 'active' : ''}`}
                  onClick={() => { setActiveScId(s.id); setMode('view') }}
                >
                  {s.title}
                </span>
                <button
                  className="btn icon cue-delete-btn"
                  onClick={() => deleteScenario(s.id)}
                  title="삭제"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 시나리오 미선택 상태 ── */}
      {!activeScId && mode !== 'manage' && (
        <div className="cue-placeholder">
          <span>시나리오를 선택하거나 새로 추가하세요</span>
        </div>
      )}

      {/* ── 카드 뷰 ── */}
      {activeScId && mode === 'view' && (
        <>
          {total === 0 ? (
            <div className="cue-placeholder">
              <span>카드가 없습니다</span>
            </div>
          ) : (
            <div className="cue-card">
              <div className="cue-card-title">{currentCard?.title || '(제목 없음)'}</div>
              {currentCard?.description && (
                <div className="cue-card-section">
                  <div className="cue-section-label">묘사</div>
                  <div className="cue-card-desc">{currentCard.description}</div>
                </div>
              )}
              {currentCard?.keyPoints && (
                <div className="cue-card-section">
                  <div className="cue-section-label">핵심</div>
                  <div className="cue-card-key">{currentCard.keyPoints}</div>
                </div>
              )}
            </div>
          )}

          {/* 네비게이션 */}
          <div className="cue-nav">
            <button
              className="btn icon"
              onClick={goPrev}
              disabled={cardIndex === 0 || total === 0}
            >◀</button>
            <span className="cue-counter">
              {total === 0 ? '0 / 0' : `${cardIndex + 1} / ${total}`}
            </span>
            <button
              className="btn icon"
              onClick={goNext}
              disabled={cardIndex >= total - 1 || total === 0}
            >▶</button>
            <div className="cue-nav-actions">
              <button className="btn" onClick={startEdit}>편집</button>
              <button className="btn" onClick={addCard}>+ 추가</button>
              {currentCard && (
                <button className="btn cue-delete-card-btn" onClick={deleteCard}>삭제</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── 카드 편집 모드 ── */}
      {activeScId && mode === 'edit' && (
        <div className="cue-edit-form">
          <input
            className="cue-input"
            placeholder="씬 제목"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            className="cue-textarea"
            placeholder="장면 묘사"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <textarea
            className="cue-textarea cue-textarea-key"
            placeholder="핵심 내용 / GM 메모"
            rows={2}
            value={form.keyPoints}
            onChange={e => setForm(f => ({ ...f, keyPoints: e.target.value }))}
          />
          <div className="cue-edit-actions">
            <button className="btn primary" onClick={saveCard}>저장</button>
            <button className="btn" onClick={() => { setMode('view'); setCardIndex(Math.min(cardIndex, Math.max(0, total - 1))) }}>취소</button>
          </div>
        </div>
      )}
    </div>
  )
}