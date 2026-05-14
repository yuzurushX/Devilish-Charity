/**
 * Donation row shape from Supabase (`donations` table), as returned by API routes.
 * Use this wherever client code consumes `/api/donations` or `/api/admin/donations`.
 */
export interface Donation {
  id: string
  name: string
  discord_username: string | null
  amount: number
  payment_method: string
  proof_url: string
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  action_by: string | null
  action_at: string | null
  /** Present after migration `04-add-anonymous-column.sql` */
  is_anonymous?: boolean
}
