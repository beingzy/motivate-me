import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'docs', 'screenshots');

const FONT_LINK = `<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>`;
const TAILWIND = `<script src="https://cdn.tailwindcss.com"></script>`;
const BASE_STYLE = `<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f1f5f9; margin: 0; }
  .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 24px; }
</style>`;

function wrap(inner) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>${FONT_LINK}${TAILWIND}${BASE_STYLE}</head><body><div class="max-w-md mx-auto min-h-screen bg-slate-100">${inner}</div></body></html>`;
}

// ── Screen HTML templates ──

const dashboardHTML = wrap(`
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="px-6 pt-8 pb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="size-11 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #D35400">YZ</div>
        <div>
          <p class="text-xs text-slate-400 font-medium">Good morning</p>
          <p class="text-lg font-bold text-slate-900">Yi Zhang</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <span class="material-symbols-outlined text-slate-400">notifications</span>
          <div class="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</div>
        </div>
      </div>
    </header>

    <!-- Points Banner -->
    <div class="mx-6 p-5 rounded-2xl bg-gradient-to-br from-[#D35400] to-[#B84700] text-white mb-6" style="box-shadow: 0 8px 24px rgba(211,84,0,0.3)">
      <p class="text-sm font-medium opacity-80">Available Points</p>
      <p class="text-4xl font-bold mt-1">1,280</p>
      <div class="flex items-center gap-2 mt-2">
        <span class="material-symbols-outlined text-sm">local_fire_department</span>
        <span class="text-sm font-semibold">12 day streak</span>
      </div>
    </div>

    <!-- Today's Habits -->
    <div class="px-6 mb-3 flex justify-between items-center">
      <h2 class="text-lg font-bold text-slate-900">Today's Habits</h2>
      <span class="text-xs text-slate-400 font-medium">4/6 done</span>
    </div>

    <div class="px-6 space-y-3 pb-4">
      <!-- Completed habit -->
      <div class="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
        <div class="size-11 rounded-xl bg-emerald-100 flex items-center justify-center">
          <span class="material-symbols-outlined text-emerald-500">check_circle</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-900">Morning Run</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="h-1.5 flex-1 bg-emerald-100 rounded-full"><div class="h-full w-[71%] bg-emerald-400 rounded-full"></div></div>
            <span class="text-[10px] text-emerald-600 font-medium">5/7</span>
          </div>
        </div>
        <span class="text-xs font-bold text-emerald-500">+15 pts</span>
      </div>

      <!-- Completed habit -->
      <div class="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
        <div class="size-11 rounded-xl bg-emerald-100 flex items-center justify-center">
          <span class="material-symbols-outlined text-emerald-500">check_circle</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-900">Read 30 minutes</p>
          <div class="flex items-center gap-2 mt-1">
            <div class="h-1.5 flex-1 bg-emerald-100 rounded-full"><div class="h-full w-[100%] bg-emerald-400 rounded-full"></div></div>
            <span class="text-[10px] text-emerald-600 font-medium">7/7</span>
          </div>
        </div>
        <span class="text-xs font-bold text-emerald-500">+10 pts</span>
      </div>

      <!-- Unchecked habit with inline panel expanded -->
      <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div class="p-4 flex items-center gap-4">
          <div class="size-11 rounded-xl bg-slate-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-400">radio_button_unchecked</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">Meditate</p>
            <p class="text-xs text-slate-400">10 pts · <span class="material-symbols-outlined text-xs align-middle">photo_camera</span> Photo required</p>
          </div>
        </div>
        <div class="bg-slate-50 px-4 py-3 border-t border-slate-100 space-y-3">
          <textarea placeholder="Add a note (optional)..." rows="2" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none outline-none"></textarea>
          <button class="w-full py-2.5 bg-[#D35400] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style="box-shadow: 0 4px 12px rgba(211,84,0,0.25)">
            <span class="material-symbols-outlined text-lg">check</span> Log It · +10 pts
          </button>
        </div>
      </div>

      <!-- Unchecked habit -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
        <div class="size-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <span class="material-symbols-outlined text-slate-400">radio_button_unchecked</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-900">Practice Guitar</p>
          <p class="text-xs text-slate-400">20 pts</p>
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div class="mt-auto bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center">
      <div class="flex flex-col items-center gap-1 text-[#D35400]"><span class="material-symbols-outlined text-xl">home</span><span class="text-[10px] font-medium">Home</span></div>
      <div class="flex flex-col items-center gap-1 text-slate-400"><span class="material-symbols-outlined text-xl">checklist</span><span class="text-[10px]">Habits</span></div>
      <div class="-mt-6"><div class="size-14 rounded-full bg-[#D35400] flex items-center justify-center shadow-lg" style="box-shadow: 0 6px 20px rgba(211,84,0,0.4)"><span class="material-symbols-outlined text-white text-2xl">add</span></div></div>
      <div class="flex flex-col items-center gap-1 text-slate-400"><span class="material-symbols-outlined text-xl">redeem</span><span class="text-[10px]">Rewards</span></div>
      <div class="flex flex-col items-center gap-1 text-slate-400"><span class="material-symbols-outlined text-xl">person</span><span class="text-[10px]">Me</span></div>
    </div>
  </div>
`);

const habitListHTML = wrap(`
  <div class="flex flex-col min-h-screen">
    <header class="px-6 pt-8 pb-4">
      <h1 class="text-3xl font-bold tracking-tight">My Habits</h1>
      <p class="text-sm text-slate-400 mt-1">6 active habits</p>
    </header>
    <main class="px-6 space-y-3 pb-24">
      ${[
        { name: 'Morning Run', pts: 15, freq: '5/7', pct: 71, icon: 'directions_run', photo: true, approval: false },
        { name: 'Read 30 minutes', pts: 10, freq: '7/7', pct: 100, icon: 'menu_book', photo: false, approval: false },
        { name: 'Meditate', pts: 10, freq: '3/7', pct: 43, icon: 'self_improvement', photo: true, approval: false },
        { name: 'Practice Guitar', pts: 20, freq: '2/7', pct: 29, icon: 'music_note', photo: false, approval: true },
        { name: 'Drink 8 Glasses Water', pts: 5, freq: '6/7', pct: 86, icon: 'water_drop', photo: false, approval: false },
        { name: 'Journal Entry', pts: 10, freq: '4/7', pct: 57, icon: 'edit_note', photo: false, approval: false },
      ].map(h => `
        <div class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div class="size-11 rounded-xl bg-[#D35400]/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-[#D35400]">${h.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-slate-900 truncate">${h.name}</p>
              ${h.photo ? '<span class="material-symbols-outlined text-xs text-slate-300">photo_camera</span>' : ''}
              ${h.approval ? '<span class="material-symbols-outlined text-xs text-slate-300">how_to_reg</span>' : ''}
            </div>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="h-1.5 flex-1 bg-slate-100 rounded-full"><div class="h-full rounded-full ${h.pct >= 100 ? 'bg-emerald-400' : 'bg-[#D35400]'}" style="width: ${h.pct}%"></div></div>
              <span class="text-[10px] font-medium ${h.pct >= 100 ? 'text-emerald-600' : 'text-slate-400'}">${h.freq}</span>
            </div>
          </div>
          <span class="text-xs font-bold text-[#D35400]">${h.pts} pts</span>
        </div>
      `).join('')}
    </main>
  </div>
`);

const rewardsHTML = wrap(`
  <div class="flex flex-col min-h-screen">
    <header class="px-6 pt-8 pb-4">
      <h1 class="text-3xl font-bold tracking-tight">Rewards</h1>
      <div class="flex items-center gap-2 mt-2">
        <span class="material-symbols-outlined text-[#D35400] text-lg">stars</span>
        <span class="text-sm font-semibold text-slate-900">1,280 points available</span>
      </div>
    </header>
    <main class="px-6 space-y-3 pb-24">
      <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Wishlist</h3>

      <!-- Affordable reward -->
      <div class="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3">
        <div class="flex items-center gap-3">
          <div class="size-11 rounded-xl bg-emerald-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-emerald-600">movie</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">Movie Night</p>
            <p class="text-xs text-emerald-600 font-medium">Ready to redeem!</p>
          </div>
          <span class="text-sm font-bold text-emerald-600">500 pts</span>
        </div>
        <div class="h-1.5 bg-emerald-100 rounded-full"><div class="h-full bg-emerald-400 rounded-full w-full"></div></div>
        <button class="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold">Redeem Now</button>
      </div>

      <!-- Progress reward -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 space-y-3">
        <div class="flex items-center gap-3">
          <div class="size-11 rounded-xl bg-[#D35400]/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-[#D35400]">headphones</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">New Headphones</p>
            <p class="text-xs text-slate-400">1,280 / 2,000 pts</p>
          </div>
          <span class="text-sm font-bold text-[#D35400]">2,000 pts</span>
        </div>
        <div class="h-1.5 bg-slate-100 rounded-full"><div class="h-full bg-[#D35400] rounded-full" style="width: 64%"></div></div>
      </div>

      <!-- Far away reward -->
      <div class="bg-white p-4 rounded-2xl border border-slate-100 space-y-3">
        <div class="flex items-center gap-3">
          <div class="size-11 rounded-xl bg-slate-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-slate-400">flight</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900">Weekend Trip</p>
            <p class="text-xs text-slate-400">1,280 / 5,000 pts</p>
          </div>
          <span class="text-sm font-bold text-slate-400">5,000 pts</span>
        </div>
        <div class="h-1.5 bg-slate-100 rounded-full"><div class="h-full bg-slate-300 rounded-full" style="width: 26%"></div></div>
      </div>

      <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-4">Redeemed</h3>
      <div class="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 opacity-60">
        <div class="size-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <span class="material-symbols-outlined text-slate-400">restaurant</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-900">Dinner Out</p>
          <p class="text-xs text-slate-400">Redeemed Feb 28</p>
        </div>
        <span class="material-symbols-outlined text-emerald-400">verified</span>
      </div>
    </main>
  </div>
`);

const profileHTML = wrap(`
  <div class="flex flex-col min-h-screen">
    <header class="px-6 pt-8 pb-6">
      <h1 class="text-3xl font-bold tracking-tight mb-6">Me</h1>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
        <div class="size-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style="background-color: #D35400">YZ</div>
        <div>
          <p class="text-lg font-bold text-slate-900">Yi Zhang</p>
          <p class="text-sm text-slate-400">yi@example.com</p>
        </div>
        <span class="material-symbols-outlined text-slate-300 ml-auto">chevron_right</span>
      </div>
    </header>

    <main class="px-6 space-y-4 pb-24">
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-2xl border border-slate-100 p-4 text-center">
          <p class="text-2xl font-bold text-[#D35400]">1,280</p>
          <p class="text-[10px] text-slate-400 font-medium mt-1">POINTS</p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 p-4 text-center">
          <p class="text-2xl font-bold text-[#D35400]">12</p>
          <p class="text-[10px] text-slate-400 font-medium mt-1">DAY STREAK</p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 p-4 text-center">
          <p class="text-2xl font-bold text-[#D35400]">47</p>
          <p class="text-[10px] text-slate-400 font-medium mt-1">TOTAL LOGS</p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        ${[
          { icon: 'people', label: 'Monitors', sub: '2 monitors connected' },
          { icon: 'history', label: 'Activity History', sub: 'View all logged actions' },
          { icon: 'notifications', label: 'Notifications', sub: '3 unread' },
        ].map((item, i) => `
          <div class="flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-slate-50' : ''}">
            <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-500">${item.icon}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900">${item.label}</p>
              <p class="text-xs text-slate-400">${item.sub}</p>
            </div>
            <span class="material-symbols-outlined text-slate-300">chevron_right</span>
          </div>
        `).join('')}
      </div>
    </main>
  </div>
`);

const createHabitHTML = wrap(`
  <div class="relative w-full min-h-screen bg-slate-200 flex flex-col justify-end">
    <div class="absolute inset-0 p-6 opacity-40 pointer-events-none">
      <div class="space-y-4 mt-16">
        <div class="h-24 w-full rounded-xl bg-white/80"></div>
        <div class="h-24 w-full rounded-xl bg-white/80"></div>
      </div>
    </div>
    <div class="relative w-full bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] flex flex-col pt-2 pb-10">
      <div class="flex justify-center py-3"><div class="h-1.5 w-12 rounded-full bg-slate-200"></div></div>
      <div class="px-8 pt-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[#D35400] font-semibold text-sm tracking-wider uppercase">Motivate Me</span>
          <span class="material-symbols-outlined text-slate-400">close</span>
        </div>
        <h2 class="text-slate-900 text-3xl font-bold tracking-tight">Create Habit</h2>
      </div>
      <div class="px-8 mt-8 space-y-8">
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Habit Title</label>
          <p class="text-3xl font-bold text-slate-900">Morning Yoga</p>
          <div class="h-px w-full bg-slate-100"></div>
        </div>
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description (optional)</label>
          <div class="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-400">20 min session before breakfast</div>
        </div>
        <div class="space-y-3">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Frequency</label>
          <div class="flex gap-2">
            <span class="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-500">No Target</span>
            <span class="px-4 py-2 rounded-full text-sm font-medium bg-[#D35400] text-white">Daily</span>
            <span class="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-500">Custom</span>
          </div>
        </div>
        <div class="flex items-center justify-between p-5 bg-[#FFFAF5] rounded-2xl border border-slate-100">
          <div class="flex items-center gap-4">
            <div class="size-12 flex items-center justify-center bg-[#D35400]/10 rounded-xl">
              <span class="material-symbols-outlined text-[#D35400] text-2xl">stars</span>
            </div>
            <div><p class="text-slate-900 font-bold">Goal Points</p><p class="text-slate-500 text-sm">Reward per completion</p></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100"><span class="material-symbols-outlined text-xl">remove</span></div>
            <span class="text-2xl font-bold text-slate-900 w-16 text-center">15</span>
            <div class="size-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-100"><span class="material-symbols-outlined text-xl">add</span></div>
          </div>
        </div>
        <div class="pt-4">
          <button class="w-full bg-[#D35400] py-5 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2" style="box-shadow: 0 8px 24px rgba(211,84,0,0.3)">
            <span>Create Habit</span>
            <span class="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </div>
`);

const monitorsHTML = wrap(`
  <div class="flex flex-col min-h-screen">
    <header class="px-6 pt-8 pb-2">
      <button class="flex items-center gap-1 text-[#D35400] font-semibold text-sm mb-4">
        <span class="material-symbols-outlined text-lg">arrow_back</span> Back
      </button>
      <h1 class="text-4xl font-bold tracking-tight mb-6">Monitors</h1>
    </header>
    <main class="px-6 space-y-6 pb-8">
      <div class="rounded-2xl p-4 flex items-center gap-4 border bg-emerald-50 border-emerald-200">
        <div class="size-10 rounded-xl flex items-center justify-center bg-emerald-100">
          <span class="material-symbols-outlined text-emerald-600">check_circle</span>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-900">3 invites sent</p>
          <p class="text-xs font-medium text-emerald-600">2 accepted · 1 pending</p>
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
              <p class="text-xs text-slate-400">Created 3/1/2026 · 5d ago · Tap to copy link</p>
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
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #2E86C1">JD</div>
              <div><p class="text-sm font-medium text-slate-900">Jane Doe</p><p class="text-xs text-slate-400">Since 1/15/2026</p></div>
            </div>
            <span class="material-symbols-outlined text-slate-300 rotate-180">expand_more</span>
          </div>
          <div class="px-4 pb-4 pt-0 border-t border-slate-50 space-y-2">
            <div class="flex items-center gap-2 text-xs text-slate-500"><span class="material-symbols-outlined text-sm">person</span><span>Jane Doe</span></div>
            <div class="flex items-center gap-2 text-xs text-slate-500"><span class="material-symbols-outlined text-sm">email</span><span>jane@example.com</span></div>
            <button class="mt-2 text-xs text-red-500 font-semibold">Revoke</button>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #27AE60">Al</div>
              <div><p class="text-sm font-medium text-slate-900">alice_w</p><p class="text-xs text-slate-400">Since 2/5/2026</p></div>
            </div>
            <span class="material-symbols-outlined text-slate-300">expand_more</span>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider">I'm Monitoring</h3>
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #8E44AD">BL</div>
              <div><p class="text-sm font-medium text-slate-900">Bob Lee</p><p class="text-xs text-slate-400">Tap to view details</p></div>
            </div>
            <span class="material-symbols-outlined text-slate-300">expand_more</span>
          </div>
        </div>
      </section>
    </main>
  </div>
`);

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const screens = [
    { name: 'dashboard', html: dashboardHTML },
    { name: 'habits', html: habitListHTML },
    { name: 'rewards', html: rewardsHTML },
    { name: 'create-habit', html: createHabitHTML },
    { name: 'profile', html: profileHTML },
    { name: 'monitors', html: monitorsHTML },
  ];

  for (const s of screens) {
    await page.setContent(s.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // wait for fonts
    const file = path.join(outDir, `${s.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  saved ${s.name}.png`);
  }

  await browser.close();
  console.log(`\nAll screenshots saved to ${outDir}`);
}

run().catch(console.error);
