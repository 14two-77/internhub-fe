import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Browse from './browse/pages/Browse.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient =  new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Browse />
    </QueryClientProvider>
  </StrictMode>,
)
