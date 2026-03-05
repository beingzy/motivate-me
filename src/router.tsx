import { createBrowserRouter } from 'react-router-dom'
import AuthGate from './components/AuthGate'
import AppShell from './components/ui/AppShell'
import Dashboard from './pages/Dashboard'
import HabitList from './pages/HabitList'
import CreateHabit from './pages/CreateHabit'
import EditHabit from './pages/EditHabit'
import LogAction from './pages/LogAction'
import Rewards from './pages/Rewards'
import CreateReward from './pages/CreateReward'
import RewardDetail from './pages/RewardDetail'
import History from './pages/History'
import Notifications from './pages/Notifications'
import Monitors from './pages/Monitors'
import MonitorDashboard from './pages/MonitorDashboard'
import AcceptInvite from './pages/AcceptInvite'
import EditProfile from './pages/EditProfile'
import Me from './pages/Me'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGate><AppShell /></AuthGate>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'habits', element: <HabitList /> },
      { path: 'habits/new', element: <CreateHabit /> },
      { path: 'habits/:id/edit', element: <EditHabit /> },
      { path: 'log', element: <LogAction /> },
      { path: 'rewards', element: <Rewards /> },
      { path: 'rewards/new', element: <CreateReward /> },
      { path: 'rewards/:id', element: <RewardDetail /> },
      { path: 'history', element: <History /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'monitors', element: <Monitors /> },
      { path: 'monitor/:userId', element: <MonitorDashboard /> },
      { path: 'invite/:token', element: <AcceptInvite /> },
      { path: 'profile/edit', element: <EditProfile /> },
      { path: 'me', element: <Me /> },
    ],
  },
])
