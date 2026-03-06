import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'test-logs', 'monitors-deep-test');

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Monitors Test</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9; }
  .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 24px; }
</style>
</head>
<body>
<div id="app" class="max-w-md mx-auto min-h-screen bg-slate-100"></div>
<script>
const app = document.getElementById('app');

// ── Scenario 1: Full page with all sections ──
function renderFullPage() {
  app.innerHTML = \`
    <div class="flex flex-col min-h-full">
      <header class="px-6 pt-8 pb-2">
        <button class="flex items-center gap-1 text-[#D35400] font-semibold text-sm mb-4">
          <span class="material-symbols-outlined text-lg">arrow_back</span> Back
        </button>
        <h1 class="text-4xl font-bold tracking-tight mb-6">Monitors</h1>
      </header>
      <main class="px-6 space-y-6 pb-8">

        <!-- Summary Stats (green — has accepted) -->
        <div class="rounded-2xl p-4 flex items-center gap-4 border bg-emerald-50 border-emerald-200">
          <div class="size-10 rounded-xl flex items-center justify-center bg-emerald-100">
            <span class="material-symbols-outlined text-emerald-600">check_circle</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900">4 invites sent</p>
            <p class="text-xs font-medium text-emerald-600">2 accepted · 2 pending</p>
          </div>
        </div>

        <!-- Invite Section -->
        <section class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <button class="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style="box-shadow: 0 4px 12px rgba(211,84,0,0.3)">
            <span class="material-symbols-outlined text-lg">person_add</span> Invite a Monitor
          </button>
          <div class="space-y-2">
            <div class="flex gap-2">
              <input type="email" placeholder="Friend's email address" class="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none"/>
              <button disabled class="px-4 py-2 bg-[#D35400] text-white rounded-lg text-xs font-semibold opacity-40 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">send</span> Send Invite
              </button>
            </div>
          </div>
        </section>

        <!-- Pending Invites -->
        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Invites</h3>

          <!-- Normal pending card -->
          <div class="relative bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-amber-600">hourglass_top</span>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Waiting for acceptance</p>
                <p class="text-xs text-slate-400">Created 3/1/2026 · 5d ago</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-slate-300">content_copy</span>
              <button class="text-xs text-red-500 font-semibold">Cancel</button>
            </div>
          </div>

          <!-- Just-copied card -->
          <div class="relative bg-white p-4 rounded-2xl border border-emerald-300 bg-emerald-50 flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-emerald-600">check</span>
              </div>
              <div>
                <p class="text-sm font-medium text-emerald-700">Link copied!</p>
                <p class="text-xs text-slate-400">Share it with your friend</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
              <button class="text-xs text-red-500 font-semibold">Cancel</button>
            </div>
          </div>
        </section>

        <!-- People Monitoring Me -->
        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">People Monitoring Me</h3>

          <!-- Collapsed monitor card -->
          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button class="w-full p-4 flex items-center justify-between text-left">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #2E86C1">JD</div>
                <div>
                  <p class="text-sm font-medium text-slate-900">Jane Doe</p>
                  <p class="text-xs text-slate-400">Since 1/15/2026</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-300">expand_more</span>
            </button>
          </div>

          <!-- Expanded monitor card -->
          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button class="w-full p-4 flex items-center justify-between text-left">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #27AE60">Al</div>
                <div>
                  <p class="text-sm font-medium text-slate-900">alice_w</p>
                  <p class="text-xs text-slate-400">Since 2/5/2026</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-300 rotate-180">expand_more</span>
            </button>
            <div class="px-4 pb-4 pt-0 border-t border-slate-50 space-y-2">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-symbols-outlined text-sm">person</span>
                <span>Alice Wang</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-symbols-outlined text-sm">email</span>
                <span>alice@example.com</span>
              </div>
              <button class="mt-2 text-xs text-red-500 font-semibold">Revoke</button>
            </div>
          </div>
        </section>

        <!-- I'm Monitoring -->
        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">I'm Monitoring</h3>

          <!-- Collapsed -->
          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button class="w-full p-4 flex items-center justify-between text-left">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #8E44AD">BL</div>
                <div>
                  <p class="text-sm font-medium text-slate-900">Bob Lee</p>
                  <p class="text-xs text-slate-400">Tap to view details</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-300">expand_more</span>
            </button>
          </div>

          <!-- Expanded -->
          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button class="w-full p-4 flex items-center justify-between text-left">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #D35400">\u5F20</div>
                <div>
                  <p class="text-sm font-medium text-slate-900">\u5F20\u4F1F</p>
                  <p class="text-xs text-slate-400">Tap to view details</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-300 rotate-180">expand_more</span>
            </button>
            <div class="px-4 pb-4 pt-0 border-t border-slate-50 space-y-2">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-symbols-outlined text-sm">person</span>
                <span>\u5F20\u4F1F</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-symbols-outlined text-sm">email</span>
                <span>zhangwei@example.com</span>
              </div>
              <a href="#" class="inline-flex items-center gap-1 mt-2 text-xs text-[#D35400] font-semibold">
                <span class="material-symbols-outlined text-sm">monitoring</span> View Dashboard
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  \`;
}

// ── Scenario 2: Summary stats — amber (no accepted) ──
function renderAmberSummary() {
  app.innerHTML = \`
    <div class="flex flex-col">
      <header class="px-6 pt-8 pb-2">
        <h1 class="text-4xl font-bold tracking-tight mb-6">Monitors</h1>
      </header>
      <main class="px-6 space-y-6 pb-8">
        <div class="rounded-2xl p-4 flex items-center gap-4 border bg-amber-50 border-amber-200">
          <div class="size-10 rounded-xl flex items-center justify-center bg-amber-100">
            <span class="material-symbols-outlined text-amber-600">hourglass_top</span>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900">2 invites sent</p>
            <p class="text-xs font-medium text-amber-600">0 accepted · 2 pending</p>
          </div>
        </div>

        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Invites</h3>
          <div class="relative bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-amber-600">hourglass_top</span>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Waiting for acceptance</p>
                <p class="text-xs text-slate-400">Created 3/3/2026 · 3d ago</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-slate-300">content_copy</span>
              <button class="text-xs text-red-500 font-semibold">Cancel</button>
            </div>
          </div>
          <div class="relative bg-white p-4 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-amber-600">hourglass_top</span>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Waiting for acceptance</p>
                <p class="text-xs text-slate-400">Created 3/5/2026 · 1d ago</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm text-slate-300">content_copy</span>
              <button class="text-xs text-red-500 font-semibold">Cancel</button>
            </div>
          </div>
        </section>

        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">People Monitoring Me</h3>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 text-center">
            <p class="text-sm text-slate-400">No monitors yet. Invite someone to get started.</p>
          </div>
        </section>

        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">I'm Monitoring</h3>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 text-center">
            <p class="text-sm text-slate-400">You're not monitoring anyone yet.</p>
          </div>
        </section>
      </main>
    </div>
  \`;
}

// ── Scenario 3: Empty state ──
function renderEmptyState() {
  app.innerHTML = \`
    <div class="flex flex-col">
      <header class="px-6 pt-8 pb-2">
        <h1 class="text-4xl font-bold tracking-tight mb-6">Monitors</h1>
      </header>
      <main class="px-6 space-y-6 pb-8">
        <section class="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <button class="w-full py-3 bg-[#D35400] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2" style="box-shadow: 0 4px 12px rgba(211,84,0,0.3)">
            <span class="material-symbols-outlined text-lg">person_add</span> Invite a Monitor
          </button>
        </section>
        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">People Monitoring Me</h3>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 text-center">
            <p class="text-sm text-slate-400">No monitors yet. Invite someone to get started.</p>
          </div>
        </section>
        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">I'm Monitoring</h3>
          <div class="bg-white p-6 rounded-2xl border border-slate-100 text-center">
            <p class="text-sm text-slate-400">You're not monitoring anyone yet.</p>
          </div>
        </section>
      </main>
    </div>
  \`;
}

window.__renderFullPage = renderFullPage;
window.__renderAmberSummary = renderAmberSummary;
window.__renderEmptyState = renderEmptyState;

// Start with full page
renderFullPage();
</script>
</body>
</html>`;

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 size
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Load the HTML
  await page.setContent(HTML, { waitUntil: 'networkidle' });
  // Wait for fonts
  await page.waitForTimeout(2000);

  // Screenshot 1: Full page with all sections
  await page.evaluate(() => window.__renderFullPage());
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '01-full-page-all-sections.png'), fullPage: true });
  console.log('  saved 01-full-page-all-sections.png');

  // Screenshot 2: Amber summary (no accepted monitors)
  await page.evaluate(() => window.__renderAmberSummary());
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '02-amber-summary-no-accepted.png'), fullPage: true });
  console.log('  saved 02-amber-summary-no-accepted.png');

  // Screenshot 3: Empty state
  await page.evaluate(() => window.__renderEmptyState());
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '03-empty-state.png'), fullPage: true });
  console.log('  saved 03-empty-state.png');

  // Screenshot 4: Copy animation on pending invite — go back to full page, show the copied state
  await page.evaluate(() => window.__renderFullPage());
  await page.waitForTimeout(500);
  // The second pending card is already in "copied" state in our HTML
  await page.screenshot({ path: path.join(outDir, '04-pending-invite-copy-animation.png'), fullPage: false });
  console.log('  saved 04-pending-invite-copy-animation.png');

  // Screenshot 5: Monitoring me — expanded card detail
  await page.evaluate(() => window.__renderFullPage());
  await page.waitForTimeout(500);
  // Scroll to the expanded "People Monitoring Me" section
  await page.evaluate(() => {
    const el = document.querySelector('[class*="rotate-180"]');
    if (el) el.closest('section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '05-monitoring-me-expanded-detail.png'), fullPage: false });
  console.log('  saved 05-monitoring-me-expanded-detail.png');

  // Screenshot 6: I'm monitoring — expanded card with CJK avatar
  await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const lastSection = sections[sections.length - 1];
    if (lastSection) lastSection.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, '06-im-monitoring-expanded-cjk-avatar.png'), fullPage: false });
  console.log('  saved 06-im-monitoring-expanded-cjk-avatar.png');

  await browser.close();
  console.log(`\nAll screenshots saved to ${outDir}`);
}

run().catch(console.error);
