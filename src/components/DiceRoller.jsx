import { useState } from 'react'
import './DiceRoller.css'

// 사용 가능한 주사위 면 수 목록
const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100]

// CoC d100 판정 결과 계산
// stat: 기능치 (0이면 판정 없음), roll: 굴린 값
function calcCoCResult(stat, roll) {
  if (!stat || stat <= 0) return null

  // 대실패
  if (roll === 100) return { label: '대실패', color: '#E24B4A' }
  if (stat < 50 && roll >= 96) {
    return { label: '대실패', color: '#E24B4A' }
  }

  // 성공 판정
  if (roll <= Math.floor(stat / 5)) return { label: '극단적 성공', color: '#378ADD' }
  if (roll <= Math.floor(stat / 2)) return { label: '어려운 성공', color: '#1D9E75' }
  if (roll <= stat)                 return { label: '일반 성공',   color: '#1D9E75' }

  // 실패
  return { label: '실패', color: '#E24B4A' }
}

export default function DiceRoller() {
  const [selectedDie, setSelectedDie] = useState(100)  // 선택된 주사위 면 수
  const [count, setCount] = useState(1)                 // 굴릴 개수
  const [modifier, setModifier] = useState(0)           // 수정치
  const [cocStat, setCocStat] = useState('')            // CoC 기능치 (빈 문자열 = 미입력)
  const [result, setResult] = useState(null)            // 마지막 굴림 결과
  const [history, setHistory] = useState([])            // 굴림 기록 (최근 5개)

  const roll = () => {
    // count개의 주사위를 굴려서 배열로 저장
    const rolls = Array.from({ length: count }, () =>
      Math.ceil(Math.random() * selectedDie)
    )
    const total = rolls.reduce((a, b) => a + b, 0) + modifier
    const stat = parseInt(cocStat) || 0
    const verdict = selectedDie === 100 ? calcCoCResult(stat, total) : null

    const newResult = { total, rolls, modifier, die: selectedDie, count, verdict }
    setResult(newResult)

    // 히스토리는 최근 5개만 유지
    setHistory(prev => [newResult, ...prev].slice(0, 5))
  }

  return (
    <div className="dice-roller">
      <div className="tile-label">주사위</div>

      {/* 주사위 선택 버튼 */}
      <div className="dice-types">
        {DICE_TYPES.map(d => (
          <button
            key={d}
            className={`dice-btn ${selectedDie === d ? 'active' : ''}`}
            onClick={() => setSelectedDie(d)}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* 옵션 행: 개수 / 수정치 / CoC 기능치 */}
      <div className="dice-options">
        <label>
          <span>개수</span>
          <input
            type="number"
            min="1" max="20"
            value={count}
            onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </label>
        <label>
          <span>수정치</span>
          <input
            type="number"
            value={modifier}
            onChange={e => setModifier(parseInt(e.target.value) || 0)}
          />
        </label>
        {selectedDie === 100 && (
          <label>
            <span>기능치</span>
            <input
              type="number"
              min="0" max="100"
              placeholder="0"
              value={cocStat}
              onChange={e => setCocStat(e.target.value)}
            />
          </label>
        )}
      </div>

      {/* 굴리기 버튼 */}
      <button className="btn primary roll-btn" onClick={roll}>
        굴리기
      </button>

      {/* 결과 표시 */}
      {result && (
        <div className="dice-result">
          <div className="result-total">{result.total}</div>
          {result.count > 1 && (
            <div className="result-detail">
              [{result.rolls.join(', ')}]{result.modifier !== 0 ? ` ${result.modifier > 0 ? '+' : ''}${result.modifier}` : ''}
            </div>
          )}
          {result.verdict && (
            <div className="result-verdict" style={{ color: result.verdict.color }}>
              {result.verdict.label}
            </div>
          )}
        </div>
      )}

      {/* 최근 굴림 히스토리 */}
      {history.length > 1 && (
        <div className="dice-history">
          {history.slice(1).map((h, i) => (
            <span key={i} className="history-item">
              {h.total}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
