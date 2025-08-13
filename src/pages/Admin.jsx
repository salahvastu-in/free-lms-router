import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '@/data/helpers'
import { getInitialData, saveCourses } from '@/data/store'

export default function Admin(){
  const init = getInitialData()
  const [courses, setCourses] = useState(init.courses)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Web')
  const [level, setLevel] = useState('Beginner')
  const [duration, setDuration] = useState('2h')
  const [tags, setTags] = useState('')

  const [lessonCourse, setLessonCourse] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonVideo, setLessonVideo] = useState('')
  const [lessonContent, setLessonContent] = useState('')

  const addCourse = ()=>{
    if(!title) return
    const id = `c-${slugify(title)}-${Math.random().toString(36).slice(2,6)}`
    const next = [{ id, title, description, category, level, duration, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), lessons:[], quiz:[] }, ...courses]
    setCourses(next); saveCourses(next)
    setTitle(''); setDescription(''); setTags('')
  }

  const addLesson = ()=>{
    if(!lessonCourse || !lessonTitle) return
    const id = `l-${slugify(lessonTitle)}-${Math.random().toString(36).slice(2,6)}`
    const next = courses.map(c=> c.id===lessonCourse ? { ...c, lessons: [{ id, title: lessonTitle, content: lessonContent, videoUrl: lessonVideo||undefined }, ...(c.lessons||[])] } : c )
    setCourses(next); saveCourses(next)
    setLessonTitle(''); setLessonContent(''); setLessonVideo('')
  }

  const deleteCourse = (id)=>{
    const next = courses.filter(c=>c.id!==id)
    setCourses(next); saveCourses(next)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin</h2>

      <Card>
        <CardTitle>Add Course</CardTitle>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <div><Label>Title</Label><Input value={title} onChange={e=>setTitle(e.target.value)} /></div>
          <div><Label>Category</Label><Input value={category} onChange={e=>setCategory(e.target.value)} /></div>
          <div><Label>Level</Label><Input value={level} onChange={e=>setLevel(e.target.value)} /></div>
          <div><Label>Duration</Label><Input value={duration} onChange={e=>setDuration(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea value={description} onChange={e=>setDescription(e.target.value)} /></div>
          <div className="md:col-span-2"><Label>Tags (comma separated)</Label><Input value={tags} onChange={e=>setTags(e.target.value)} /></div>
          <Button onClick={addCourse}>Create Course</Button>
        </CardContent>
      </Card>

      <Card>
        <CardTitle>Add Lesson</CardTitle>
        <CardContent className="grid gap-2">
          <div><Label>Course ID</Label><Input placeholder="Select or paste course id" value={lessonCourse} onChange={e=>setLessonCourse(e.target.value)} /></div>
          <div><Label>Lesson Title</Label><Input value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} /></div>
          <div><Label>YouTube Embed URL (optional)</Label><Input value={lessonVideo} onChange={e=>setLessonVideo(e.target.value)} /></div>
          <div><Label>Content</Label><Textarea rows={5} value={lessonContent} onChange={e=>setLessonContent(e.target.value)} /></div>
          <Button onClick={addLesson}>Add Lesson</Button>
          <p className="text-xs text-gray-500">Tip: Course IDs are listed below. Use https://www.youtube.com/embed/VIDEO_ID format for videos.</p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(c=>(
          <Card key={c.id}>
            <CardTitle className="flex items-center justify-between">
              <span>{c.title}</span>
              <Button onClick={()=>deleteCourse(c.id)}>Delete</Button>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-500 mt-1">ID: <code>{c.id}</code></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
