import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, Edit3, Clock, User } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared Contacts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage contacts shared with you and by you</p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('with-me')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'with-me'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Shared With Me ({sharedWithMe.length})
          </button>
          <button
            onClick={() => setActiveTab('by-me')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'by-me'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Shared By Me ({sharedByMe.length})
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === 'with-me' ? (
        <div className="space-y-4">
          {sharedWithMe.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No shared contacts</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                When someone shares a contact with you, it will appear here.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sharedWithMe.map((share) => (
                <Card
                  key={share.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/shared-contact/${share.contactId}`)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={share.contactName} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {share.contactName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                      <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
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
            <Card className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No contacts shared</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You haven't shared any contacts yet. Share a contact from the contact detail page.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sharedByMe.map((share) => (
                <Card key={share.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={share.contactName} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {share.contactName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Shared with {share.sharedWithName || share.sharedWithEmail}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={share.permission === 'VIEW_ADD' ? 'success' : 'default'}>
                          {share.permission === 'VIEW_ADD' ? 'Can Add Notes' : 'View Only'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Expires: {formatExpiry(share.expiresAt)}
                      </p>
                      <button
                        onClick={() => handleRevokeShare(share.id)}
                        className="mt-3 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
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
  );
}
