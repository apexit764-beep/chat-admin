import { create } from 'zustand';
import type {
  AdminUser,
  Client,
  Country,
  Industry,
  Invoice,
  KnowledgeArticle,
  KnowledgeCategory,
  LiveChatConversation,
  LiveChatMessage,
  PaymobConfig,
  Plan,
  PlanRequest,
  PlanRequestStatus,
  Subscription,
  Transaction,
} from '@/types';
import {
  adminUsers as initialAdminUsers,
  clients as initialClients,
  countries as initialCountries,
  invoices as initialInvoices,
  paymobConfig as initialPaymobConfig,
  plans as initialPlans,
  subscriptions as initialSubscriptions,
  transactions as initialTransactions,
  platformStats as initialPlatformStats,
  campaignStats as initialCampaignStats,
  satisfactionStats as initialSatisfactionStats,
  activityLog as initialActivityLog,
  feedbackEntries as initialFeedback,
  liveChatConversations as initialLiveChatConversations,
  knowledgeCategories as initialKnowledgeCategories,
  knowledgeArticles as initialKnowledgeArticles,
  industries as initialIndustries,
  planRequests as initialPlanRequests,
} from './adminMockData';
import type { ActivityEntry, FeedbackEntry } from './adminMockData';

interface AdminState {
  countries: Country[];
  industries: Industry[];
  plans: Plan[];
  clients: Client[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  transactions: Transaction[];
  paymob: PaymobConfig;
  adminUsers: AdminUser[];
  platformStats: typeof initialPlatformStats;
  campaignStats: typeof initialCampaignStats;
  satisfactionStats: typeof initialSatisfactionStats;
  activityLog: ActivityEntry[];
  feedback: FeedbackEntry[];
  liveChatConversations: LiveChatConversation[];
  knowledgeCategories: KnowledgeCategory[];
  knowledgeArticles: KnowledgeArticle[];
  planRequests: PlanRequest[];

  // Plan Request actions
  updatePlanRequestStatus: (id: string, status: PlanRequestStatus) => void;
  deletePlanRequest: (id: string) => void;

  // Knowledge Base actions
  addKnowledgeCategory: (name: string) => KnowledgeCategory;
  updateKnowledgeCategory: (id: string, name: string) => void;
  deleteKnowledgeCategory: (id: string) => void;
  addKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'views' | 'helpful' | 'notHelpful' | 'createdAt' | 'updatedAt' | 'sortOrder'> & { sortOrder?: number }) => KnowledgeArticle;
  updateKnowledgeArticle: (id: string, patch: Partial<KnowledgeArticle>) => void;
  deleteKnowledgeArticle: (id: string) => void;
  moveKnowledgeArticle: (id: string, direction: 'up' | 'down') => void;
  reorderKnowledgeCategory: (id: string, direction: 'up' | 'down') => void;
  moveKnowledgeCategoryTo: (id: string, targetIndex: number) => void;

  // Live Chat actions
  assignLiveChat: (id: string, agentName: string) => void;
  transferLiveChat: (id: string, toAgent: string) => void;
  resolveLiveChat: (id: string) => void;
  sendLiveChatMessage: (conversationId: string, content: string, senderName: string) => void;
  sendLiveChatNote: (conversationId: string, content: string, senderName: string) => void;

  // Feedback actions
  replyToFeedback: (id: string, text: string, author: string) => void;

  // Client actions
  addClient: (c: Omit<Client, 'id' | 'joinedAt' | 'lastActiveAt' | 'subscriptionId' | 'mrr' | 'agentCount' | 'channelCount' | 'conversationCount'>) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  suspendClient: (id: string) => void;
  reactivateClient: (id: string) => void;

  // Plan actions
  addPlan: (p: Omit<Plan, 'id' | 'createdAt'>) => Plan;
  updatePlan: (id: string, patch: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  getClientsOnPlan: (planId: string) => Client[];
  cascadePlanPriceChange: (planId: string, newPrices: Record<string, { monthly: number; yearly: number }>) => number;

  // Country actions
  addCountry: (c: Country) => void;
  updateCountry: (code: string, patch: Partial<Country>) => void;
  deleteCountry: (code: string) => void;

  // Industry actions
  addIndustry: (name: string) => Industry;
  updateIndustry: (id: string, name: string) => void;
  deleteIndustry: (id: string) => void;

  // Subscription actions
  createSubscription: (clientId: string, planId: string, billingCycle: 'monthly' | 'yearly') => Subscription;
  updateSubscription: (id: string, patch: Partial<Subscription>) => void;
  cancelSubscription: (id: string) => void;
  extendSubscription: (id: string, days: number) => void;

  // Invoice / payment actions
  recordPayment: (clientId: string, planId: string, amount: number, currency: string, last4: string) => { invoice: Invoice; transaction: Transaction };
  refundInvoice: (invoiceId: string) => void;

  // Paymob
  updatePaymob: (patch: Partial<PaymobConfig>) => void;

  // Admin users
  addAdminUser: (u: Omit<AdminUser, 'id' | 'lastActive' | 'createdAt'>) => void;
  updateAdminUser: (id: string, patch: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
}

const newId = (prefix: string): string => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-ء-ي]/g, '');

const hydratedArticles: KnowledgeArticle[] = (initialKnowledgeArticles as Array<Partial<KnowledgeArticle> & { title: string; content: string }>).map((a, i) => ({
  id: a.id ?? `ka_${i}`,
  title: a.title,
  content: a.content,
  categoryId: a.categoryId ?? '',
  status: a.status ?? 'draft',
  views: a.views ?? 0,
  helpful: a.helpful ?? 0,
  notHelpful: a.notHelpful ?? 0,
  createdAt: a.createdAt ?? new Date().toISOString(),
  updatedAt: a.updatedAt ?? new Date().toISOString(),
  slug: a.slug ?? slugify(a.title),
  sortOrder: a.sortOrder ?? i + 1,
  metaTitle: a.metaTitle ?? a.title,
  metaDescription: a.metaDescription ?? a.content.slice(0, 155),
}));

export const useAdminStore = create<AdminState>((set, get) => ({
  countries: initialCountries,
  industries: initialIndustries,
  plans: initialPlans,
  clients: initialClients,
  subscriptions: initialSubscriptions,
  invoices: initialInvoices,
  transactions: initialTransactions,
  paymob: initialPaymobConfig,
  adminUsers: initialAdminUsers,
  platformStats: initialPlatformStats,
  campaignStats: initialCampaignStats,
  satisfactionStats: initialSatisfactionStats,
  activityLog: initialActivityLog,
  feedback: initialFeedback,
  liveChatConversations: initialLiveChatConversations,
  knowledgeCategories: initialKnowledgeCategories,
  knowledgeArticles: hydratedArticles,
  planRequests: initialPlanRequests,

  replyToFeedback: (id, text, author) =>
    set((s) => ({
      feedback: s.feedback.map((f) => {
        if (f.id !== id || f.type !== 'complaint') return f;
        const reply = { id: `fr_${id}_${Date.now()}`, text, author, timestamp: new Date().toISOString() };
        return { ...f, status: 'replied' as const, replies: [reply], reply: text, repliedBy: author, repliedAt: reply.timestamp };
      }),
    })),

  updatePlanRequestStatus: (id, status) =>
    set((s) => ({ planRequests: s.planRequests.map((r) => (r.id === id ? { ...r, status } : r)) })),

  deletePlanRequest: (id) =>
    set((s) => ({ planRequests: s.planRequests.filter((r) => r.id !== id) })),

  addKnowledgeCategory: (name) => {
    const slug = name.replace(/\s+/g, '-').toLowerCase();
    const cat: KnowledgeCategory = {
      id: newId('kc'),
      name,
      slug,
      articleCount: 0,
      order: get().knowledgeCategories.length + 1,
    };
    set((s) => ({ knowledgeCategories: [...s.knowledgeCategories, cat] }));
    return cat;
  },

  updateKnowledgeCategory: (id, name) =>
    set((s) => ({
      knowledgeCategories: s.knowledgeCategories.map((c) =>
        c.id === id ? { ...c, name, slug: name.replace(/\s+/g, '-').toLowerCase() } : c
      ),
    })),

  deleteKnowledgeCategory: (id) =>
    set((s) => ({
      knowledgeCategories: s.knowledgeCategories.filter((c) => c.id !== id),
      knowledgeArticles: s.knowledgeArticles.filter((a) => a.categoryId !== id),
    })),

  addKnowledgeArticle: (article) => {
    const now = new Date().toISOString();
    const maxOrder = get().knowledgeArticles
      .filter((a) => a.categoryId === article.categoryId)
      .reduce((m, a) => Math.max(m, a.sortOrder ?? 0), 0);
    const a: KnowledgeArticle = {
      ...article,
      id: newId('ka'),
      views: 0,
      helpful: 0,
      notHelpful: 0,
      sortOrder: article.sortOrder ?? maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({
      knowledgeArticles: [a, ...s.knowledgeArticles],
      knowledgeCategories: s.knowledgeCategories.map((c) =>
        c.id === article.categoryId ? { ...c, articleCount: c.articleCount + 1 } : c
      ),
    }));
    return a;
  },

  updateKnowledgeArticle: (id, patch) =>
    set((s) => ({
      knowledgeArticles: s.knowledgeArticles.map((a) =>
        a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
      ),
    })),

  deleteKnowledgeArticle: (id) =>
    set((s) => {
      const article = s.knowledgeArticles.find((a) => a.id === id);
      return {
        knowledgeArticles: s.knowledgeArticles.filter((a) => a.id !== id),
        knowledgeCategories: s.knowledgeCategories.map((c) =>
          c.id === article?.categoryId ? { ...c, articleCount: Math.max(0, c.articleCount - 1) } : c
        ),
      };
    }),

  moveKnowledgeArticle: (id, direction) =>
    set((s) => {
      const current = s.knowledgeArticles.find((a) => a.id === id);
      if (!current) return s;
      const siblings = s.knowledgeArticles
        .filter((a) => a.categoryId === current.categoryId)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const idx = siblings.findIndex((a) => a.id === id);
      const swapWith = direction === 'up' ? siblings[idx - 1] : siblings[idx + 1];
      if (!swapWith) return s;
      return {
        knowledgeArticles: s.knowledgeArticles.map((a) => {
          if (a.id === current.id) return { ...a, sortOrder: swapWith.sortOrder };
          if (a.id === swapWith.id) return { ...a, sortOrder: current.sortOrder };
          return a;
        }),
      };
    }),

  reorderKnowledgeCategory: (id, direction) =>
    set((s) => {
      const sorted = [...s.knowledgeCategories].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapWith = direction === 'up' ? sorted[idx - 1] : sorted[idx + 1];
      if (!swapWith) return s;
      return {
        knowledgeCategories: s.knowledgeCategories.map((c) => {
          if (c.id === id) return { ...c, order: swapWith.order };
          if (c.id === swapWith.id) return { ...c, order: sorted[idx].order };
          return c;
        }),
      };
    }),

  moveKnowledgeCategoryTo: (id, targetIndex) =>
    set((s) => {
      const sorted = [...s.knowledgeCategories].sort((a, b) => a.order - b.order);
      const fromIndex = sorted.findIndex((c) => c.id === id);
      if (fromIndex === -1 || fromIndex === targetIndex) return s;
      const clamped = Math.max(0, Math.min(sorted.length - 1, targetIndex));
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(clamped, 0, moved);
      const orderById = new Map(sorted.map((c, i) => [c.id, i + 1]));
      return {
        knowledgeCategories: s.knowledgeCategories.map((c) => ({
          ...c,
          order: orderById.get(c.id) ?? c.order,
        })),
      };
    }),

  assignLiveChat: (id, agentName) =>
    set((s) => ({
      liveChatConversations: s.liveChatConversations.map((c) =>
        c.id === id ? { ...c, status: 'assigned', assignedTo: agentName } : c
      ),
    })),

  transferLiveChat: (id, toAgent) =>
    set((s) => {
      const now = new Date().toISOString();
      return {
        liveChatConversations: s.liveChatConversations.map((c) => {
          if (c.id !== id) return c;
          const note: LiveChatMessage = {
            id: `lm_${Math.random().toString(36).slice(2, 10)}`,
            conversationId: id,
            sender: 'note',
            senderName: 'النظام',
            content: `تم تحويل المحادثة من ${c.assignedTo ?? 'غير معين'} إلى ${toAgent}`,
            timestamp: now,
          };
          return { ...c, assignedTo: toAgent, status: 'assigned', messages: [...c.messages, note], lastMessageAt: now };
        }),
      };
    }),

  resolveLiveChat: (id) =>
    set((s) => ({
      liveChatConversations: s.liveChatConversations.map((c) =>
        c.id === id ? { ...c, status: 'resolved' } : c
      ),
    })),

  sendLiveChatMessage: (conversationId, content, senderName) =>
    set((s) => {
      const now = new Date().toISOString();
      const msg: LiveChatMessage = {
        id: `lm_${Math.random().toString(36).slice(2, 10)}`,
        conversationId,
        sender: 'agent',
        senderName,
        content,
        timestamp: now,
      };
      return {
        liveChatConversations: s.liveChatConversations.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, msg], lastMessageAt: now }
            : c
        ),
      };
    }),

  sendLiveChatNote: (conversationId, content, senderName) =>
    set((s) => {
      const now = new Date().toISOString();
      const note: LiveChatMessage = {
        id: `lm_${Math.random().toString(36).slice(2, 10)}`,
        conversationId,
        sender: 'note',
        senderName,
        content,
        timestamp: now,
      };
      return {
        liveChatConversations: s.liveChatConversations.map((c) =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, note] }
            : c
        ),
      };
    }),


  addClient: (c) => {
    const client: Client = {
      ...c,
      id: newId('client'),
      subscriptionId: null,
      mrr: 0,
      agentCount: 0,
      channelCount: 0,
      conversationCount: 0,
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    set((s) => ({ clients: [client, ...s.clients] }));
    return client;
  },

  updateClient: (id, patch) =>
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

  deleteClient: (id) =>
    set((s) => ({
      clients: s.clients.filter((c) => c.id !== id),
      subscriptions: s.subscriptions.filter((sub) => sub.clientId !== id),
      invoices: s.invoices.filter((inv) => inv.clientId !== id),
      transactions: s.transactions.filter((t) => t.clientId !== id),
    })),

  suspendClient: (id) =>
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, status: 'suspended' } : c)) })),

  reactivateClient: (id) =>
    set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, status: 'active' } : c)) })),

  addPlan: (p) => {
    const plan: Plan = { ...p, id: newId('plan'), createdAt: new Date().toISOString() };
    set((s) => ({ plans: [...s.plans, plan] }));
    return plan;
  },

  updatePlan: (id, patch) =>
    set((s) => ({ plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

  deletePlan: (id) =>
    set((s) => ({
      plans: s.plans.filter((p) => p.id !== id),
      subscriptions: s.subscriptions.map((sub) =>
        sub.planId === id ? { ...sub, status: 'cancelled' as const, cancelAt: new Date().toISOString() } : sub
      ),
    })),

  getClientsOnPlan: (planId) => {
    return get().clients.filter((c) => c.planId === planId);
  },

  cascadePlanPriceChange: (planId, newPrices) => {
    const { subscriptions, clients } = get();
    let affected = 0;
    const updatedSubs = subscriptions.map((sub) => {
      if (sub.planId !== planId || sub.status === 'cancelled') return sub;
      const client = clients.find((c) => c.id === sub.clientId);
      if (!client) return sub;
      const countryPrices = newPrices[client.country];
      if (!countryPrices) return sub;
      const newAmount = sub.billingCycle === 'yearly' ? countryPrices.yearly : countryPrices.monthly;
      if (newAmount !== sub.amount) {
        affected++;
        return { ...sub, amount: newAmount };
      }
      return sub;
    });
    const updatedClients = clients.map((c) => {
      if (c.planId !== planId) return c;
      const sub = updatedSubs.find((s) => s.id === c.subscriptionId);
      if (!sub || sub.status === 'cancelled') return c;
      const newMrr = sub.billingCycle === 'monthly' ? sub.amount : sub.amount / 12;
      return { ...c, mrr: newMrr };
    });
    set({ subscriptions: updatedSubs, clients: updatedClients });
    return affected;
  },

  addCountry: (c) =>
    set((s) => ({ countries: [...s.countries.filter((x) => x.code !== c.code), c] })),

  updateCountry: (code, patch) =>
    set((s) => ({ countries: s.countries.map((c) => (c.code === code ? { ...c, ...patch } : c)) })),

  deleteCountry: (code) =>
    set((s) => ({ countries: s.countries.filter((c) => c.code !== code) })),

  addIndustry: (name) => {
    const ind: Industry = { id: newId('ind'), name };
    set((s) => ({ industries: [...s.industries, ind] }));
    return ind;
  },

  updateIndustry: (id, name) =>
    set((s) => ({ industries: s.industries.map((i) => (i.id === id ? { ...i, name } : i)) })),

  deleteIndustry: (id) =>
    set((s) => ({ industries: s.industries.filter((i) => i.id !== id) })),

  createSubscription: (clientId, planId, billingCycle) => {
    const client = get().clients.find((c) => c.id === clientId);
    const plan = get().plans.find((p) => p.id === planId);
    if (!client || !plan) throw new Error('client or plan not found');
    const price = plan.pricesPerCountry[client.country];
    const amount = billingCycle === 'yearly' ? price.yearly : price.monthly;
    const sub: Subscription = {
      id: newId('sub'),
      clientId,
      planId,
      status: 'active',
      billingCycle,
      amount,
      currency: client.currency,
      startedAt: new Date().toISOString(),
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 86400000).toISOString(),
    };
    set((s) => ({
      subscriptions: [...s.subscriptions, sub],
      clients: s.clients.map((c) =>
        c.id === clientId
          ? { ...c, planId, subscriptionId: sub.id, status: 'active', mrr: billingCycle === 'monthly' ? amount : amount / 12, currency: client.currency }
          : c
      ),
    }));
    return sub;
  },

  updateSubscription: (id, patch) =>
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...patch } : sub
      ),
    })),

  cancelSubscription: (id) =>
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: 'cancelled', cancelAt: new Date().toISOString() } : sub
      ),
    })),

  extendSubscription: (id, days) =>
    set((s) => ({
      subscriptions: s.subscriptions.map((sub) => {
        if (sub.id !== id) return sub;
        const end = new Date(sub.currentPeriodEnd);
        const newEnd = new Date(end.getTime() + days * 24 * 60 * 60 * 1000);
        return { ...sub, currentPeriodEnd: newEnd.toISOString(), status: 'active' as const };
      }),
    })),

  recordPayment: (clientId, planId, amount, currency, last4) => {
    const client = get().clients.find((c) => c.id === clientId);
    const plan = get().plans.find((p) => p.id === planId);
    if (!client || !plan) throw new Error('client or plan not found');
    const number = `INV-2026-${String(get().invoices.length + 1).padStart(5, '0')}`;
    const tax = Math.round(amount * 0.05);
    const total = amount + tax;
    const invoice: Invoice = {
      id: newId('inv'),
      number,
      clientId,
      subscriptionId: client.subscriptionId ?? undefined,
      invoiceType: 'subscription',
      amount,
      tax,
      total,
      currency,
      status: 'paid',
      dueDate: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      items: [{ description: `اشتراك ${plan.nameAr} — شهري`, quantity: 1, unitPrice: amount, total: amount }],
      createdAt: new Date().toISOString(),
    };
    const transaction: Transaction = {
      id: newId('txn'),
      invoiceId: invoice.id,
      clientId,
      amount: total,
      currency,
      status: 'succeeded',
      method: 'visa',
      last4,
      paymobOrderId: `pmb_ord_${Math.random().toString(36).slice(2, 10)}`,
      paymobTransactionId: `pmb_txn_${Math.random().toString(36).slice(2, 12)}`,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      invoices: [invoice, ...s.invoices],
      transactions: [transaction, ...s.transactions],
    }));
    return { invoice, transaction };
  },

  refundInvoice: (invoiceId) => {
    set((s) => ({
      invoices: s.invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'failed' as const } : inv)),
      transactions: s.transactions.map((t) => (t.invoiceId === invoiceId ? { ...t, status: 'refunded' as const } : t)),
    }));
  },

  updatePaymob: (patch) => set((s) => ({ paymob: { ...s.paymob, ...patch } })),

  addAdminUser: (u) =>
    set((s) => ({
      adminUsers: [
        ...s.adminUsers,
        { ...u, id: newId('au'), lastActive: new Date().toISOString(), createdAt: new Date().toISOString() },
      ],
    })),

  updateAdminUser: (id, patch) =>
    set((s) => ({ adminUsers: s.adminUsers.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),

  deleteAdminUser: (id) =>
    set((s) => ({ adminUsers: s.adminUsers.filter((u) => u.id !== id) })),
}));
