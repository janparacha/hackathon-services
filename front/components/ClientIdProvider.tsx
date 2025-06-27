"use client"
import React, { createContext, useState } from "react"

export const ClientIdContext = createContext<{
  clientId: number,
  setClientId: (id: number) => void,
  refreshProjects: () => void,
  refreshProjectsCount: number
}>({
  clientId: 1,
  setClientId: () => {},
  refreshProjects: () => {},
  refreshProjectsCount: 0
})

export function ClientIdProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState(1)
  const [refreshProjectsCount, setRefreshProjectsCount] = useState(0)
  const refreshProjects = () => setRefreshProjectsCount(c => c + 1)
  return (
    <ClientIdContext.Provider value={{ clientId, setClientId, refreshProjects, refreshProjectsCount }}>
      {children}
    </ClientIdContext.Provider>
  )
} 