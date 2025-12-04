import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Sidebar />
      <main className="lg:ml-72 transition-[margin] duration-300">
        <div className="min-h-screen p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
