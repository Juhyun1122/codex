import { useState, useEffect } from 'react'
import './GMReminder.css'

// localStorage 키
const STORAGE_KEY = 'codex_reminders'

// 기본 리마인더 목록
const DEFAULT_REMINDERS = [
  '플레이어와 눈을 맞추세요',
  '묘사는 감각적으로',
  '플레이어의 선택이 세계와 이야기를 변화시키도록',
]

export default function GMReminder() {
  const [reminders, setReminders] = useState(() => {
    // 앱 시작 시 localStorage에서 불러오기, 없으면 기본값 사용
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS
    } catch {
      return DEFAULT_REMINDERS
    }
  })

  const [editing, setEditing] = useState(false)  // 편집 모드 여부
  const [newText, setNewText] = useState('')      // 새 리마인더 입력값
  const [current, setCurrent] = useState(0)       // 현재 표시 중인 리마인더 인덱스

  // reminders가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  }, [reminders])

  const addReminder = () => {
    const text = newText.trim()
    if (!text) return
    setReminders(prev => [...prev, text])
    setNewText('')
  }

  const removeReminder = (index) => {
    setReminders(prev => prev.filter((_, i) => i !== index))
    setCurrent(0)
  }

  // 다음 리마인더로 순환
  const next = () => {
    setCurrent(prev => (prev + 1) % reminders.length)
  }

  return (
    <div className="gm-reminder">
      <div className="tile-label-row">
        <span className="tile-label">GM 리마인더</span>
        <button
          className={`edit-toggle ${editing ? 'active' : ''}`}
          onClick={() => setEditing(prev => !prev)}
        >
          {editing ? '완료' : '편집'}
        </button>
      </div>

      {!editing ? (
        // 표시 모드
        <>
          {reminders.length > 0 ? (
            <div className="reminder-display" onClick={next}>
              <div className="reminder-text">{reminders[current]}</div>
              {reminders.length > 1 && (
                <div className="reminder-nav">
                  {current + 1} / {reminders.length} — 탭해서 다음
                </div>
              )}
            </div>
          ) : (
            <div className="reminder-empty">리마인더를 추가하세요</div>
          )}
        </>
      ) : (
        // 편집 모드
        <div className="reminder-edit">
          <div className="reminder-list">
            {reminders.map((r, i) => (
              <div key={i} className="reminder-item">
                <span className="reminder-item-text">{r}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeReminder(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="add-row">
            <input
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addReminder()}
              placeholder="새 리마인더 입력..."
            />
            <button className="btn primary" onClick={addReminder}>추가</button>
          </div>
        </div>
      )}
    </div>
  )
}
