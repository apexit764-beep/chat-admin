import { create } from 'zustand';
import type {
  Agent,
  Campaign,
  Channel,
  Contact,
  Conversation,
  Department,
  Integration,
  Message,
  Notification,
  Template,
  WidgetConfig,
} from '@/types';
import {
  agents as initialAgents,
  campaigns as initialCampaigns,
  channels as initialChannels,
  contacts as initialContacts,
  conversations as initialConversations,
  departments as initialDepartments,
  integrations as initialIntegrations,
  notifications as initialNotifications,
  templates as initialTemplates,
  widgetConfig as initialWidgetConfig,
} from './mockData';

interface DataState {
  currentUserId: string;
  agents: Agent[];
  contacts: Contact[];
  conversations: Conversation[];
  templates: Template[];
  campaigns: Campaign[];
  notifications: Notification[];
  channels: Channel[];
  departments: Department[];
  integrations: Integration[];
  widgetConfig: WidgetConfig;
  whatsappConnected: boolean;

  // Conversation actions
  sendMessage: (conversationId: string, content: string) => void;
  assignConversation: (conversationId: string, agentId: string | null) => void;
  setConversationStatus: (conversationId: string, status: Conversation['status']) => void;
  markConversationRead: (conversationId: string) => void;
  addNote: (conversationId: string, note: string) => void;

  // Contact actions
  addContact: (c: Omit<Contact, 'id' | 'conversationCount' | 'lastContact' | 'createdAt' | 'tags' | 'blocked'>) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Template actions
  addTemplate: (t: Omit<Template, 'id' | 'usageCount' | 'createdAt'>) => void;
  updateTemplate: (id: string, patch: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;

  // Agent actions
  addAgent: (a: Omit<Agent, 'id' | 'lastActive' | 'status'>) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  // Campaign actions
  addCampaign: (c: Omit<Campaign, 'id' | 'sentCount' | 'openRate' | 'createdAt'>) => void;

  // Channel actions
  addChannel: (c: Omit<Channel, 'id' | 'createdAt' | 'unreadCount'>) => void;
  updateChannel: (id: string, patch: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;

  // Department actions
  addDepartment: (d: Omit<Department, 'id' | 'createdAt'>) => void;
  updateDepartment: (id: string, patch: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Integration
  toggleIntegration: (id: string) => void;

  // Widget config
  updateWidgetConfig: (patch: Partial<WidgetConfig>) => void;

  // Notifications
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;

  // Tags / bookmarks
  addContactTag: (contactId: string, tag: string) => void;
  removeContactTag: (contactId: string, tag: string) => void;
  toggleBookmark: (conversationId: string) => void;
  bookmarkedConvIds: Set<string>;

  // Attachments
  sendAttachment: (conversationId: string, type: 'image' | 'document', name: string, dataUrl?: string) => void;
}

const newId = (): string => Math.random().toString(36).slice(2, 10);

export const useDataStore = create<DataState>((set) => ({
  currentUserId: 'a1',
  agents: initialAgents,
  contacts: initialContacts,
  conversations: initialConversations,
  templates: initialTemplates,
  campaigns: initialCampaigns,
  notifications: initialNotifications,
  channels: initialChannels,
  departments: initialDepartments,
  integrations: initialIntegrations,
  widgetConfig: initialWidgetConfig,
  whatsappConnected: true,

  sendMessage: (conversationId, content) =>
    set((state) => {
      const message: Message = {
        id: newId(),
        conversationId,
        direction: 'out',
        type: 'text',
        content,
        timestamp: new Date().toISOString(),
        read: true,
        delivered: true,
      };
      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                lastMessage: content,
                lastMessageAt: message.timestamp,
              }
            : c
        ),
      };
    }),

  assignConversation: (conversationId, agentId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, assignedTo: agentId } : c
      ),
    })),

  setConversationStatus: (conversationId, status) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, status } : c
      ),
    })),

  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      ),
    })),

  addNote: (conversationId, note) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, notes: [...c.notes, note] } : c
      ),
    })),

  addContact: (c) =>
    set((state) => ({
      contacts: [
        {
          ...c,
          id: newId(),
          tags: [],
          blocked: false,
          conversationCount: 0,
          lastContact: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        ...state.contacts,
      ],
    })),

  updateContact: (id, patch) =>
    set((state) => ({ contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

  deleteContact: (id) =>
    set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),

  addTemplate: (t) =>
    set((state) => ({
      templates: [
        { ...t, id: newId(), usageCount: 0, createdAt: new Date().toISOString() },
        ...state.templates,
      ],
    })),

  updateTemplate: (id, patch) =>
    set((state) => ({ templates: state.templates.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

  deleteTemplate: (id) =>
    set((state) => ({ templates: state.templates.filter((t) => t.id !== id) })),

  addAgent: (a) =>
    set((state) => ({
      agents: [...state.agents, { ...a, id: newId(), status: 'offline', lastActive: new Date().toISOString() }],
    })),

  updateAgent: (id, patch) =>
    set((state) => ({ agents: state.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),

  deleteAgent: (id) =>
    set((state) => ({ agents: state.agents.filter((a) => a.id !== id) })),

  addCampaign: (c) =>
    set((state) => ({
      campaigns: [
        { ...c, id: newId(), sentCount: 0, openRate: 0, createdAt: new Date().toISOString() },
        ...state.campaigns,
      ],
    })),

  addChannel: (c) =>
    set((state) => ({
      channels: [
        ...state.channels,
        { ...c, id: newId(), unreadCount: 0, createdAt: new Date().toISOString() },
      ],
    })),

  updateChannel: (id, patch) =>
    set((state) => ({ channels: state.channels.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

  deleteChannel: (id) =>
    set((state) => ({ channels: state.channels.filter((c) => c.id !== id) })),

  addDepartment: (d) =>
    set((state) => ({
      departments: [
        ...state.departments,
        { ...d, id: newId(), createdAt: new Date().toISOString() },
      ],
    })),

  updateDepartment: (id, patch) =>
    set((state) => ({ departments: state.departments.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),

  deleteDepartment: (id) =>
    set((state) => ({ departments: state.departments.filter((d) => d.id !== id) })),

  toggleIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === id
          ? { ...i, connected: !i.connected, lastSync: !i.connected ? new Date().toISOString() : i.lastSync }
          : i
      ),
    })),

  updateWidgetConfig: (patch) =>
    set((state) => ({ widgetConfig: { ...state.widgetConfig, ...patch } })),

  markAllNotificationsRead: () =>
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

  clearNotifications: () => set({ notifications: [] }),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  // Tags
  addContactTag: (contactId, tag) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === contactId && !c.tags.includes(tag) ? { ...c, tags: [...c.tags, tag] } : c
      ),
    })),

  removeContactTag: (contactId, tag) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === contactId ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c
      ),
    })),

  // Bookmarks
  bookmarkedConvIds: new Set<string>(),
  toggleBookmark: (conversationId) =>
    set((state) => {
      const next = new Set(state.bookmarkedConvIds);
      if (next.has(conversationId)) next.delete(conversationId);
      else next.add(conversationId);
      return { bookmarkedConvIds: next };
    }),

  // Attachments
  sendAttachment: (conversationId, type, name) =>
    set((state) => {
      const message: Message = {
        id: newId(),
        conversationId,
        direction: 'out',
        type,
        content: name,
        timestamp: new Date().toISOString(),
        read: true,
        delivered: true,
      };
      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                lastMessage: type === 'image' ? `📷 صورة: ${name}` : `📎 ملف: ${name}`,
                lastMessageAt: message.timestamp,
              }
            : c
        ),
      };
    }),
}));
