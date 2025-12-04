import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Card, Button, Modal, Input, Select } from '../components/ui';
import { useTemplateStore } from '../store/templateStore';
import type { MessageTemplate } from '../types';

export default function Templates() {
  const { templates, fetchTemplates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useTemplateStore();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'CUSTOM', content: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenModal = (template?: MessageTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({ name: template.name, type: template.type.toUpperCase(), content: template.content });
    } else {
      setEditingTemplate(null);
      setFormData({ name: '', type: 'CUSTOM', content: '' });
    }
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.content) {
      setError('Name and content are required');
      return;
    }

    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData.name, formData.type, formData.content);
      } else {
        await createTemplate(formData.name, formData.type, formData.content);
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save template');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      followup: 'Follow-up',
      birthday: 'Birthday',
      anniversary: 'Anniversary',
      custom: 'Custom',
    };
    return labels[type.toLowerCase()] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      followup: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      birthday: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      anniversary: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      custom: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    };
    return colors[type.toLowerCase()] || colors.custom;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage pre-filled message templates</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No templates yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Create message templates for quick communication with your contacts.
          </p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create First Template
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getTypeColor(template.type)}`}>
                    {getTypeLabel(template.type)}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(template)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {template.content}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Use {'{name}'} to insert contact name
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTemplate ? 'Edit Template' : 'New Template'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            label="Template Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Quick Follow-up"
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'FOLLOWUP', label: 'Follow-up' },
              { value: 'BIRTHDAY', label: 'Birthday' },
              { value: 'ANNIVERSARY', label: 'Anniversary' },
              { value: 'CUSTOM', label: 'Custom' },
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Hi {name}, I wanted to reach out..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              rows={5}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Use {'{name}'} as a placeholder for the contact's name
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
