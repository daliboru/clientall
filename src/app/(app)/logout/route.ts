import { AuthService } from '@/lib/auth/authService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = await AuthService.logout()
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
