import { useState } from 'react';
import { Modal, Button, Input, Select } from '../ui';
import { useShareStore } from '../../store/shareStore';

interface ShareContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  contactName: string;
}

export default function ShareContactModal({ isOpen, onClose, contactId, contactName }: ShareContactModalProps) {
  const { shareContact, isLoading } = useShareStore();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('VIEW');
  const [expiresIn, setExpiresIn] = useState('never');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    let expiresAt: string | undefined;
    if (expiresIn !== 'never') {
      const days = parseInt(expiresIn);
      const date = new Date();
      date.setDate(date.getDate() + days);
      expiresAt = date.toISOString();
    }

    try {
      await shareContact(contactId, email, permission, expiresAt, note || undefined);
      onClose();
      setEmail('');
      setPermission('VIEW');
      setExpiresIn('never');
      setNote('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to share contact');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${contactName}"`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <Input
          label="Recipient Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email of user to share with"
          required
        />

        <Select
          label="Permission"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          options={[
            { value: 'VIEW', label: 'View Only' },
            { value: 'VIEW_ADD', label: 'View + Add Notes' },
          ]}
        />

        <Select
          label="Expires"
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value)}
          options={[
            { value: 'never', label: 'Never' },
            { value: '7', label: 'In 7 days' },
            { value: '30', label: 'In 30 days' },
            { value: '90', label: 'In 90 days' },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the recipient"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sharing...' : 'Share Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
