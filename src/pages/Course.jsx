import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/auth/context'
import { getInitialData, saveUsers } from '@/data/store'

export default function Course(){
  const { id } = useParams()
  const { user } = useAuth()
  const { users, courses } = getInitialData()
  const course = courses.find(c=>c.id===id)
  const [state, setState] = useState(()=>{
    const u = users[user.email] || { enrolled:{} }
    const enr = u.enrolled[id] || { lessonsDone:[], quizScore:null }
    return { users, course, enr }
  })

  const markDone = (lessonId)=>{
    const usersCopy = JSON.parse(JSON.stringify(state.users))
    const u = usersCopy[user.email] ||= { email:user.email, enrolled:{} }
    const enr = u.enrolled[id] ||= { lessonsDone:[], quizScore:null }
    if (!enr.lessonsDone.includes(lessonId)) enr.lessonsDone.push(lessonId)
    saveUsers(usersCopy)
    setState({ ...state, users: usersCopy, enr })
  }

  const submitQuiz = (answers)=>{
    const correct = course.quiz.filter((q,i)=>answers[i]===q.answerIndex).length
    const score = Math.round((correct / course.quiz.length) * 100)
    const usersCopy = JSON.parse(JSON.stringify(state.users))
    usersCopy[user.email].enrolled[id].quizScore = score
    saveUsers(usersCopy)
    setState({ ...state, users: usersCopy, enr: usersCopy[user.email].enrolled[id] })
  }

  if (!course) return <div>Course not found.</div>

  const progress = Math.round(((state.enr.lessonsDone||[]).length / (course.lessons||[]).length) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <Badge className="ml-auto">{progress}%</Badge>
      </div>

      <section className="space-y-3">
        {(course.lessons||[]).map((l,idx)=>{
          const done = state.enr.lessonsDone?.includes(l.id)
          return (
            <Card key={l.id} className={done ? 'opacity-90' : ''}>
              <CardTitle>Lesson {idx+1}: {l.title}</CardTitle>
              <CardContent>
                {l.videoUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded border">
                    <iframe className="w-full h-full" src={l.videoUrl} title={l.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2">{l.content}</p>
                <div className="flex justify-end mt-2">
                  <Button onClick={()=>markDone(l.id)}>{done ? 'Completed' : 'Mark as done'}</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Quiz quiz={course.quiz} onSubmit={submitQuiz} score={state.enr.quizScore} />
    </div>
  )
}

function Quiz({ quiz=[], onSubmit, score }){
  const [answers, setAnswers] = useState({})
  if (!quiz.length) return null
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold">Quiz</h3>
      {quiz.map((q, idx)=>(
        <Card key={idx}>
          <CardTitle>Q{idx+1}. {q.q}</CardTitle>
          <CardContent className="space-y-2">
            {q.options.map((opt, oi)=>(
              <label key={oi} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`q-${idx}`} checked={answers[idx]===oi} onChange={()=>setAnswers(a=>({ ...a, [idx]: oi }))} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button onClick={()=>onSubmit(quiz.map((_,i)=>answers[i]))}>Submit Quiz</Button>
      {score!=null && <p className="text-sm mt-1">Your score: <b>{score}%</b></p>}
    </section>
  )
}
