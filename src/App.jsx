import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthProvider, useAuth } from '@/auth/context'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Course from '@/pages/Course'
import Admin from '@/pages/Admin'

function NavBar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div className="border-b bg-white">
      <div className="container py-3 flex items-center gap-3">
        <Link to={user ? '/dashboard' : '/login'} className="font-bold text-xl">🎓 Free LMS</Link>
        {user && (
          <nav className="flex items-center gap-3 ml-4">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        )}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.email}</span>
              <Button onClick={()=>{ logout(); nav('/login') }}>Logout</Button>
            </>
          ) : (
            <Button as={Link} to="/login">Login</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Protected({ children }){
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <AuthProvider>
      <NavBar />
      <div className="container py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/course/:id" element={<Protected><Course /></Protected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
