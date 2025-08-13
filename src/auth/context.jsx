import React, { createContext, useContext, useEffect, useState } from 'react'
import { getInitialData } from '@/data/store'

const AuthCtx = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try{
      const raw = localStorage.getItem('free-lms:user')
      return raw ? JSON.parse(raw) : null
    }catch{return null}
  })

  useEffect(()=>{
    try{ localStorage.setItem('free-lms:user', JSON.stringify(user)) }catch{}
  },[user])

  const login = (email, password)=>{
    // local-only auth: create if missing
    const users = getInitialData().users
    users[email] ||= { email, password, enrolled: {} }
    localStorage.setItem('free-lms:users', JSON.stringify(users))
    setUser({ email })
  }
  const logout = ()=> setUser(null)

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth(){ return useContext(AuthCtx) }
