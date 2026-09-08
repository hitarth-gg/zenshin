import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import EpisodeCatalogNotice from '../EpisodeCatalogNotice'

describe('EpisodeCatalogNotice', () => {
  it('renders the actionable catalog state and exposes its kind', () => {
    const html = renderToStaticMarkup(
      <EpisodeCatalogNotice
        notice={{
          kind: 'rate-limited',
          message:
            'Episode mapping is rate limited. Showing verified fallback episodes; retry later.'
        }}
      />
    )

    expect(html).toContain('role="status"')
    expect(html).toContain('data-catalog-state="rate-limited"')
    expect(html).toContain('verified fallback episodes')
    expect(html).toContain('retry later')
  })

  it('renders nothing when the catalog has no warning state', () => {
    expect(renderToStaticMarkup(<EpisodeCatalogNotice notice={null} />)).toBe('')
  })
})
