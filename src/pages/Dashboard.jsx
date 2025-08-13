import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/auth/context'
import { getInitialData, saveUsers } from '@/data/store'

export default function Dashboard(){
  const { user } = useAuth()
  const [data, setData] = useState(()=>getInitialData())
  const [query, setQuery] = useState('')

  useEffect(()=>{
    setData(getInitialData())
  },[])

  const courses = data.courses
  const users = data.users
  const current = users[user.email] || { enrolled:{} }

  const filtered = useMemo(()=>{
    const t = query.trim().toLowerCase()
    if(!t) return courses
    return courses.filter(c => c.title.toLowerCase().includes(t) || (c.description||'').toLowerCase().includes(t))
  },[courses, query])

  const enroll = (id)=>{
    users[user.email] ||= { email:user.email, enrolled:{} }
    users[user.email].enrolled[id] ||= { lessonsDone:[], quizScore:null }
    saveUsers(users)
    setData({ ...data, users })
  }

  const progressFor = (course)=>{
    const enr = current.enrolled[course.id]
    if (!enr) return 0
    const done = (enr.lessonsDone||[]).length
    const total = (course.lessons||[]).length || 1
    return Math.round(done/total*100)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="ml-auto"><Input placeholder="Search courses..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c=>(
          <Card key={c.id}>
            <CardTitle className="flex items-center justify-between">
              <span>{c.title}</span><Badge>{c.level}</Badge>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{c.description}</p>
              <div className="text-xs text-gray-500 mb-1">⏱ {c.duration} • {c.category}</div>
              <Progress value={progressFor(c)} />
              <div className="flex gap-2 mt-3">
                <Button as={Link} to={`/course/${c.id}`} className="flex-1">View</Button>
                <Button onClick={()=>enroll(c.id)} className="flex-1" title="Enroll (saves to your account)">Enroll</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
