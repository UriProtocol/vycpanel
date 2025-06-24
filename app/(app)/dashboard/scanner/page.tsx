"use client"
import { Scanner } from '@yudiel/react-qr-scanner'
import React, { useState } from 'react'

export default function page() {

  const [scannerResult, setScannerResult] = useState('')

  return (
    <>
      <Scanner onScan={(result) => setScannerResult(JSON.stringify(result))} />
        {scannerResult}
    </>
  )
}
