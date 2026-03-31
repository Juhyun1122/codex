import { useState } from 'react'
import { NAME_PARTS, NPC_PARTS, NAME_REGIONS } from '../data/npcs'
import './NPCGenerator.css'

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 이름 생성
function generateName(region) {
  const data = NAME_PARTS[region]

  const first = pick(data.first)
  const last = data.last ? pick(data.last) : ''

  const full = data.last
    ? `${last} ${first}`   // 한국/일본 등
    : `${first} ${last}`   // 영미

  return { first, last, full }
}

// NPC 생성
function generateNPC(region) {
  const name = generateName(region)

  const gender = pick(NPC_PARTS.gender)
  const age = pick(NPC_PARTS.age)
  const job = pick(NPC_PARTS.job)
  const desire = pick(NPC_PARTS.desire)

  const personality = `${pick(NPC_PARTS.personality)}, ${pick(NPC_PARTS.personality)}`

  return {
    name: name.full,
    gender,
    age,
    job,
    desire,
    personality
  }
}

export default function NPCGenerator() {
  const [tab, setTab] = useState('npc')
  const [npc, setNpc] = useState(null)

  const [nameRegion, setNameRegion] = useState('한국')
  const [pickedName, setPickedName] = useState(null)

  const drawNPC = () => {
    setNpc(generateNPC(nameRegion))
  }

  const drawName = () => {
    const name = generateName(nameRegion)
    setPickedName(name.full)
  }

  return (
    <div className="npc-gen">
      <div className="tile-label">NPC / 이름</div>

      {/* 탭 */}
      <div className="npc-tabs">
        <button
          className={`npc-tab ${tab === 'npc' ? 'active' : ''}`}
          onClick={() => setTab('npc')}
        >
          NPC
        </button>
        <button
          className={`npc-tab ${tab === 'name' ? 'active' : ''}`}
          onClick={() => setTab('name')}
        >
          이름
        </button>
      </div>

      {/* NPC 탭 */}
      {tab === 'npc' && (
        <>
          <div className="role-filters">
            {NAME_REGIONS.map(r => (
              <button
                key={r}
                className={`filter-btn ${nameRegion === r ? 'active' : ''}`}
                onClick={() => setNameRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {npc && (
            <div className="npc-card">
              <div className="npc-name">{npc.name}</div>
              <div className="npc-meta">
                {npc.gender} · {npc.age} · {npc.job}
              </div>

              <div className="npc-trait">
                성격: {npc.personality}
              </div>

              <div className="npc-trait">
                욕망: {npc.desire}
              </div>
            </div>
          )}

          <button className="btn primary draw-btn" onClick={drawNPC}>
            {npc ? '다시 뽑기' : 'NPC 뽑기'}
          </button>
        </>
      )}

      {/* 이름 탭 */}
      {tab === 'name' && (
        <>
          <div className="role-filters">
            {NAME_REGIONS.map(r => (
              <button
                key={r}
                className={`filter-btn ${nameRegion === r ? 'active' : ''}`}
                onClick={() => setNameRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {pickedName && (
            <div className="name-result">
              <div className="name-text">{pickedName}</div>
              <div className="name-desc">{nameRegion}</div>
            </div>
          )}

          <button className="btn primary draw-btn" onClick={drawName}>
            {pickedName ? '다시 뽑기' : '이름 뽑기'}
          </button>
        </>
      )}
    </div>
  )
}