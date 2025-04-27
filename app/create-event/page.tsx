// app/create-event/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamicImport from 'next/dynamic' // Renamed import
import Loading from './loading'

// Use the renamed import
const CreateEventForm = dynamicImport(
  () => import('./createeventform'),
  { 
    ssr: false,
    loading: () => <Loading />
  }
)

export default function CreateEventPage() {
  return <CreateEventForm />
}

// Keep this export separate
export const dynamic = 'force-dynamic'