// NPC 템플릿 데이터
export const NPC_PARTS = {
  gender: ['남', '여'],
  age: ['20대', '30대', '40대', '50대', '60대'],

  job: [
    '형사', '의사', '기자', '사서', '상인',
    '성직자', '교수', '학생', '주부'
  ],

  desire: [
    '진실을 밝히고 싶다',
    '돈을 벌고 싶다',
    '과거를 숨기고 싶다',
    '누군가를 보호하고 싶다',
    '복수하고 싶다',
    '지루함을 이겨내고 싶다'
  ],

  personality: [
    '냉담', '친절', '집요', '불안정',
    '교활', '합리적', '의심 많음'
  ]
}

// 이름 
export const NAME_PARTS = {
  한국: {
    last: ['김', '이', '박', '최', '정', '강', '윤'],
    first: ['민준', '서연', '도현', '하은', '지훈', '유진']
  },
  영미: {
    first: ['Arthur', 'Clara', 'Edmund', 'Violet'],
    last: ['Whitmore', 'Hale', 'Crane', 'Ashby']
  },
  독일: {
    first: ['Heinrich', 'Wolfgang', 'Klaus', 'Elsa', 'Greta', 'Ingrid'],
    last: ['Braun', 'Kessler', 'Hoffmann', 'Weber', 'Fischer', 'Müller']
  },
  일본: {
    last: ['田中Tanaka', '山本', '佐藤', '鈴木'],
    first: ['誠一', '花子', '健二', '久子']
  }
}

export const NAME_REGIONS = Object.keys(NAME_PARTS)

