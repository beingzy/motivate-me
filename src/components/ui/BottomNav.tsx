import { NavLink, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'home', exact: true },
  { path: '/habits', label: 'Habits', icon: 'bolt', exact: false },
  { path: '/log', label: '', icon: 'add', isFab: true, exact: false },
  { path: '/rewards', label: 'Rewards', icon: 'redeem', exact: false },
  { path: '/me', label: 'Me', icon: 'person', exact: false },
]

export default function BottomNav() {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50">
      <div
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl px-2 h-20 flex items-center justify-around"
        style={{ boxShadow: '0 8px 32px rgba(211,84,0,0.12)' }}
      >
        {NAV_ITEMS.map((item) =>
          item.isFab ? (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label="Log a habit"
              className="relative -mt-10 size-16 rounded-full bg-[#D35400] text-white flex items-center justify-center border-4 border-[#FFFAF5] transition-transform hover:scale-105 active:scale-95 fab-shadow"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 w-14 transition-colors ${
                  isActive ? 'text-[#D35400]' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{
                      fontVariationSettings: isActive
                        ? "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24"
                        : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
    </nav>
  )
}
