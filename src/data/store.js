// Simple localStorage-backed store
const LS_USERS = 'free-lms:users'
const LS_COURSES = 'free-lms:courses'

const seedCourses = [
  {
    id: 'c-html',
    title: 'HTML & CSS Basics',
    description: 'Build your first web pages with structure and style.',
    level: 'Beginner',
    duration: '3h',
    category: 'Web',
    tags: ['HTML','CSS','Frontend'],
    lessons: [
      { id:'l1', title:'HTML Foundations', content:'Intro to elements, tags, and structure.', videoUrl:'https://www.youtube.com/embed/pQN-pnXPaVg' },
      { id:'l2', title:'Styling with CSS', content:'Selectors, box model, and properties.', videoUrl:'https://www.youtube.com/embed/1Rs2ND1ryYc' }
    ],
    quiz: [
      { q:'What does CSS control?', options:['Structure','Presentation','Server','Database'], answerIndex:1 },
      { q:'Which tag creates a link?', options:['<div>','<a>','<span>','<link>'], answerIndex:1 },
    ]
  },
  {
    id: 'c-js',
    title: 'Modern JavaScript',
    description: 'Learn core JS concepts and DOM manipulation.',
    level: 'Beginner',
    duration: '4h',
    category: 'Web',
    tags: ['JavaScript','ES6'],
    lessons: [
      { id:'l1', title:'Variables & Types', content:'let/const and dynamic typing.', videoUrl:'https://www.youtube.com/embed/W6NZfCO5SIk' },
      { id:'l2', title:'DOM Basics', content:'querySelector and events.', videoUrl:'https://www.youtube.com/embed/0ik6X4DJKCc' },
    ],
    quiz: [
      { q:'Which keyword is block-scoped?', options:['var','let','function','this'], answerIndex:1 },
    ]
  }
]

export function getInitialData(){
  let users = {}
  let courses = []
  try{ users = JSON.parse(localStorage.getItem(LS_USERS)) || {} }catch{ users = {} }
  try{ courses = JSON.parse(localStorage.getItem(LS_COURSES)) || [] }catch{ courses = [] }
  if (courses.length === 0) {
    courses = seedCourses
    try{ localStorage.setItem(LS_COURSES, JSON.stringify(courses)) }catch{}
  }
  return { users, courses }
}

export function saveUsers(users){
  try{ localStorage.setItem(LS_USERS, JSON.stringify(users)) }catch{}
}

export function getCourses(){ return getInitialData().courses }

export function saveCourses(courses){
  try{ localStorage.setItem(LS_COURSES, JSON.stringify(courses)) }catch{}
}
