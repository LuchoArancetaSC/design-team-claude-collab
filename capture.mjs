import { chromium } from 'playwright'

const BASE    = 'http://localhost:5173'
const AUTH_JS = `sessionStorage.setItem('sc_auth', 'true')`
const W = 1440
const H = 900

const CAPTURES = [
  // ── OPS: Learning Paths ──────────────────────────────────────────
  { path: '/academy/admin/paths',          file: 'screenshots/ops-learning-paths/01-list.png' },
  { path: '/academy/admin/paths/new',      file: 'screenshots/ops-learning-paths/02-new-path.png' },
  { path: '/academy/admin/paths/new/edit', file: 'screenshots/ops-learning-paths/03-composer.png' },
  { path: '/academy/admin/paths/1',        file: 'screenshots/ops-learning-paths/04-detail.png' },

  // ── OPS: Learners ────────────────────────────────────────────────
  { path: '/academy/admin/learners',       file: 'screenshots/ops-learners/01-list.png' },
  { path: '/academy/admin/learners/1',     file: 'screenshots/ops-learners/02-detail.png' },
  { path: '/academy/admin/learners/enrol', file: 'screenshots/ops-learners/03-enrol.png' },

  // ── DSP: Sessions ────────────────────────────────────────────────
  { path: '/academy/sessions',             file: 'screenshots/dsp-sessions/01-list.png' },
  { path: '/academy/sessions/1',           file: 'screenshots/dsp-sessions/02-detail.png' },

  // ── DSP: Learners ────────────────────────────────────────────────
  { path: '/academy/learners',             file: 'screenshots/dsp-learners/01-list.png' },
  { path: '/academy/learners/1',           file: 'screenshots/dsp-learners/02-detail.png' },
  { path: '/academy/learners/enrol',       file: 'screenshots/dsp-learners/03-enrol.png' },
]

async function capture() {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: W, height: H } })
  const page    = await context.newPage()

  // Seed auth once so it persists across navigations in the same context
  await page.goto(BASE)
  await page.evaluate(AUTH_JS)

  for (const { path, file } of CAPTURES) {
    const url = `${BASE}${path}`
    console.log(`  → ${file}`)

    await page.goto(url, { waitUntil: 'domcontentloaded' })

    // If redirected to /login, seed auth and retry
    if (page.url().includes('/login')) {
      await page.evaluate(AUTH_JS)
      await page.goto(url, { waitUntil: 'domcontentloaded' })
    }

    // Wait for React to mount — poll until #root has children
    await page.waitForFunction(
      () => document.getElementById('root')?.childElementCount > 0,
      { timeout: 12000, polling: 100 }
    )

    // Then wait for the main content selector
    await page.waitForSelector('.page-body, .app-layout', { timeout: 8000 })
      .catch(() => {})

    // Settle time for transitions
    await page.waitForTimeout(500)

    await page.screenshot({ path: file, fullPage: false })
  }

  await browser.close()
}

capture()
  .then(() => {
    console.log('\n✅  All screenshots captured.\n')

    // List generated files with sizes
    import('fs').then(({ statSync, readdirSync }) => {
      const dirs = [
        'screenshots/ops-learning-paths',
        'screenshots/ops-learners',
        'screenshots/dsp-sessions',
        'screenshots/dsp-learners',
      ]
      dirs.forEach(dir => {
        const files = readdirSync(dir)
        files.forEach(f => {
          const fullPath = `${dir}/${f}`
          const { size } = statSync(fullPath)
          const kb = (size / 1024).toFixed(1)
          console.log(`  ${fullPath}  (${kb} KB)`)
        })
      })
    })
  })
  .catch(err => {
    console.error('❌  Capture failed:', err.message)
    process.exit(1)
  })
