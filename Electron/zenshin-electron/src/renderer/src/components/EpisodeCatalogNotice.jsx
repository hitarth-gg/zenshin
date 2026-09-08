/* eslint-disable react/prop-types */
export default function EpisodeCatalogNotice({ notice }) {
  if (!notice) return null

  return (
    <div
      role="status"
      data-catalog-state={notice.kind}
      className="mt-3 border border-amber-500/40 bg-amber-950/20 px-3 py-2 font-space-mono text-xs text-amber-200"
    >
      {notice.message}
    </div>
  )
}
