import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/auth/context'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const { login } = useAuth()

  const onSubmit = (e)=>{
    e.preventDefault()
    if (!email) return alert('Enter email')
    login(email, password || 'pass')
    nav('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="grid gap-3">
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit">Continue</Button>
      </form>
      <p className="text-sm text-gray-600 mt-3">Local demo login—no server required.</p>
    </div>
  )
}
