import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="min-h-screen pb-20 lg:pb-0">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
