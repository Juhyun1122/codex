import { useState } from 'react'
import { SENSORY_DATA, SCENE_TYPES, SENSE_TYPES } from '../data/sensory'
import './SensoryWords.css'

// 배열에서 랜덤 항목 하나 반환
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function SensoryWords() {
  const [scene, setScene] = useState('공포')         // 현재 선택된 장소 유형
  const [picked, setPicked] = useState({})           // { 감각: 뽑힌단어 } 형태

  // 특정 감각 하나만 새로 뽑기
  const pickOne = (sense) => {
    const words = SENSORY_DATA[scene][sense]
    if (!words) return
    setPicked(prev => ({ ...prev, [sense]: pick(words) }))
  }

  // 모든 감각 한 번에 뽑기
  const pickAll = () => {
    const result = {}
    SENSE_TYPES.forEach(sense => {
      const words = SENSORY_DATA[scene][sense]
      if (words) result[sense] = pick(words)
    })
    setPicked(result)
  }

  // 장소 유형 변경 시 기존 결과 초기화
  const changeScene = (newScene) => {
    setScene(newScene)
    setPicked({})
  }

  return (
    <div className="sensory-words">
      <div className="tile-label">감각 묘사</div>

      {/* 장소 유형 선택 */}
      <div className="scene-tabs">
        {SCENE_TYPES.map(s => (
          <button
            key={s}
            className={`scene-btn ${scene === s ? 'active' : ''}`}
            onClick={() => changeScene(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 감각별 카드 */}
      <div className="sense-list">
        {SENSE_TYPES.map(sense => (
          <div
            key={sense}
            className={`sense-row ${picked[sense] ? 'has-word' : ''}`}
            onClick={() => pickOne(sense)}
          >
            <span className="sense-name">{sense}</span>
            <span className="sense-word">
              {picked[sense] || '탭해서 뽑기'}
            </span>
          </div>
        ))}
      </div>

      {/* 전체 뽑기 버튼 */}
      <button className="btn primary pick-all-btn" onClick={pickAll}>
        전체 뽑기
      </button>
    </div>
  )
}
