import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Card, Button, Modal, Input, Select, Textarea } from '../components/ui';
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
      custom: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
    };
    return colors[type.toLowerCase()] || colors.custom;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[hsl(var(--background))] px-4 py-3 border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium text-[hsl(var(--primary))]">Templates</span>
            </div>
            <h1 className="text-xl font-bold">Message Templates</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Create and manage pre-filled message templates</p>
          </div>
          <Button size="sm" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
          </div>
        ) : templates.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-[hsl(var(--muted-foreground))] mb-3" />
              <h3 className="font-medium">No templates yet</h3>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                Create message templates for quick communication with your contacts.
              </p>
              <Button onClick={() => handleOpenModal()} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Create First Template
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="p-4 hover-lift transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getTypeColor(template.type)}`}>
                      {getTypeLabel(template.type)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(template)}
                      className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                  {template.content}
                </p>
                <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                  Use {'{name}'} to insert contact name
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTemplate ? 'Edit Template' : 'New Template'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 p-4 text-sm text-[hsl(var(--destructive))] animate-fade-in flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--destructive))]" />
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
          >
            <option value="FOLLOWUP">Follow-up</option>
            <option value="BIRTHDAY">Birthday</option>
            <option value="ANNIVERSARY">Anniversary</option>
            <option value="CUSTOM">Custom</option>
          </Select>

          <Textarea
            label="Message Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Hi {name}, I wanted to reach out..."
            rows={5}
          />
          <p className="text-xs text-[hsl(var(--muted-foreground))] -mt-2">
            Use {'{name}'} as a placeholder for the contact's name
          </p>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
