import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-admin'

function isAuthenticated(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  return Boolean(authHeader && authHeader.startsWith('Bearer '))
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('charity_expenses')
      .select('*')
      .order('spent_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Expense fetch error:', error)
      return NextResponse.json({
        expenses: [],
        warning: 'Expense table is not ready. Run scripts/06-add-charity-expenses.sql.',
      })
    }

    return NextResponse.json({ expenses: data || [] })
  } catch (error) {
    console.error('Expense API error:', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      category,
      amount,
      description,
      proof_url,
      spent_at,
      adminUsername,
    } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Judul belanja wajib diisi' }, { status: 400 })
    }

    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'Nominal belanja tidak valid' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('charity_expenses')
      .insert({
        title: title.trim(),
        category: category?.trim() || null,
        amount: numericAmount,
        description: description?.trim() || null,
        proof_url: proof_url?.trim() || null,
        spent_at: spent_at || new Date().toISOString().slice(0, 10),
        created_by: adminUsername || 'admin',
      })
      .select()
      .single()

    if (error) {
      console.error('Expense insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create expense. Run scripts/06-add-charity-expenses.sql first.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, expense: data })
  } catch (error) {
    console.error('Expense create API error:', error)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { expenseId } = await request.json()
    if (!expenseId) {
      return NextResponse.json({ error: 'Missing expense id' }, { status: 400 })
    }

    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
      .from('charity_expenses')
      .delete()
      .eq('id', expenseId)

    if (error) {
      console.error('Expense delete error:', error)
      return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Expense delete API error:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}
