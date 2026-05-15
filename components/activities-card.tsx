'use client'

import Image from 'next/image'

const activities = [
  '/activities/hero.webp',
  '/activities/IMG_2482.webp',
  '/activities/IMG_2502.webp',
  '/activities/IMG_2525.webp',
  '/activities/IMG_2534.webp',
  '/activities/IMG_2536.webp',
  '/activities/IMG_2538.webp',
  '/activities/IMG_2540.webp',
  '/activities/IMG_2541.webp',
  '/activities/IMG_2552.webp',
  '/activities/IMG_2556.webp',
  '/activities/IMG_2562.webp',
  '/activities/IMG_2563.webp',
  '/activities/IMG_2568.webp',
]

const ITEM_WIDTH = 192 // w-48
const GAP = 16 // gap-4
const TOTAL_WIDTH = activities.length * (ITEM_WIDTH + GAP) // 14 images * (192 + 16) = 2912px

export function ActivitiesCard() {
  return (
    <div className="relative w-full overflow-hidden bg-card border border-primary/20 rounded-xl p-6">
      <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-${TOTAL_WIDTH}px); }
        }
        .activities-scroll {
          animation: scroll-left 45s linear infinite;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>

      {/* Fade overlays - solid gradients for better performance */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

      <div className="activities-scroll flex gap-4">
        {/* Original set */}
        {activities.map((src, idx) => (
          <div
            key={`original-${idx}`}
            className="relative h-32 w-48 flex-shrink-0 rounded-lg overflow-hidden border border-primary/10 hover:border-primary/40 transition-colors group"
          >
            <Image
              src={src}
              alt={`Activity ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="192px"
              priority={idx < 3}
            />
          </div>
        ))}

        {/* Duplicate set for seamless loop */}
        {activities.map((src, idx) => (
          <div
            key={`duplicate-${idx}`}
            className="relative h-32 w-48 flex-shrink-0 rounded-lg overflow-hidden border border-primary/10 hover:border-primary/40 transition-colors group"
          >
            <Image
              src={src}
              alt={`Activity ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="192px"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">Aktivitas Komunitas Kami</p>
      </div>
    </div>
  )
}
