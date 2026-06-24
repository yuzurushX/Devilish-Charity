import { CalendarDays, HandHeart, Heart, Megaphone, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PosterDecorations({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('poster-decorations pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <span className="poster-speckles" />
      <span className="poster-brush poster-brush-top" />
      <span className="poster-brush poster-brush-bottom" />

      <span className="poster-doodle poster-doodle-left">
        <HandHeart />
      </span>
      <span className="poster-doodle poster-doodle-right">
        <Heart />
      </span>

      {!compact && (
        <>
          <span className="poster-doodle poster-doodle-lower-left">
            <Megaphone />
          </span>
          <span className="poster-doodle poster-doodle-lower-right">
            <CalendarDays />
          </span>
          <span className="poster-burst poster-burst-one">
            <Sparkles />
          </span>
          <span className="poster-burst poster-burst-two">
            <Sparkles />
          </span>
        </>
      )}
    </div>
  )
}
