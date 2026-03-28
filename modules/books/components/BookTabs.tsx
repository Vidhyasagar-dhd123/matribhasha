'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import OverviewTab from './OverviewTab'
import ReadTab from './ReadTab'
import LanguageTab from './LanguageTab'
import ReviewTab from './ReviewTab'
import ActivityTab from './ActivityTab'

type TabKey =
  | 'overview'
  | 'read'
  | 'languages'
  | 'reviews'
  | 'activity'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'read', label: 'Read' },
  { key: 'languages', label: 'Languages & Versions' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'activity', label: 'Activity' },
]

export default function BookTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab =
    (searchParams.get('tab') as TabKey) ?? 'overview'

  const setTab = useCallback(
    (tab: TabKey) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', tab)

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
    },
    [router, pathname, searchParams]
  )

  return (
    <div>
      {/* TAB LIST */}
      <div
        role="tablist"
        className="flex overflow-x-auto max-w-full"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setTab(key)}
            className={`py-3 px-4  font-medium transition cursor-pointer text-sm md:text-md
              ${
                activeTab === key
                  ? '   rounded-t border-t border-t-primary bg-background'
                  : ' hover:border-t hover:bg-background'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="pt-6 max-w-full p-4 rounded-b-lg shadow-md bg-background">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'read' && <ReadTab />}
        {activeTab === 'languages' && <LanguageTab />}
        {activeTab === 'reviews' && <ReviewTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </div>
    </div>
  )
}
