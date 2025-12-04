import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, Edit3, Clock, User, Share2 } from 'lucide-react';
import { Card, Badge, Avatar } from '../components/ui';
import { useShareStore } from '../store/shareStore';
import { formatDistanceToNow } from 'date-fns';

export default function SharedWithMe() {
  const navigate = useNavigate();
  const { sharedWithMe, sharedByMe, fetchSharedWithMe, fetchSharedByMe, revokeShare, isLoading } = useShareStore();
  const [activeTab, setActiveTab] = useState<'with-me' | 'by-me'>('with-me');

  useEffect(() => {
    fetchSharedWithMe();
    fetchSharedByMe();
  }, [fetchSharedWithMe, fetchSharedByMe]);

  const handleRevokeShare = async (shareId: string) => {
    if (window.confirm('Are you sure you want to revoke this share?')) {
      await revokeShare(shareId);
    }
  };

  const formatExpiry = (expiresAt?: string) => {
    if (!expiresAt) return 'Never';
    const date = new Date(expiresAt);
    if (date < new Date()) return 'Expired';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[hsl(var(--background))] px-4 py-3 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2 mb-1">
          <Share2 className="h-5 w-5 text-[hsl(var(--primary))]" />
          <span className="text-sm font-medium text-[hsl(var(--primary))]">Sharing</span>
        </div>
        <h1 className="text-xl font-bold">Shared Contacts</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Manage contacts shared with you and by you</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('with-me')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'with-me'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
            }`}
          >
            Shared With Me ({sharedWithMe.length})
          </button>
          <button
            onClick={() => setActiveTab('by-me')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'by-me'
                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-md'
                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
            }`}
          >
            Shared By Me ({sharedByMe.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
          </div>
        ) : activeTab === 'with-me' ? (
          <div className="space-y-4">
            {sharedWithMe.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3" />
                <h3 className="font-medium">No shared contacts</h3>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  When someone shares a contact with you, it will appear here.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sharedWithMe.map((share) => (
                  <Card
                    key={share.id}
                    className="p-4 cursor-pointer hover:shadow-md hover-lift transition-all"
                    onClick={() => navigate(`/shared-contact/${share.contactId}`)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={share.contactName} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {share.contactName}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Shared by {share.ownerName}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={share.permission === 'VIEW_ADD' ? 'success' : 'default'}>
                            {share.permission === 'VIEW_ADD' ? (
                              <><Edit3 className="h-3 w-3 mr-1" /> Can Add Notes</>
                            ) : (
                              <><Eye className="h-3 w-3 mr-1" /> View Only</>
                            )}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: {formatExpiry(share.expiresAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sharedByMe.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3" />
                <h3 className="font-medium">No contacts shared</h3>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  You haven't shared any contacts yet. Share a contact from the contact detail page.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sharedByMe.map((share) => (
                  <Card key={share.id} className="p-4 hover-lift transition-all">
                    <div className="flex items-start gap-3">
                      <Avatar name={share.contactName} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {share.contactName}
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Shared with {share.sharedWithName || share.sharedWithEmail}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={share.permission === 'VIEW_ADD' ? 'success' : 'default'}>
                            {share.permission === 'VIEW_ADD' ? 'Can Add Notes' : 'View Only'}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires: {formatExpiry(share.expiresAt)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevokeShare(share.id);
                          }}
                          className="mt-3 text-sm text-[hsl(var(--destructive))] hover:underline"
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
