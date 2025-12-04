import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './ui';

export function PWAReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96 animate-slide-up">
      <div className="bg-[hsl(var(--card))] rounded-2xl shadow-strong border border-[hsl(var(--border))] p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">Update Available</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
              A new version is available. Reload to update.
            </p>
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={close}
          >
            Later
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => updateServiceWorker(true)}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
