/**
 * محتوى صفحات المزايا كما هو على الموقع — مولَّد، لا تعدّله يدوياً.
 * المصدر: qhub-site (2026-10-12T09:14:49.609Z)
 * إعادة التوليد: node scripts/import-site-content.mjs <content-seed.json>
 */
import type { FeatureCard, FeaturePage } from '@/types/siteContent';

export const featureCardsSeed: FeatureCard[] = [
  {
    "slug": "unified-inbox",
    "title": {
      "ar": "المحادثات الموحدة",
      "en": "Unified Inbox"
    },
    "blurb": {
      "ar": "كل محادثات عملائك في Inbox واحد",
      "en": "Every channel in one place"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "inbox"
    }
  },
  {
    "slug": "ai-assistant",
    "title": {
      "ar": "مساعد الذكاء الاصطناعي",
      "en": "AI Assistant"
    },
    "blurb": {
      "ar": "ردود فورية، مع فهم للسياق وطريقة كلام العميل",
      "en": "Instant replies that read the context"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "sparkles"
    }
  },
  {
    "slug": "campaigns",
    "title": {
      "ar": "الحملات التسويقية",
      "en": "Campaigns"
    },
    "blurb": {
      "ar": "إنشاء وإرسال وإدارة الحملات من مكان واحد",
      "en": "WhatsApp and email campaigns in one place"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "megaphone"
    }
  },
  {
    "slug": "team",
    "title": {
      "ar": "إدارة الفريق والصلاحيات",
      "en": "Team & Permissions"
    },
    "blurb": {
      "ar": "تنظيم المحادثات وتوزيعها على الفريق",
      "en": "Roles, departments and working hours"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "users"
    }
  },
  {
    "slug": "analytics",
    "title": {
      "ar": "التقارير والتحليلات",
      "en": "Reports & Analytics"
    },
    "blurb": {
      "ar": "بيانات واضحة لمتابعة أداء فريقك",
      "en": "Reply time and team performance"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "chart"
    }
  },
  {
    "slug": "chat-widget",
    "title": {
      "ar": "التواصل المباشر (Chat Widget)",
      "en": "Chat Widget"
    },
    "blurb": {
      "ar": "تواصل مباشر مع زوار موقعك",
      "en": "A live chat widget on the website"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "widget"
    }
  },
  {
    "slug": "integrations",
    "title": {
      "ar": "القنوات والربط",
      "en": "Channels & Integrations"
    },
    "blurb": {
      "ar": "قنوات التواصل ومتجرك في مكان واحد",
      "en": "Your channels and your store in one place"
    },
    "icon": {
      "type": "library",
      "set": "qhub",
      "name": "plug"
    }
  }
];

export const featurePagesSeed: Record<string, FeaturePage> = {
  "unified-inbox": {
    "eyebrow": {
      "ar": "المحادثات الموحدة",
      "en": "Unified Inbox"
    },
    "h1": {
      "ar": "كل محادثات عملائك في مكان واحد",
      "en": "Every customer conversation in one place"
    },
    "highlight": {
      "ar": [
        "محادثات",
        "عملائك"
      ],
      "en": [
        "conversation"
      ]
    },
    "lede": {
      "ar": "بدل التنقّل بين أكثر من منصّة، يجمع Qhub محادثات عملائك في صندوق واحد، لتكون كل محادثة واضحة لفريقك وسهلة المتابعة.",
      "en": "Instead of moving between several platforms, Qhub gathers your customers' conversations into one inbox, so every conversation is clear to your team and easy to follow."
    },
    "heroShot": "inbox",
    "heroRoute": "inbox",
    "heroScene": "merge",
    "bullets": {
      "ar": [
        "كل القنوات في صندوق واحد، بلا تنقّل بين المنصّات",
        "كل محادثة مرتبطة بالموظف المسؤول عنها",
        "معلومات العميل وسياق المحادثة في المكان نفسه"
      ],
      "en": [
        "Every channel in one inbox, with no platform switching",
        "Every conversation tied to the agent who owns it",
        "Customer details and conversation context in the same place"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "محادثاتك مرتّبة، وفريقك على الصفحة نفسها",
        "en": "Your conversations in order, your team on the same page"
      },
      "withoutLabel": {
        "ar": "بدون Qhub",
        "en": "Without Qhub"
      },
      "withLabel": {
        "ar": "مع Qhub",
        "en": "With Qhub"
      },
      "rows": [
        {
          "without": {
            "ar": "محادثات موزّعة بين أكثر من مكان",
            "en": "Conversations spread across more than one place"
          },
          "with": {
            "ar": "كل المحادثات في صندوق واحد",
            "en": "Every conversation in a single inbox"
          }
        },
        {
          "without": {
            "ar": "رسائل قد تضيع وسط الزحام",
            "en": "Messages that get lost in the noise"
          },
          "with": {
            "ar": "حالة كل محادثة واضحة للفريق",
            "en": "The status of every conversation is clear to the team"
          }
        },
        {
          "without": {
            "ar": "صعوبة معرفة من يتابع كل محادثة",
            "en": "Hard to tell who is following each conversation"
          },
          "with": {
            "ar": "كل محادثة مرتبطة بالموظف المسؤول عنها",
            "en": "Every conversation tied to the agent who owns it"
          }
        },
        {
          "without": {
            "ar": "تكرار الأسئلة وضياع سياق العميل",
            "en": "Questions repeated and customer context lost"
          },
          "with": {
            "ar": "معلومات العميل وسياق المحادثة في المكان نفسه",
            "en": "Customer details and conversation context in the same place"
          }
        },
        {
          "without": {
            "ar": "متابعة المحادثات تحتاج أكثر من أداة",
            "en": "Following conversations takes more than one tool"
          },
          "with": {
            "ar": "متابعة سهلة من أول رسالة حتى إغلاق المحادثة",
            "en": "Easy follow-up from the first message to closing the conversation"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "كل محادثة تمرّ بسلاسة",
        "en": "Every conversation moves smoothly"
      },
      "lede": {
        "ar": "أربع لحظات على شاشة الوارد نفسها. اضغط أي خطوة لتنتقل إليها.",
        "en": "Four moments on the same inbox screen. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "تصل الرسالة",
            "en": "The message arrives"
          },
          "body": {
            "ar": "تظهر المحادثة مباشرة في صندوق الوارد مع تفاصيلها.",
            "en": "The conversation appears in the inbox right away, with its details."
          },
          "art": {
            "kind": "rows",
            "active": 0,
            "items": [
              {
                "label": {
                  "ar": "نورة العامري",
                  "en": "Noura Al-Amri"
                },
                "sub": {
                  "ar": "وصلني الطلب، شكراً لكم",
                  "en": "The order arrived, thank you"
                },
                "ch": "whatsapp",
                "badge": {
                  "ar": "2",
                  "en": "2"
                }
              },
              {
                "label": {
                  "ar": "متجر لمسة",
                  "en": "Lamsa Store"
                },
                "sub": {
                  "ar": "كم سعر الباقة الجديدة؟",
                  "en": "How much is the new plan?"
                },
                "ch": "instagram",
                "badge": {
                  "ar": "1",
                  "en": "1"
                }
              },
              {
                "label": {
                  "ar": "خالد الحارثي",
                  "en": "Khalid Al-Harthi"
                },
                "sub": {
                  "ar": "متى يفتح المحل اليوم؟",
                  "en": "What time do you open today?"
                },
                "ch": "messenger"
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تصل للموظف المناسب",
            "en": "It reaches the right agent"
          },
          "body": {
            "ar": "تُوزَّع المحادثة على الموظف المناسب حسب إعدادات فريقك.",
            "en": "The conversation is routed to the right agent according to your team settings."
          },
          "art": {
            "kind": "flow",
            "from": {
              "ar": "محادثة واردة",
              "en": "Incoming chat"
            },
            "to": {
              "ar": [
                "المبيعات",
                "الدعم",
                "الشحن"
              ],
              "en": [
                "Sales",
                "Support",
                "Shipping"
              ]
            }
          }
        },
        {
          "title": {
            "ar": "يبدأ الفريق بالرد",
            "en": "The team starts replying"
          },
          "body": {
            "ar": "كل تفاصيل العميل وسياق المحادثة واضحة أمام الموظف.",
            "en": "Every customer detail and the conversation context sit in front of the agent."
          },
          "art": {
            "kind": "card",
            "title": {
              "ar": "يوسف البوسعيدي",
              "en": "Yousef Al-Busaidi"
            },
            "badge": {
              "ar": "عميل دائم",
              "en": "Returning"
            },
            "rows": [
              {
                "k": {
                  "ar": "آخر طلب",
                  "en": "Last order"
                },
                "v": {
                  "ar": "#4821 — وصل",
                  "en": "#4821 — delivered"
                }
              },
              {
                "k": {
                  "ar": "القناة",
                  "en": "Channel"
                },
                "v": {
                  "ar": "واتساب",
                  "en": "WhatsApp"
                }
              },
              {
                "k": {
                  "ar": "الوسم",
                  "en": "Tag"
                },
                "v": {
                  "ar": "شحن",
                  "en": "Shipping"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تبقى كل التفاصيل محفوظة",
            "en": "Every detail stays saved"
          },
          "body": {
            "ar": "الحالة والملاحظات والتحويلات وسجلّ المحادثة تبقى مرتبطة بها.",
            "en": "Status, notes, transfers and the conversation history stay attached to it."
          },
          "art": {
            "kind": "fields",
            "items": [
              {
                "label": {
                  "ar": "الحالة",
                  "en": "Status"
                },
                "value": {
                  "ar": "مغلقة",
                  "en": "Closed"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "الوسوم",
                  "en": "Tags"
                },
                "value": {
                  "ar": "شحن · استبدال",
                  "en": "Shipping · Exchange"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "السجلّ",
                  "en": "Audit log"
                },
                "value": {
                  "ar": "3 إجراءات",
                  "en": "3 actions"
                },
                "on": true
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "أدوات تساعد فريقك كل يوم",
        "en": "Tools that help your team every day"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "حالات واضحة",
          "en": "Clear statuses"
        },
        "body": {
          "ar": "معرفة حالة كل محادثة في لمحة.",
          "en": "See the status of every conversation at a glance."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "bolt"
        },
        "title": {
          "ar": "تنبيهات التأخير",
          "en": "Overdue alerts"
        },
        "body": {
          "ar": "ظهور المحادثات التي تحتاج إلى متابعة في الوقت المناسب.",
          "en": "Conversations that need following up surface at the right time."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "ردود محفوظة",
          "en": "Saved replies"
        },
        "body": {
          "ar": "الوصول السريع إلى الردود المتكرّرة.",
          "en": "Quick access to the answers you repeat most."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "وسوم وتصنيفات",
          "en": "Tags and categories"
        },
        "body": {
          "ar": "تنظيم المحادثات والوصول إليها بسهولة.",
          "en": "Organise conversations and find them again easily."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "سجلّ كامل",
          "en": "A complete record"
        },
        "body": {
          "ar": "كل تفاصيل المحادثة والتحويلات محفوظة في مكان واحد.",
          "en": "Every conversation detail and transfer is kept in one place."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "title": {
          "ar": "تطبيق للموظفين",
          "en": "Mobile app for agents"
        },
        "body": {
          "ar": "إدارة المحادثات ومتابعتها من الجوال.",
          "en": "Manage and follow conversations from a phone."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "صندوق واحد لكل محادثاتك",
          "en": "One inbox for all your conversations"
        },
        "shot": "inbox",
        "scene": "channel-list",
        "body": {
          "ar": "واجهة واضحة تجمع محادثات فريقك في مكان واحد، مع الوصول إلى تفاصيل العميل ومتابعة حالة كل محادثة بسهولة.",
          "en": "A clear screen that gathers your team's conversations in one place, with access to customer details and easy follow-up on the status of every conversation."
        },
        "points": {
          "ar": [
            "أيقونة القناة على صورة كل عميل",
            "بحث شامل في المحادثات والعملاء",
            "فلاتر جاهزة: المسندة لي، غير المقروءة، المتأخرة",
            "أرشفة تلقائية للمحادثات المغلقة"
          ],
          "en": [
            "The channel logo on each customer's avatar",
            "Search across conversations and customers at once",
            "Ready-made filters: assigned to me, unread, overdue",
            "Automatic archiving for closed conversations"
          ]
        }
      },
      {
        "title": {
          "ar": "تعاون أسهل بين أفراد الفريق",
          "en": "Easier collaboration across the team"
        },
        "shot": "contacts",
        "scene": "team-note",
        "body": {
          "ar": "تنتقل المحادثة بين أعضاء الفريق بسياقها كاملاً، وتبقى الملاحظات الداخلية والتفاصيل المهمّة واضحة لمن يحتاجها.",
          "en": "A conversation moves between team members with its full context, and internal notes and important details stay visible to whoever needs them."
        },
        "points": {
          "ar": [
            "ملاحظة داخلية بجانب تبويب الرسالة",
            "إشارة إلى زميل داخل المحادثة",
            "تنبيه الكتابة المتزامنة",
            "نقل المحادثة بكل سياقها إلى موظف آخر"
          ],
          "en": [
            "An internal note tab beside the message tab",
            "Mention a colleague inside the conversation",
            "Simultaneous-typing warning",
            "Move a conversation to another agent with all its context"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "صندوق وارد يعمل بقنواته الخمس",
      "en": "A working inbox with its five channels"
    },
    "liveHighlight": {
      "ar": [
        "بقنواته",
        "الخمس"
      ],
      "en": [
        "five",
        "channels"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "هل يمكن إدارة أكثر من حساب من الصندوق نفسه؟",
          "en": "Can more than one account be managed from the same inbox?"
        },
        "a": {
          "ar": "نعم، يمكن إدارة الحسابات المرتبطة من صندوق واحد مع وضوح مصدر كل محادثة.",
          "en": "Yes. Connected accounts are managed from a single inbox, with the source of each conversation clearly shown."
        }
      },
      {
        "q": {
          "ar": "هل تظهر المحادثات السابقة؟",
          "en": "Do earlier conversations appear?"
        },
        "a": {
          "ar": "تظهر المحادثات التي تصل بعد الربط، بينما تبقى المحادثات السابقة في منصّاتها الأصلية.",
          "en": "Conversations that arrive after connecting appear in Qhub, while earlier ones stay on their original platforms."
        }
      },
      {
        "q": {
          "ar": "هل يستطيع كل موظف رؤية جميع المحادثات؟",
          "en": "Can every agent see all conversations?"
        },
        "a": {
          "ar": "لا، يمكن تحديد المحادثات والأقسام التي يصل إليها كل موظف.",
          "en": "No. You decide which conversations and departments each agent can reach."
        }
      },
      {
        "q": {
          "ar": "كيف يتم توزيع المحادثات على الفريق؟",
          "en": "How are conversations distributed across the team?"
        },
        "a": {
          "ar": "يمكن تحديد قواعد التوزيع حسب الأقسام وأوقات العمل وحجم المحادثات لكل موظف. ويمكن إعادة الإسناد يدوياً في أي وقت.",
          "en": "Distribution rules can follow departments, working hours and how many conversations each agent is handling. Reassignment is possible manually at any time."
        }
      },
      {
        "q": {
          "ar": "ماذا يحدث خارج ساعات العمل؟",
          "en": "What happens outside working hours?"
        },
        "a": {
          "ar": "يمكن للعميل الحصول على رد تلقائي، وتبقى المحادثة بانتظار الفريق حتى يبدأ وقت العمل.",
          "en": "The customer can receive an automatic reply, and the conversation waits for the team until working hours start."
        }
      },
      {
        "q": {
          "ar": "هل يمكن الوصول إلى المحادثات المغلقة؟",
          "en": "Can closed conversations be reached?"
        },
        "a": {
          "ar": "نعم، تبقى المحادثات محفوظة ويمكن الوصول إليها من خلال البحث وسجلّ العميل.",
          "en": "Yes. Conversations stay saved and can be reached through search and the customer's history."
        }
      }
    ]
  },
  "ai-assistant": {
    "eyebrow": {
      "ar": "مساعد الذكاء الاصطناعي",
      "en": "AI Assistant"
    },
    "h1": {
      "ar": "مساعد ذكي يفهم عملاءك ويرد عليهم تلقائياً",
      "en": "An AI assistant that understands your customers and replies automatically"
    },
    "highlight": {
      "ar": [
        "يفهم",
        "عملاءك"
      ],
      "en": [
        "understands",
        "customers"
      ]
    },
    "lede": {
      "ar": "مساعد يفهم لغات متعدّدة، ويعتمد على معلومات نشاطك لتقديم ردود مناسبة للعملاء، مع تحويل المحادثة لفريقك عند الحاجة.",
      "en": "An assistant that understands several languages and draws on your business information to give customers suitable answers, handing the conversation to your team when needed."
    },
    "heroShot": "ai-settings",
    "heroRoute": "ai-settings",
    "heroScene": "knowledge",
    "bullets": {
      "ar": [
        "إجابات مبنية على معلومات نشاطك",
        "فهم لغات متعدّدة وطريقة كلام العميل",
        "تحويل المحادثة لفريقك عند الحاجة"
      ],
      "en": [
        "Answers built on your business information",
        "Understands several languages and how the customer writes",
        "Hands the conversation to your team when needed"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "ردود تفهم العميل، لا مجرّد ردود جاهزة",
        "en": "Replies that understand the customer, not just canned answers"
      },
      "withoutLabel": {
        "ar": "بدون مساعد ذكي",
        "en": "Without an assistant"
      },
      "withLabel": {
        "ar": "مع مساعد Qhub",
        "en": "With the Qhub assistant"
      },
      "rows": [
        {
          "without": {
            "ar": "العميل ينتظر حتى يتوفّر أحد من الفريق",
            "en": "The customer waits until someone on the team is free"
          },
          "with": {
            "ar": "ردود سريعة على الأسئلة المتكرّرة",
            "en": "Quick replies to the questions asked most"
          }
        },
        {
          "without": {
            "ar": "تكرار الإجابات نفسها طوال اليوم",
            "en": "The same answers repeated all day long"
          },
          "with": {
            "ar": "إجابات مبنية على معلومات نشاطك",
            "en": "Answers built on your business information"
          }
        },
        {
          "without": {
            "ar": "اختلاف الردود من موظف لآخر",
            "en": "Answers differ from one agent to another"
          },
          "with": {
            "ar": "تجربة متناسقة مع كل عميل",
            "en": "A consistent experience for every customer"
          }
        },
        {
          "without": {
            "ar": "صعوبة التعامل مع اختلاف اللغات وطريقة الكلام",
            "en": "Different languages and writing styles are hard to handle"
          },
          "with": {
            "ar": "فهم لغات متعدّدة وطريقة كلام العميل",
            "en": "Understands several languages and how the customer writes"
          }
        },
        {
          "without": {
            "ar": "المحادثات التي تحتاج قراراً بشرياً تبقى معلّقة",
            "en": "Conversations that need a human decision stay pending"
          },
          "with": {
            "ar": "تحويل المحادثة لفريقك عند الحاجة",
            "en": "The conversation is handed to your team when needed"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "من سؤال العميل إلى ردّ موثوق",
        "en": "From the customer's question to a reliable answer"
      },
      "lede": {
        "ar": "أربع لحظات على شاشة إعدادات المساعد. اضغط أي خطوة لتنتقل إليها.",
        "en": "Four moments on the assistant settings screen. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "معلومات نشاطك",
            "en": "Your business information"
          },
          "body": {
            "ar": "يستند إلى معلومات نشاطك، مثل المنتجات والأسعار والسياسات، لتقديم ردود مناسبة ودقيقة.",
            "en": "It draws on your business information — products, prices and policies — to give accurate, relevant replies."
          },
          "art": {
            "kind": "flow",
            "merge": true,
            "from": {
              "ar": "قاعدة المعرفة",
              "en": "Knowledge base"
            },
            "to": {
              "ar": [
                "المنتجات",
                "السياسات",
                "الأسعار"
              ],
              "en": [
                "Products",
                "Policies",
                "Pricing"
              ]
            }
          }
        },
        {
          "title": {
            "ar": "أسلوب يناسب علامتك",
            "en": "A style that suits your brand"
          },
          "body": {
            "ar": "نبرة المساعد قابلة للتخصيص لتتناسب مع أسلوب التواصل الخاص بنشاطك.",
            "en": "The assistant's tone can be customised to match how your business talks to customers."
          },
          "art": {
            "kind": "fields",
            "items": [
              {
                "label": {
                  "ar": "النبرة",
                  "en": "Tone"
                },
                "value": {
                  "ar": "ودّية",
                  "en": "Friendly"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "اللهجة",
                  "en": "Dialect"
                },
                "value": {
                  "ar": "تلقائية",
                  "en": "Automatic"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "مواضيع ممنوعة",
                  "en": "Blocked topics"
                },
                "value": {
                  "ar": "الاسترداد",
                  "en": "Refunds"
                },
                "on": true
              }
            ]
          }
        },
        {
          "title": {
            "ar": "ردود تلقائية",
            "en": "Automatic replies"
          },
          "body": {
            "ar": "الأسئلة المتكرّرة تحصل على إجابات سريعة، حتى خارج أوقات العمل.",
            "en": "The questions asked most get quick answers, even outside working hours."
          },
          "art": {
            "kind": "chat",
            "turns": [
              {
                "from": "customer",
                "text": {
                  "ar": "عندكم العرض لسا متاح؟",
                  "en": "Is the offer still on?"
                }
              },
              {
                "from": "ai",
                "text": {
                  "ar": "نعم، خصم ‎25% حتى منتصف ليلة الغد.",
                  "en": "Yes — ‎25% off until midnight tomorrow."
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تحويل ذكي إلى الموظف",
            "en": "A smart handoff to an agent"
          },
          "body": {
            "ar": "عند الحاجة لتدخّل بشري، تنتقل المحادثة للموظف المناسب مع كامل سياقها.",
            "en": "When human help is needed, the conversation moves to the right agent with its full context."
          },
          "art": {
            "kind": "chat",
            "turns": [
              {
                "from": "customer",
                "text": {
                  "ar": "أبغى أستبدل قطعة وصلت مكسورة",
                  "en": "I need to exchange a piece that arrived broken"
                }
              },
              {
                "from": "note",
                "text": {
                  "ar": "تجاوز الحدّ — تحويل إلى منال مع ملخّص",
                  "en": "Beyond its limit — handed to Manal with a summary"
                }
              },
              {
                "from": "agent",
                "text": {
                  "ar": "أهلاً، أنا منال. راجعت طلبك وسنرسل البديل اليوم.",
                  "en": "Hi, this is Manal. I checked your order and we will send the replacement today."
                }
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "ضبط المساعد والتحكّم في ردوده",
        "en": "Tuning the assistant and its replies"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "ردود فورية على مدار الساعة",
          "en": "Instant replies, around the clock"
        },
        "body": {
          "ar": "إجابات سريعة للعملاء، حتى خارج ساعات العمل.",
          "en": "Quick answers for customers, even outside working hours."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "قاعدة معرفة من معلومات نشاطك",
          "en": "A knowledge base from your own information"
        },
        "body": {
          "ar": "ردود مبنية على منتجاتك وخدماتك وسياساتك، بدلاً من الاعتماد على معلومات عامة.",
          "en": "Replies built on your products, services and policies rather than on generic information."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "title": {
          "ar": "تحويل تلقائي إلى موظف",
          "en": "Automatic handoff to an agent"
        },
        "body": {
          "ar": "عند الحاجة إلى تدخّل بشري، تنتقل المحادثة للموظف المناسب مع كامل سياقها.",
          "en": "When human help is needed, the conversation moves to the right agent with its full context."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "megaphone"
        },
        "title": {
          "ar": "نبرة ردّ قابلة للتخصيص",
          "en": "Adjustable reply tone"
        },
        "body": {
          "ar": "أسلوب ردّ يتناسب مع طبيعة علامتك وطريقة تواصلك مع العملاء.",
          "en": "A reply style that matches your brand and how you talk to customers."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "تفريغ الرسائل الصوتية",
          "en": "Voice message transcription"
        },
        "body": {
          "ar": "تحويل الرسائل الصوتية إلى نص لتسهيل قراءتها والتعامل معها.",
          "en": "Voice messages are turned into text, easier to read and act on."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "plug"
        },
        "title": {
          "ar": "تحسين الردود",
          "en": "Replies that keep improving"
        },
        "body": {
          "ar": "الاستفادة من المحادثات السابقة لتحسين جودة الردود مع الوقت.",
          "en": "Past conversations help improve the quality of replies over time."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "يفهم عملاءك مهما اختلفت طريقة كلامهم",
          "en": "It understands your customers however they write"
        },
        "shot": "inbox",
        "scene": "dialects",
        "body": {
          "ar": "يتعامل مع لغات متعدّدة واختلاف أسلوب الكتابة، بما في ذلك اللغة العامية والاختصارات والأخطاء الإملائية، مع الحفاظ على سياق المحادثة.",
          "en": "It handles several languages and different writing styles — including slang, abbreviations and typos — while keeping the context of the conversation."
        },
        "points": {
          "ar": [
            "يفهم الاختصارات والكتابة العامية",
            "يرد بنفس لهجة العميل",
            "يتعامل مع الأخطاء الإملائية",
            "يدعم العربي والإنجليزي في نفس المحادثة"
          ],
          "en": [
            "Understands abbreviations and colloquial spelling",
            "Replies in the customer's own dialect",
            "Copes with typos",
            "Handles Arabic and English in the same conversation"
          ]
        }
      },
      {
        "title": {
          "ar": "حدود واضحة لعمل المساعد",
          "en": "Clear limits on what the assistant handles"
        },
        "shot": "ai-settings",
        "scene": "rules",
        "body": {
          "ar": "يمكن تحديد طريقة تعامل المساعد مع المحادثات، والمواضيع التي يتعامل معها، ومتى تنتقل المحادثة إلى الفريق.",
          "en": "You can set how the assistant handles conversations, which topics it covers, and when a conversation moves to the team."
        },
        "points": {
          "ar": [
            "وضع الرد التلقائي الكامل",
            "وضع الاقتراح: الموظف يراجع ثم يرسل",
            "استثناء مواضيع حسّاسة",
            "تحويل فوري عند ذكر كلمة بعينها"
          ],
          "en": [
            "Full auto-reply mode",
            "Suggestion mode — an agent reviews and sends",
            "Exclude sensitive topics",
            "Instant handoff when a customer mentions a specific word"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "المساعد وهو يردّ ثم يحوّل",
      "en": "The assistant answering, then handing over"
    },
    "liveHighlight": {
      "ar": [
        "يردّ",
        "يحوّل"
      ],
      "en": [
        "answering"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "هل المساعد يرد بناءً على معلومات نشاطي؟",
          "en": "Does the assistant reply based on my business information?"
        },
        "a": {
          "ar": "نعم، يعتمد على المعلومات التي توفّرها عن منتجاتك وخدماتك وسياساتك عند التعامل مع أسئلة العملاء.",
          "en": "Yes. It relies on the information you provide about your products, services and policies when handling customer questions."
        }
      },
      {
        "q": {
          "ar": "هل يدعم أكثر من لغة؟",
          "en": "Does it support more than one language?"
        },
        "a": {
          "ar": "نعم، يدعم لغات متعدّدة ويمكنه التعامل مع أكثر من لغة ضمن المحادثة نفسها.",
          "en": "Yes. It supports several languages and can handle more than one language within the same conversation."
        }
      },
      {
        "q": {
          "ar": "ماذا يحدث عندما لا يعرف المساعد الإجابة؟",
          "en": "What happens when the assistant does not know the answer?"
        },
        "a": {
          "ar": "عندما لا تكون الإجابة واضحة، تُحوَّل المحادثة إلى الموظف المناسب بدل تقديم إجابة غير مؤكّدة.",
          "en": "When the answer is not clear, the conversation is handed to the right agent instead of offering an uncertain reply."
        }
      },
      {
        "q": {
          "ar": "كيف يمكن تخصيص المساعد؟",
          "en": "How can the assistant be customised?"
        },
        "a": {
          "ar": "يمكن تحديد معلومات النشاط، وأسلوب الرد، والمواضيع التي يتعامل معها المساعد.",
          "en": "You can set your business information, the reply style, and the topics the assistant handles."
        }
      },
      {
        "q": {
          "ar": "هل يمكن مراجعة الردود قبل إرسالها؟",
          "en": "Can replies be reviewed before they are sent?"
        },
        "a": {
          "ar": "نعم، يمكن للمساعد اقتراح الرد ليراجعه الموظف ويعتمده قبل الإرسال.",
          "en": "Yes. The assistant can suggest the reply for an agent to review and approve before it is sent."
        }
      },
      {
        "q": {
          "ar": "هل يعمل خارج ساعات العمل؟",
          "en": "Does it work outside working hours?"
        },
        "a": {
          "ar": "نعم، يتعامل مع الأسئلة المتكرّرة خارج ساعات العمل، وتنتقل الحالات التي تحتاج فريقك إليه عند توفّره.",
          "en": "Yes. It handles the questions asked most outside working hours, and cases that need your team reach them once they are available."
        }
      },
      {
        "q": {
          "ar": "هل يمكنه التعامل مع الرسائل الصوتية؟",
          "en": "Can it handle voice messages?"
        },
        "a": {
          "ar": "نعم، تُحوَّل الرسائل الصوتية إلى نص لتسهيل قراءتها والتعامل معها.",
          "en": "Yes. Voice messages are turned into text, easier to read and act on."
        }
      },
      {
        "q": {
          "ar": "هل يمكن للمساعد تحويل المحادثة إلى موظف؟",
          "en": "Can the assistant hand a conversation to an agent?"
        },
        "a": {
          "ar": "نعم، عند الحاجة إلى تدخّل بشري تنتقل المحادثة للموظف المناسب مع الحفاظ على كامل سياقها.",
          "en": "Yes. When human help is needed, the conversation moves to the right agent while keeping its full context."
        }
      }
    ]
  },
  "campaigns": {
    "eyebrow": {
      "ar": "الحملات التسويقية",
      "en": "Campaigns"
    },
    "h1": {
      "ar": "حملاتك التسويقية، من مكان واحد",
      "en": "Your marketing campaigns, from one place"
    },
    "highlight": {
      "ar": [
        "مكان",
        "واحد"
      ],
      "en": [
        "one",
        "place"
      ]
    },
    "lede": {
      "ar": "إنشاء وإرسال وإدارة الحملات بسهولة، مع أدوات تساعدك على الوصول للجمهور المناسب ومتابعة نتائج كل حملة.",
      "en": "Create, send and manage campaigns easily, with tools that help you reach the right audience and follow the results of every campaign."
    },
    "heroShot": "campaigns",
    "heroRoute": "campaigns",
    "heroScene": "funnel-stats",
    "bullets": {
      "ar": [
        "قوائم جمهور منظّمة ومستهدفة",
        "متابعة التسليم والفتح والردود",
        "معرفة الحملة التي جاء منها كل رد"
      ],
      "en": [
        "Organised, targeted audience lists",
        "Follow delivery, opens and replies",
        "See which campaign each reply came from"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "إرسال منظّم، ونتائج أوضح",
        "en": "Structured sending, clearer results"
      },
      "withoutLabel": {
        "ar": "بدون Qhub",
        "en": "Without Qhub"
      },
      "withLabel": {
        "ar": "مع Qhub",
        "en": "With Qhub"
      },
      "rows": [
        {
          "without": {
            "ar": "إرسال الحملات بشكل يدوي",
            "en": "Campaigns sent by hand"
          },
          "with": {
            "ar": "قوائم جمهور منظّمة ومستهدفة",
            "en": "Organised, targeted audience lists"
          }
        },
        {
          "without": {
            "ar": "صعوبة الوصول للجمهور المناسب",
            "en": "Hard to reach the right audience"
          },
          "with": {
            "ar": "إرسال الحملات بطريقة أكثر تنظيماً",
            "en": "Campaigns sent in a more organised way"
          }
        },
        {
          "without": {
            "ar": "عدم وضوح نتائج الحملة",
            "en": "Campaign results are unclear"
          },
          "with": {
            "ar": "متابعة التسليم والفتح والردود",
            "en": "Follow delivery, opens and replies"
          }
        },
        {
          "without": {
            "ar": "صعوبة متابعة من تفاعل مع الحملة",
            "en": "Hard to tell who engaged with the campaign"
          },
          "with": {
            "ar": "معرفة الحملة التي جاء منها كل رد",
            "en": "See which campaign each reply came from"
          }
        },
        {
          "without": {
            "ar": "ردود العملاء تضيع بين المحادثات",
            "en": "Customer replies get lost among the conversations"
          },
          "with": {
            "ar": "استكمال المحادثة من المكان نفسه",
            "en": "Carry on the conversation in the same place"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "أربع خطوات لحملة متكاملة",
        "en": "Four steps to a complete campaign"
      },
      "lede": {
        "ar": "من اختيار الجمهور إلى متابعة النتائج، كل تفاصيل الحملة في مكان واحد. اضغط أي خطوة لتنتقل إليها.",
        "en": "From choosing the audience to following the results, every campaign detail in one place. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "اختيار الجمهور",
            "en": "Choosing the audience"
          },
          "body": {
            "ar": "تحديد الجمهور المناسب بناءً على البيانات والتفاعل السابق.",
            "en": "Pick the right audience based on your data and their earlier engagement."
          },
          "art": {
            "kind": "rules",
            "pairs": [
              {
                "when": {
                  "ar": "وسم «سلّة متروكة»",
                  "en": "Tagged “abandoned cart”"
                },
                "then": {
                  "ar": "640",
                  "en": "640"
                }
              },
              {
                "when": {
                  "ar": "اشترى آخر 30 يوماً",
                  "en": "Bought in last 30 days"
                },
                "then": {
                  "ar": "2,140",
                  "en": "2,140"
                }
              },
              {
                "when": {
                  "ar": "كل العملاء",
                  "en": "All customers"
                },
                "then": {
                  "ar": "8,420",
                  "en": "8,420"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تجهيز الرسالة",
            "en": "Preparing the message"
          },
          "body": {
            "ar": "إنشاء الرسالة واختيار القالب المناسب مع معاينة المحتوى قبل الإرسال.",
            "en": "Write the message and choose a suitable template, with a preview of the content before sending."
          },
          "art": {
            "kind": "chat",
            "turns": [
              {
                "from": "agent",
                "text": {
                  "ar": "أهلاً {اسم العميل} 🎉 خصم ‎25% على كل الطلبات حتى نهاية الأسبوع.",
                  "en": "Hi {customer name} 🎉 ‎25% off every order until the end of the week."
                }
              },
              {
                "from": "note",
                "text": {
                  "ar": "معاينة كما ستصل العميل",
                  "en": "Preview as the customer will see it"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "الجدولة والإرسال",
            "en": "Scheduling and sending"
          },
          "body": {
            "ar": "تحديد موعد الإرسال وإدارة الحملة وفق الجدول المحدّد.",
            "en": "Set the send time and run the campaign on the schedule you chose."
          },
          "art": {
            "kind": "fields",
            "items": [
              {
                "label": {
                  "ar": "يوم الإرسال",
                  "en": "Send day"
                },
                "value": {
                  "ar": "الجمعة",
                  "en": "Friday"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "الساعة",
                  "en": "Hour"
                },
                "value": {
                  "ar": "07:00 م",
                  "en": "07:00 pm"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "إرسال تدريجي",
                  "en": "Gradual sending"
                },
                "value": {
                  "ar": "مفعّل",
                  "en": "On"
                },
                "on": true
              }
            ]
          }
        },
        {
          "title": {
            "ar": "متابعة النتائج",
            "en": "Following the results"
          },
          "body": {
            "ar": "بيانات واضحة عن الإرسال والتسليم والتفاعل مع الحملة.",
            "en": "Clear data on sending, delivery and engagement with the campaign."
          },
          "art": {
            "kind": "stats",
            "items": [
              {
                "label": {
                  "ar": "وصلت",
                  "en": "Delivered"
                },
                "value": {
                  "ar": "2,076",
                  "en": "2,076"
                },
                "pct": 97
              },
              {
                "label": {
                  "ar": "فُتحت",
                  "en": "Opened"
                },
                "value": {
                  "ar": "1,327",
                  "en": "1,327"
                },
                "pct": 62
              },
              {
                "label": {
                  "ar": "ردّوا",
                  "en": "Replied"
                },
                "value": {
                  "ar": "385",
                  "en": "385"
                },
                "pct": 18
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "أدوات تساعدك على إدارة حملاتك",
        "en": "Tools that help you run your campaigns"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "megaphone"
        },
        "title": {
          "ar": "حملات الرسائل",
          "en": "Message campaigns"
        },
        "body": {
          "ar": "إرسال الحملات إلى قوائم مستهدفة باستخدام قوالب مناسبة.",
          "en": "Send campaigns to targeted lists using suitable templates."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "حملات البريد الإلكتروني",
          "en": "Email campaigns"
        },
        "body": {
          "ar": "إنشاء وإرسال رسائل بريدية بتصميم واضح ومتوافق مع مختلف الأجهزة.",
          "en": "Create and send emails with a clear design that reads well on any device."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "title": {
          "ar": "تقسيم الجمهور",
          "en": "Audience segmentation"
        },
        "body": {
          "ar": "استهداف شرائح مختلفة بناءً على الوسوم والتفاعل والبيانات المتاحة.",
          "en": "Target different segments based on tags, engagement and the data you have."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "تقارير الحملة",
          "en": "Campaign reports"
        },
        "body": {
          "ar": "بيانات واضحة عن الإرسال والتسليم والفتح والردود.",
          "en": "Clear data on sending, delivery, opens and replies."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "قوائم الاستبعاد",
          "en": "Exclusion lists"
        },
        "body": {
          "ar": "استبعاد العملاء الذين لا يرغبون في استقبال الحملات القادمة.",
          "en": "Exclude customers who do not want to receive future campaigns."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "clock"
        },
        "title": {
          "ar": "الإرسال التجريبي",
          "en": "Test sending"
        },
        "body": {
          "ar": "اختبار الحملة على مجموعة صغيرة قبل إرسالها إلى كامل الجمهور.",
          "en": "Try the campaign on a small group before sending it to the whole audience."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "ردود الحملات تبقى مرتبطة بالمحادثة",
          "en": "Campaign replies stay tied to the conversation"
        },
        "shot": "inbox",
        "scene": "broadcast-reply",
        "body": {
          "ar": "عندما يتفاعل العميل مع الحملة، يظهر الرد داخل صندوق الوارد مع معرفة الحملة التي جاء منها، لتبقى الصورة واضحة لفريقك.",
          "en": "When a customer engages with a campaign, the reply appears in the inbox along with the campaign it came from, so the picture stays clear for your team."
        },
        "points": {
          "ar": [
            "ردود الحملة تدخل الصندوق الموحّد",
            "معرفة الحملة التي جاء منها العميل",
            "إمكانية إرسال حملة متابعة لمن لم يردّ",
            "استبعاد من طلب إيقاف الرسائل"
          ],
          "en": [
            "Campaign replies enter the unified inbox",
            "See which campaign brought the customer in",
            "Send a follow-up campaign to those who did not reply",
            "Anyone who opted out is excluded"
          ]
        }
      },
      {
        "title": {
          "ar": "إرسال في الوقت المناسب",
          "en": "Sending at the right time"
        },
        "shot": "campaigns",
        "scene": "schedule",
        "body": {
          "ar": "إمكانية جدولة الحملات مسبقاً وتحديد موعد الإرسال بما يناسب جمهورك، مع إرسال تدريجي وإمكانية الإيقاف عند الحاجة.",
          "en": "Campaigns can be scheduled in advance and sent at a time that suits your audience, with gradual sending and the option to stop when needed."
        },
        "points": {
          "ar": [
            "جدولة مسبقة بالتاريخ والساعة",
            "إرسال تدريجي يحمي الرقم",
            "اختبار على مجموعة صغيرة أولاً",
            "إيقاف الحملة في أي لحظة"
          ],
          "en": [
            "Schedule by date and time",
            "Gradual sending that protects the number",
            "Test on a small group first",
            "Stop a campaign at any moment"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "حملة تُبنى وتُرسَل خطوة بخطوة",
      "en": "A campaign built and sent, step by step"
    },
    "liveHighlight": {
      "ar": [
        "خطوة",
        "بخطوة"
      ],
      "en": [
        "step",
        "by",
        "step"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "هل يمكن جدولة الحملات مسبقاً؟",
          "en": "Can campaigns be scheduled in advance?"
        },
        "a": {
          "ar": "نعم، يمكن تحديد تاريخ ووقت الإرسال مسبقاً وإدارة الحملة وفق الجدول المحدّد.",
          "en": "Yes. You can set the date and time in advance and run the campaign on that schedule."
        }
      },
      {
        "q": {
          "ar": "كيف يتم تحديد الجمهور المستهدف؟",
          "en": "How is the target audience chosen?"
        },
        "a": {
          "ar": "يمكن تقسيم الجمهور بناءً على الوسوم والتفاعل السابق والبيانات المتاحة عن العملاء.",
          "en": "You can segment the audience by tags, earlier engagement and the customer data you have."
        }
      },
      {
        "q": {
          "ar": "هل يمكن متابعة نتائج الحملة؟",
          "en": "Can campaign results be followed?"
        },
        "a": {
          "ar": "نعم، تظهر بيانات الحملة بشكل واضح لمتابعة الإرسال والتسليم والفتح والردود.",
          "en": "Yes. Campaign data is shown clearly, so you can follow sending, delivery, opens and replies."
        }
      },
      {
        "q": {
          "ar": "أين تظهر ردود العملاء على الحملة؟",
          "en": "Where do customer replies to a campaign appear?"
        },
        "a": {
          "ar": "تظهر الردود داخل صندوق الوارد، مع معرفة الحملة التي جاء منها الرد.",
          "en": "Replies appear in the inbox, along with the campaign they came from."
        }
      },
      {
        "q": {
          "ar": "هل يمكن استبعاد بعض العملاء من الحملات؟",
          "en": "Can some customers be excluded from campaigns?"
        },
        "a": {
          "ar": "نعم، يمكن إنشاء قوائم استبعاد لمن لا يرغبون في استقبال الحملات القادمة.",
          "en": "Yes. You can build exclusion lists for anyone who does not want to receive future campaigns."
        }
      },
      {
        "q": {
          "ar": "هل يمكن تجربة الحملة قبل إرسالها؟",
          "en": "Can a campaign be tested before it is sent?"
        },
        "a": {
          "ar": "نعم، يمكن إرسال الحملة إلى مجموعة صغيرة أولاً قبل إطلاقها على كامل الجمهور.",
          "en": "Yes. You can send the campaign to a small group first, before releasing it to the whole audience."
        }
      },
      {
        "q": {
          "ar": "هل يمكن إيقاف الحملة بعد بدء الإرسال؟",
          "en": "Can a campaign be stopped after sending starts?"
        },
        "a": {
          "ar": "نعم، يمكن إيقاف الحملة أثناء الإرسال عند الحاجة.",
          "en": "Yes. A campaign can be stopped mid-send whenever you need to."
        }
      }
    ]
  },
  "team": {
    "eyebrow": {
      "ar": "إدارة الفريق والصلاحيات",
      "en": "Team & Permissions"
    },
    "h1": {
      "ar": "فريقك منظّم، وكل محادثة تصل للموظف المناسب",
      "en": "Your team organised, and every conversation reaches the right agent"
    },
    "highlight": {
      "ar": [
        "تصل",
        "للموظف",
        "المناسب"
      ],
      "en": [
        "right"
      ]
    },
    "lede": {
      "ar": "نظّم فريقك حسب الأدوار والأقسام وساعات العمل، وليتم توزيع المحادثات بشكل واضح ومتوازن.",
      "en": "Organise your team by roles, departments and working hours, so conversations are distributed clearly and evenly."
    },
    "heroShot": "contacts",
    "heroRoute": "contacts",
    "heroScene": "routing-tree",
    "bullets": {
      "ar": [
        "توزيع المحادثات حسب القسم وحالة الموظف",
        "صلاحيات مختلفة لكل دور وموظف",
        "معرفة المسؤول عن كل محادثة وتفاصيل ما تمّ عليها"
      ],
      "en": [
        "Conversations routed by department and agent availability",
        "Different permissions for each role and each agent",
        "See who owns each conversation and what has happened on it"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "توزيع منظّم بدل التوزيع اليدوي",
        "en": "Organised routing instead of handing conversations out by hand"
      },
      "withoutLabel": {
        "ar": "بدون Qhub",
        "en": "Without Qhub"
      },
      "withLabel": {
        "ar": "مع Qhub",
        "en": "With Qhub"
      },
      "rows": [
        {
          "without": {
            "ar": "توزيع المحادثات يدوياً طوال اليوم",
            "en": "Handing conversations out manually all day"
          },
          "with": {
            "ar": "توزيع المحادثات حسب قواعد محدّدة",
            "en": "Conversations routed by rules you define"
          }
        },
        {
          "without": {
            "ar": "تكدّس المحادثات عند بعض الموظفين",
            "en": "Conversations piling up on some agents"
          },
          "with": {
            "ar": "توزيع أكثر توازناً بين أفراد الفريق",
            "en": "A more balanced spread across the team"
          }
        },
        {
          "without": {
            "ar": "مشاركة الحساب بين أفراد الفريق",
            "en": "One account shared between the team"
          },
          "with": {
            "ar": "حساب وصلاحيات خاصة لكل موظف",
            "en": "A separate account and permissions for each agent"
          }
        },
        {
          "without": {
            "ar": "صعوبة معرفة الموظف المسؤول عن كل محادثة",
            "en": "Hard to tell which agent owns each conversation"
          },
          "with": {
            "ar": "تحويل المحادثة مع كامل سياقها",
            "en": "Transfers that carry the full context"
          }
        },
        {
          "without": {
            "ar": "صعوبة متابعة ما تمّ على كل محادثة",
            "en": "Hard to follow what happened on each conversation"
          },
          "with": {
            "ar": "سجلّ واضح لكل إجراء تمّ على المحادثة",
            "en": "A clear log of every action taken on a conversation"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "كيف تصل المحادثة إلى الموظف المناسب",
        "en": "How a conversation reaches the right agent"
      },
      "lede": {
        "ar": "تصل كل محادثة إلى المكان المناسب حسب القواعد المحدّدة، دون متابعة التوزيع يدوياً. اضغط أي خطوة لتنتقل إليها.",
        "en": "Every conversation lands in the right place according to the rules you set, with no manual routing. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "تحديد الأقسام",
            "en": "Defining the departments"
          },
          "body": {
            "ar": "تنظيم الفريق إلى أقسام مختلفة، مع تحديد الموظفين وساعات العمل لكل قسم.",
            "en": "Organise the team into departments, setting the agents and working hours for each one."
          },
          "art": {
            "kind": "flow",
            "from": {
              "ar": "محادثة واردة",
              "en": "Incoming chat"
            },
            "to": {
              "ar": [
                "المبيعات",
                "الدعم",
                "الشحن"
              ],
              "en": [
                "Sales",
                "Support",
                "Shipping"
              ]
            }
          }
        },
        {
          "title": {
            "ar": "تحديد قواعد التوزيع",
            "en": "Setting the routing rules"
          },
          "body": {
            "ar": "توزيع المحادثات بناءً على القسم ونوع المحادثة والبيانات المتاحة.",
            "en": "Conversations are routed based on the department, the type of conversation and the data available."
          },
          "art": {
            "kind": "rules",
            "pairs": [
              {
                "when": {
                  "ar": "كلمة «سعر»",
                  "en": "The word “price”"
                },
                "then": {
                  "ar": "المبيعات",
                  "en": "Sales"
                }
              },
              {
                "when": {
                  "ar": "شكوى أو عطل",
                  "en": "A complaint or fault"
                },
                "then": {
                  "ar": "الدعم",
                  "en": "Support"
                }
              },
              {
                "when": {
                  "ar": "سؤال عن طلب",
                  "en": "An order question"
                },
                "then": {
                  "ar": "الشحن",
                  "en": "Shipping"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "اختيار الموظف المتاح",
            "en": "Choosing the available agent"
          },
          "body": {
            "ar": "تصل المحادثة إلى الموظف المناسب والمتاح، مع مراعاة حجم المحادثات لديه.",
            "en": "The conversation reaches the right agent who is available, taking into account how many conversations they already have."
          },
          "art": {
            "kind": "rows",
            "active": 2,
            "items": [
              {
                "label": {
                  "ar": "سالم",
                  "en": "Salem"
                },
                "sub": {
                  "ar": "بلغ سقفه — 7 محادثات",
                  "en": "At capacity — 7 chats"
                },
                "initial": {
                  "ar": "س",
                  "en": "S"
                },
                "badge": {
                  "ar": "مشغول",
                  "en": "Busy"
                }
              },
              {
                "label": {
                  "ar": "أحمد",
                  "en": "Ahmed"
                },
                "sub": {
                  "ar": "انتهى دوامه",
                  "en": "Off shift"
                },
                "initial": {
                  "ar": "أ",
                  "en": "A"
                },
                "badge": {
                  "ar": "خارج",
                  "en": "Away"
                }
              },
              {
                "label": {
                  "ar": "منال",
                  "en": "Manal"
                },
                "sub": {
                  "ar": "متاحة — 3 محادثات",
                  "en": "Available — 3 chats"
                },
                "initial": {
                  "ar": "م",
                  "en": "M"
                },
                "badge": {
                  "ar": "استلمت",
                  "en": "Assigned"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تسجيل كل التفاصيل",
            "en": "Everything is recorded"
          },
          "body": {
            "ar": "كل إسناد وتحويل وإغلاق يبقى مسجّلاً، مع معرفة الموظف المسؤول ووقت الإجراء.",
            "en": "Every assignment, transfer and closure stays logged, with the agent responsible and the time of the action."
          },
          "art": {
            "kind": "fields",
            "items": [
              {
                "label": {
                  "ar": "أُسندت إلى",
                  "en": "Assigned to"
                },
                "value": {
                  "ar": "منال · 09:12",
                  "en": "Manal · 09:12"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "حُوّلت من",
                  "en": "Transferred from"
                },
                "value": {
                  "ar": "سالم · 09:40",
                  "en": "Salem · 09:40"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "أُغلقت",
                  "en": "Closed by"
                },
                "value": {
                  "ar": "منال · 10:05",
                  "en": "Manal · 10:05"
                },
                "on": true
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "تنظيم الفريق وضبط صلاحياته",
        "en": "Organising your team and its permissions"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "title": {
          "ar": "أدوار وصلاحيات جاهزة",
          "en": "Ready-made roles and permissions"
        },
        "body": {
          "ar": "أدوار مختلفة مثل المدير والمشرف والموظف، مع إمكانية تخصيص الصلاحيات حسب احتياج فريقك.",
          "en": "Roles such as admin, supervisor and agent, with permissions you can tailor to your team."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "تقسيم الفريق إلى أقسام",
          "en": "Splitting the team into departments"
        },
        "body": {
          "ar": "تنظيم الموظفين ضمن أقسام واضحة، بحيث تكون المحادثات والمهام موزّعة بشكل أفضل.",
          "en": "Organise agents into clear departments, so conversations and work are better distributed."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "ساعات عمل لكل موظف",
          "en": "Working hours per agent"
        },
        "body": {
          "ar": "تحديد ساعات عمل الموظفين حتى تُوزَّع المحادثات على المتاحين منهم.",
          "en": "Set each agent's working hours so conversations go to whoever is available."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "توزيع متوازن للمحادثات",
          "en": "Balanced conversation distribution"
        },
        "body": {
          "ar": "توزيع المحادثات بشكل يساعد على تقليل التكدّس وتحقيق توازن أفضل بين أعضاء الفريق.",
          "en": "Conversations spread in a way that reduces pile-ups and keeps the team balanced."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "سجلّ الإجراءات",
          "en": "Action log"
        },
        "body": {
          "ar": "كل إسناد أو تحويل أو إغلاق يبقى مسجّلاً مع تفاصيل الإجراء.",
          "en": "Every assignment, transfer or closure stays logged with the details of the action."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "clock"
        },
        "title": {
          "ar": "الإجازات وأيام العطل",
          "en": "Leave and days off"
        },
        "body": {
          "ar": "الموظف غير المتاح يُتجاوَز تلقائياً عند توزيع المحادثات.",
          "en": "An agent who is not available is skipped automatically when conversations are routed."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "صلاحيات واضحة لكل عضو في الفريق",
          "en": "Clear permissions for every team member"
        },
        "shot": "contacts",
        "scene": "permissions",
        "body": {
          "ar": "لكل موظف مستوى وصول مناسب لدوره، مع إمكانية التحكّم في ما يمكنه رؤيته أو إدارته داخل النظام.",
          "en": "Each agent gets an access level suited to their role, with control over what they can see or manage inside the system."
        },
        "points": {
          "ar": [
            "صلاحيات على مستوى القناة والقسم",
            "منع التصدير أو الحذف",
            "سجلّ يبيّن من فعل ماذا",
            "تعطيل حساب موظف فوراً"
          ],
          "en": [
            "Permissions at channel and department level",
            "Block export or deletion",
            "An audit log showing who did what",
            "Disable an agent's account instantly"
          ]
        }
      },
      {
        "title": {
          "ar": "الفريق يواصل العمل حتى خارج ساعات الدوام",
          "en": "The team keeps working even outside office hours"
        },
        "shot": "overview",
        "scene": "off-hours",
        "body": {
          "ar": "عندما يكون الفريق خارج أوقات العمل، تبقى المحادثات محفوظة ومنظّمة إلى أن يصبح الموظف المناسب متاحاً.",
          "en": "When the team is outside working hours, conversations stay saved and organised until the right agent is available."
        },
        "points": {
          "ar": [
            "رد تلقائي خارج ساعات العمل",
            "طابور انتظار مرتّب حسب الأقدمية",
            "تنبيه للمشرف عند تأخّر الردّ",
            "إجازات وأيام عطل"
          ],
          "en": [
            "Automatic reply outside working hours",
            "A queue ordered by waiting time",
            "Supervisor alert when a reply is overdue",
            "Holidays and days off"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "قواعد التوزيع وهي تشتغل",
      "en": "Routing rules in action"
    },
    "liveHighlight": {
      "ar": [
        "قواعد",
        "التوزيع"
      ],
      "en": [
        "Routing",
        "rules"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "كم موظفاً يمكنني إضافته؟",
          "en": "How many agents can I add?"
        },
        "a": {
          "ar": "يعتمد عدد الموظفين على الباقة، ويمكن اختيار الباقة المناسبة لحجم فريقك.",
          "en": "It depends on the plan; you can pick the plan that fits the size of your team."
        }
      },
      {
        "q": {
          "ar": "هل يمكن للموظف العمل من الجوال؟",
          "en": "Can agents work from their phone?"
        },
        "a": {
          "ar": "نعم، يمكن لفريقك متابعة المحادثات وإدارتها من الجوال والكمبيوتر.",
          "en": "Yes. Your team can follow and manage conversations from phone and computer."
        }
      },
      {
        "q": {
          "ar": "هل يمكنني متابعة أداء كل موظف؟",
          "en": "Can I follow each agent's performance?"
        },
        "a": {
          "ar": "نعم، يمكن متابعة أداء الموظفين من خلال بيانات المحادثات وأوقات الرد والتقييمات.",
          "en": "Yes. You can follow agent performance through conversation data, reply times and ratings."
        }
      },
      {
        "q": {
          "ar": "هل يمكن منع موظف من رؤية قسم أو محادثات معيّنة؟",
          "en": "Can an agent be stopped from seeing a department or certain conversations?"
        },
        "a": {
          "ar": "نعم، يمكن تحديد صلاحيات الوصول حسب الدور والقسم.",
          "en": "Yes. Access permissions can be set by role and by department."
        }
      },
      {
        "q": {
          "ar": "ماذا يحدث إذا لم يكن هناك موظف متاح؟",
          "en": "What happens if no agent is available?"
        },
        "a": {
          "ar": "تبقى المحادثة محفوظة في قائمة الانتظار حتى يصبح الموظف المناسب متاحاً.",
          "en": "The conversation stays in the queue until the right agent becomes available."
        }
      },
      {
        "q": {
          "ar": "هل يمكن إعادة إسناد المحادثة يدوياً؟",
          "en": "Can a conversation be reassigned manually?"
        },
        "a": {
          "ar": "نعم، يمكن إعادة إسناد المحادثة في أي وقت مع الحفاظ على كامل سياقها وملاحظاتها.",
          "en": "Yes, at any time, keeping its full context and its notes."
        }
      }
    ]
  },
  "analytics": {
    "eyebrow": {
      "ar": "التقارير والتحليلات",
      "en": "Reports & Analytics"
    },
    "h1": {
      "ar": "صورة واضحة عن أداء فريقك",
      "en": "A clear picture of how your team is doing"
    },
    "highlight": {
      "ar": [
        "أداء",
        "فريقك"
      ],
      "en": [
        "clear",
        "picture"
      ]
    },
    "lede": {
      "ar": "تابع المحادثات وأوقات الرد ورضا العملاء وأداء الموظفين من لوحة واحدة تساعدك على فهم ما يحدث واتخاذ قرارات أفضل.",
      "en": "Follow conversations, reply times, customer satisfaction and agent performance from one dashboard that helps you understand what is happening and make better decisions."
    },
    "heroShot": "reports",
    "heroRoute": "reports",
    "heroScene": "kpi-drill",
    "bullets": {
      "ar": [
        "متابعة زمن الرد ونسبة حل المحادثات",
        "قياس أداء كل موظف وقسم",
        "معرفة أوقات الضغط وأكثر الفترات ازدحاماً"
      ],
      "en": [
        "Follow reply time and the share of conversations resolved",
        "Measure how each agent and each department is doing",
        "See when the pressure peaks and which periods are busiest"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "رقم واضح بدل التخمين",
        "en": "A clear number instead of guesswork"
      },
      "withoutLabel": {
        "ar": "بدون تقارير",
        "en": "Without reports"
      },
      "withLabel": {
        "ar": "مع تقارير Qhub",
        "en": "With Qhub reports"
      },
      "rows": [
        {
          "without": {
            "ar": "صعوبة معرفة سبب ارتفاع وقت الرد",
            "en": "Hard to tell why reply time went up"
          },
          "with": {
            "ar": "أرقام واضحة عن أداء الفريق",
            "en": "Clear numbers on how the team is doing"
          }
        },
        {
          "without": {
            "ar": "متابعة أداء الموظفين بشكل يدوي",
            "en": "Following agent performance by hand"
          },
          "with": {
            "ar": "متابعة زمن الرد وحل المحادثات",
            "en": "Follow reply time and conversations resolved"
          }
        },
        {
          "without": {
            "ar": "صعوبة معرفة أوقات الضغط",
            "en": "Hard to know when the pressure peaks"
          },
          "with": {
            "ar": "معرفة أوقات الذروة وحجم المحادثات",
            "en": "See peak hours and conversation volume"
          }
        },
        {
          "without": {
            "ar": "تجميع البيانات في جداول بشكل مستمر",
            "en": "Constantly assembling data into spreadsheets"
          },
          "with": {
            "ar": "مقارنة الأداء بين الفترات",
            "en": "Compare performance between periods"
          }
        },
        {
          "without": {
            "ar": "اتخاذ القرارات بناءً على الانطباع",
            "en": "Decisions made on impressions"
          },
          "with": {
            "ar": "الوصول إلى المحادثات التي تقف خلف كل رقم",
            "en": "Reach the conversations behind every number"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "من الأرقام إلى الصورة الكاملة",
        "en": "From the numbers to the whole picture"
      },
      "lede": {
        "ar": "تظهر أهم مؤشّرات الأداء في لوحة واحدة، مع تغيير الفترة الزمنية ومتابعة التغيّر في الأرقام. اضغط أي خطوة لتنتقل إليها.",
        "en": "The key performance metrics appear on one dashboard, where you can change the period and follow how the numbers move. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "ملخّص الأداء",
            "en": "The performance summary"
          },
          "body": {
            "ar": "عرض أهم مؤشّرات الأداء في مكان واحد، مثل عدد المحادثات وزمن الرد ونسبة الحل ورضا العملاء.",
            "en": "The key metrics in one place: conversation count, reply time, resolution rate and customer satisfaction."
          },
          "art": {
            "kind": "stats",
            "items": [
              {
                "label": {
                  "ar": "المحادثات",
                  "en": "Conversations"
                },
                "value": {
                  "ar": "1,428",
                  "en": "1,428"
                },
                "pct": 80
              },
              {
                "label": {
                  "ar": "متوسط أول ردّ",
                  "en": "Avg. first reply"
                },
                "value": {
                  "ar": "2.1",
                  "en": "2.1"
                },
                "unit": {
                  "ar": "د",
                  "en": "m"
                },
                "pct": 64
              },
              {
                "label": {
                  "ar": "نسبة الحل",
                  "en": "Resolution rate"
                },
                "value": {
                  "ar": "96",
                  "en": "96"
                },
                "unit": {
                  "ar": "%",
                  "en": "%"
                },
                "pct": 96
              }
            ]
          }
        },
        {
          "title": {
            "ar": "مقارنة الفترات",
            "en": "Comparing periods"
          },
          "body": {
            "ar": "مقارنة أداء أسبوع بأسبوع أو شهر بشهر لمعرفة التغيّر في النتائج.",
            "en": "Compare week with week or month with month to see how the results changed."
          },
          "art": {
            "kind": "rules",
            "pairs": [
              {
                "when": {
                  "ar": "هذا الشهر",
                  "en": "This month"
                },
                "then": {
                  "ar": "2.1 د",
                  "en": "2.1 m"
                }
              },
              {
                "when": {
                  "ar": "الشهر الماضي",
                  "en": "Last month"
                },
                "then": {
                  "ar": "2.8 د",
                  "en": "2.8 m"
                }
              },
              {
                "when": {
                  "ar": "الفرق",
                  "en": "Difference"
                },
                "then": {
                  "ar": "‎−25%",
                  "en": "‎−25%"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "الوصول إلى التفاصيل",
            "en": "Reaching the detail"
          },
          "body": {
            "ar": "تصفية البيانات حسب القسم أو الموظف أو الفترة للوصول إلى التفاصيل التي تحتاجها.",
            "en": "Filter the data by department, agent or period to reach the details you need."
          },
          "art": {
            "kind": "rows",
            "active": 2,
            "items": [
              {
                "label": {
                  "ar": "واتساب",
                  "en": "WhatsApp"
                },
                "sub": {
                  "ar": "متوسط الردّ 1.8 د",
                  "en": "Avg. reply 1.8 m"
                },
                "ch": "whatsapp",
                "badge": {
                  "ar": "سريع",
                  "en": "Fast"
                }
              },
              {
                "label": {
                  "ar": "إنستغرام",
                  "en": "Instagram"
                },
                "sub": {
                  "ar": "متوسط الردّ 2.6 د",
                  "en": "Avg. reply 2.6 m"
                },
                "ch": "instagram"
              },
              {
                "label": {
                  "ar": "إكس",
                  "en": "X"
                },
                "sub": {
                  "ar": "متوسط الردّ 4.1 د",
                  "en": "Avg. reply 4.1 m"
                },
                "ch": "x",
                "badge": {
                  "ar": "بطيء",
                  "en": "Slow"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "التصدير والجدولة",
            "en": "Exporting and scheduling"
          },
          "body": {
            "ar": "تصدير التقارير ومشاركة البيانات، مع وصول التقارير بشكل دوري إلى البريد الإلكتروني.",
            "en": "Export reports and share the data, with reports arriving by email on a regular schedule."
          },
          "art": {
            "kind": "fields",
            "items": [
              {
                "label": {
                  "ar": "تقرير أسبوعي",
                  "en": "Weekly report"
                },
                "value": {
                  "ar": "كل أحد",
                  "en": "Every Sunday"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "يصل إلى",
                  "en": "Sent to"
                },
                "value": {
                  "ar": "المدير",
                  "en": "Manager"
                },
                "on": true
              },
              {
                "label": {
                  "ar": "تنبيه التجاوز",
                  "en": "Threshold alert"
                },
                "value": {
                  "ar": "فوق 5 د",
                  "en": "Above 5 m"
                },
                "on": true
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "مؤشّرات تساعدك على فهم أداء فريقك",
        "en": "Metrics that help you understand how your team is doing"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "متوسّط زمن الرد",
          "en": "Average reply time"
        },
        "body": {
          "ar": "متابعة متوسط أول رد ومتوسط إغلاق المحادثات حسب الفترة والموظف.",
          "en": "Follow the average first reply and the average time to close, by period and by agent."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "title": {
          "ar": "أداء كل موظف",
          "en": "Per-agent performance"
        },
        "body": {
          "ar": "مقارنة أداء الموظفين ومعرفة حجم المحادثات التي تمّت متابعتها وإنجازها.",
          "en": "Compare agents and see how many conversations each one followed and completed."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "رضا العملاء",
          "en": "Customer satisfaction"
        },
        "body": {
          "ar": "متابعة تقييمات العملاء ومعرفة مستوى رضاهم عن المحادثات.",
          "en": "Follow customer ratings and see how satisfied they are with the conversations."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "حجم المحادثات",
          "en": "Conversation volume"
        },
        "body": {
          "ar": "معرفة عدد المحادثات خلال اليوم وتحديد الفترات الأكثر ازدحاماً.",
          "en": "See how many conversations arrive during the day and which periods are busiest."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "clock"
        },
        "title": {
          "ar": "مقارنة الأداء",
          "en": "Performance comparison"
        },
        "body": {
          "ar": "مقارنة النتائج بين الفترات لمعرفة التحسّن أو التراجع في الأداء.",
          "en": "Compare results between periods to see whether performance improved or slipped."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "تنبيهات الأداء",
          "en": "Performance alerts"
        },
        "body": {
          "ar": "تنبيهات عند تجاوز زمن الرد الحدَّ المحدّد، لمساعدة الفريق على التعامل مع التأخير في الوقت المناسب.",
          "en": "Alerts when reply time crosses the limit you set, so the team can deal with delays in time."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "كل رقم له تفاصيله",
          "en": "Every number has its detail"
        },
        "shot": "reports",
        "scene": "drill-path",
        "body": {
          "ar": "لا تتوقّف التقارير عند عرض الأرقام، بل تساعدك على معرفة المحادثات والبيانات التي تقف خلف كل نتيجة.",
          "en": "Reports do not stop at showing numbers — they help you reach the conversations and the data behind each result."
        },
        "points": {
          "ar": [
            "تفصيل كل رقم لمحادثاته",
            "مقارنة بين فترتين",
            "تصفية حسب القناة أو القسم أو الموظف",
            "تصدير للإكسل"
          ],
          "en": [
            "Drill from any number into its conversations",
            "Compare two periods",
            "Filter by channel, department or agent",
            "Export to Excel"
          ]
        }
      },
      {
        "title": {
          "ar": "تقارير دورية تصل تلقائياً",
          "en": "Recurring reports that arrive automatically"
        },
        "shot": "overview",
        "scene": "digest",
        "body": {
          "ar": "تصل التقارير إلى البريد الإلكتروني وفق الجدول المحدّد، لتبقى على اطّلاع بأداء الفريق دون الدخول إلى النظام كل مرة.",
          "en": "Reports arrive by email on the schedule you set, so you stay on top of your team's performance without logging in every time."
        },
        "points": {
          "ar": [
            "تقرير يومي مختصر",
            "ملخّص أسبوعي للمدير",
            "تنبيه لما يتجاوز زمن الرد حدّاً معيّناً",
            "لوحة مخصّصة لكل دور"
          ],
          "en": [
            "A short daily report",
            "A weekly summary for managers",
            "An alert when reply time crosses a threshold",
            "A custom dashboard per role"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "لوحة تتبدّل أرقامها مع الفترة",
      "en": "A dashboard that moves with the period"
    },
    "liveHighlight": {
      "ar": [
        "أرقامها"
      ],
      "en": [
        "moves"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "متى تبدأ البيانات بالظهور في التقارير؟",
          "en": "When does data start appearing in the reports?"
        },
        "a": {
          "ar": "تبدأ البيانات من لحظة تفعيل الحساب، وتُحتسب المحادثات التي تدخل النظام ضمن التقارير.",
          "en": "Data starts from the moment the account is activated, and conversations entering the system count towards the reports."
        }
      },
      {
        "q": {
          "ar": "هل يمكن تصدير التقارير؟",
          "en": "Can reports be exported?"
        },
        "a": {
          "ar": "نعم، يمكن تصدير البيانات والتقارير حسب الباقة المتاحة.",
          "en": "Yes. Data and reports can be exported according to the plan you are on."
        }
      },
      {
        "q": {
          "ar": "هل يمكن مقارنة فترتين؟",
          "en": "Can two periods be compared?"
        },
        "a": {
          "ar": "نعم، يمكن مقارنة الأداء بين أسبوعين أو شهرين لمعرفة التغيّر في النتائج.",
          "en": "Yes. You can compare performance between two weeks or two months to see how the results changed."
        }
      },
      {
        "q": {
          "ar": "هل التقارير تتحدّث بشكل مستمر؟",
          "en": "Do the reports update continuously?"
        },
        "a": {
          "ar": "نعم، تتحدّث البيانات مع دخول المحادثات وتغيّر مؤشّرات الأداء.",
          "en": "Yes. The data updates as conversations arrive and the performance metrics change."
        }
      },
      {
        "q": {
          "ar": "هل يمكنني معرفة أداء كل موظف؟",
          "en": "Can I see each agent's performance?"
        },
        "a": {
          "ar": "نعم، يمكن متابعة مؤشّرات الأداء لكل موظف حسب الصلاحيات المتاحة.",
          "en": "Yes. You can follow performance metrics for each agent, according to the permissions available."
        }
      },
      {
        "q": {
          "ar": "من يستطيع رؤية تقارير الفريق؟",
          "en": "Who can see the team's reports?"
        },
        "a": {
          "ar": "يعتمد ذلك على الصلاحيات، بحيث يمكن تحديد مستوى الوصول للتقارير حسب دور كل موظف.",
          "en": "That depends on permissions: the level of access to reports can be set according to each agent's role."
        }
      }
    ]
  },
  "chat-widget": {
    "eyebrow": {
      "ar": "المحادثة المباشرة",
      "en": "Live Chat"
    },
    "h1": {
      "ar": "تواصل مباشر مع زوار موقعك",
      "en": "Talk directly with your website visitors"
    },
    "highlight": {
      "ar": [
        "زوار",
        "موقعك"
      ],
      "en": [
        "website",
        "visitors"
      ]
    },
    "lede": {
      "ar": "وفّر لزوار موقعك طريقة سهلة للتواصل مع فريقك، واجعل المحادثات تصل مباشرة إلى صندوق الوارد لمتابعتها والرد عليها من مكان واحد.",
      "en": "Give your website visitors an easy way to reach your team, with the conversations landing straight in the inbox so you can follow and answer them from one place."
    },
    "heroShot": "inbox",
    "heroRoute": "inbox",
    "heroScene": "widget-states",
    "bullets": {
      "ar": [
        "محادثة مباشرة داخل موقعك",
        "وصول المحادثات إلى صندوق الوارد",
        "معرفة بيانات الزائر وسياق المحادثة"
      ],
      "en": [
        "Live chat inside your own website",
        "Conversations arrive in the shared inbox",
        "Visitor details and the context of the conversation"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "محادثة مباشرة بدل انتظار العميل",
        "en": "Live chat instead of waiting for the customer"
      },
      "withoutLabel": {
        "ar": "بدون Qhub",
        "en": "Without Qhub"
      },
      "withLabel": {
        "ar": "مع Qhub",
        "en": "With Qhub"
      },
      "rows": [
        {
          "without": {
            "ar": "مغادرة الزائر للموقع دون التواصل مع الفريق",
            "en": "Visitors leave the site without reaching your team"
          },
          "with": {
            "ar": "وسيلة تواصل مباشرة داخل موقعك",
            "en": "A direct way to talk inside your website"
          }
        },
        {
          "without": {
            "ar": "صعوبة معرفة استفسارات الزوار",
            "en": "Hard to know what visitors are asking about"
          },
          "with": {
            "ar": "وصول المحادثات إلى صندوق الوارد",
            "en": "Conversations arrive in the shared inbox"
          }
        },
        {
          "without": {
            "ar": "تشتّت المحادثات عن باقي محادثات العملاء",
            "en": "Website chats scattered away from other conversations"
          },
          "with": {
            "ar": "ظهور تفاصيل المحادثة أمام الموظف",
            "en": "The conversation details sit in front of the agent"
          }
        },
        {
          "without": {
            "ar": "تأخّر الرد على الأسئلة أثناء تصفّح الموقع",
            "en": "Slow answers while the visitor is still browsing"
          },
          "with": {
            "ar": "توزيع المحادثة على الموظف المناسب",
            "en": "The conversation routed to the right agent"
          }
        },
        {
          "without": {
            "ar": "فقدان فرصة التواصل مع العميل في الوقت المناسب",
            "en": "Missing the chance to talk at the right moment"
          },
          "with": {
            "ar": "متابعة المحادثة من أول رسالة حتى إغلاقها",
            "en": "Follow the conversation from the first message until it closes"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "من زيارة الموقع إلى محادثة مباشرة",
        "en": "From a website visit to a live conversation"
      },
      "lede": {
        "ar": "تظهر نافذة المحادثة للزائر أثناء تصفّحه، وتصل الرسائل مباشرة إلى فريقك. اضغط أي خطوة لتنتقل إليها.",
        "en": "The chat window appears to visitors while they browse, and the messages reach your team directly. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "تظهر للزائر",
            "en": "It appears to the visitor"
          },
          "body": {
            "ar": "تظهر نافذة المحادثة داخل الموقع بطريقة بسيطة وسهلة الوصول.",
            "en": "The chat window shows inside the site in a simple, easy-to-reach way."
          },
          "art": {
            "kind": "browser",
            "url": "yourstore.com",
            "nav": {
              "ar": [
                "الرئيسية",
                "المنتجات",
                "السلة"
              ],
              "en": [
                "Home",
                "Products",
                "Cart"
              ]
            },
            "bubble": {
              "ar": "محتاج مساعدة؟",
              "en": "Need a hand?"
            }
          }
        },
        {
          "title": {
            "ar": "يبدأ المحادثة",
            "en": "They start the conversation"
          },
          "body": {
            "ar": "يمكن للزائر إرسال سؤاله مباشرة دون مغادرة الموقع.",
            "en": "The visitor can send their question without leaving the site."
          },
          "art": {
            "kind": "rules",
            "pairs": [
              {
                "when": {
                  "ar": "كم سعر التوصيل؟",
                  "en": "How much is delivery?"
                },
                "then": {
                  "ar": "ردّ فوري",
                  "en": "Instant reply"
                }
              },
              {
                "when": {
                  "ar": "متى يوصل طلبي؟",
                  "en": "When will my order arrive?"
                },
                "then": {
                  "ar": "ردّ فوري",
                  "en": "Instant reply"
                }
              },
              {
                "when": {
                  "ar": "أبغى أكلّم موظف",
                  "en": "I want a human"
                },
                "then": {
                  "ar": "تحويل",
                  "en": "Handover"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تصل إلى الفريق",
            "en": "It reaches the team"
          },
          "body": {
            "ar": "تظهر المحادثة في صندوق الوارد ليتعامل معها الموظف المناسب.",
            "en": "The conversation appears in the inbox for the right agent to handle."
          },
          "art": {
            "kind": "rows",
            "active": 0,
            "items": [
              {
                "label": {
                  "ar": "زائر من صفحة الأسعار",
                  "en": "Visitor on the pricing page"
                },
                "sub": {
                  "ar": "كم سعر الباقة الاحترافية؟",
                  "en": "How much is the Professional plan?"
                },
                "ch": "livechat",
                "badge": {
                  "ar": "جديد",
                  "en": "New"
                }
              },
              {
                "label": {
                  "ar": "نورة العامري",
                  "en": "Noura Al-Amri"
                },
                "sub": {
                  "ar": "وصلني الطلب، شكراً لكم",
                  "en": "The order arrived, thank you"
                },
                "ch": "whatsapp"
              },
              {
                "label": {
                  "ar": "متجر لمسة",
                  "en": "Lamsa Store"
                },
                "sub": {
                  "ar": "كم سعر الباقة الجديدة؟",
                  "en": "How much is the new plan?"
                },
                "ch": "instagram"
              }
            ]
          }
        },
        {
          "title": {
            "ar": "تستمرّ المحادثة",
            "en": "The conversation carries on"
          },
          "body": {
            "ar": "يبقى سياق المحادثة محفوظاً حتى يتمكّن الفريق من متابعة العميل بشكل واضح.",
            "en": "The context of the conversation stays saved, so the team can follow the customer clearly."
          },
          "art": {
            "kind": "card",
            "title": {
              "ar": "متابعة على واتساب",
              "en": "Continued on WhatsApp"
            },
            "badge": {
              "ar": "متّصلة",
              "en": "Linked"
            },
            "rows": [
              {
                "k": {
                  "ar": "بدأت في",
                  "en": "Started in"
                },
                "v": {
                  "ar": "ويدجت الموقع",
                  "en": "Site widget"
                }
              },
              {
                "k": {
                  "ar": "الصفحة",
                  "en": "Page"
                },
                "v": {
                  "ar": "الأسعار",
                  "en": "Pricing"
                }
              },
              {
                "k": {
                  "ar": "أُكملت في",
                  "en": "Finished in"
                },
                "v": {
                  "ar": "واتساب",
                  "en": "WhatsApp"
                }
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "أدوات تساعدك على التواصل مع زوار موقعك",
        "en": "Tools that help you talk with your website visitors"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "widget"
        },
        "title": {
          "ar": "تخصيص شكل المحادثة",
          "en": "Customise how the chat looks"
        },
        "body": {
          "ar": "تخصيص مظهر نافذة المحادثة بما يتناسب مع هوية نشاطك.",
          "en": "Adjust the appearance of the chat window to match your brand."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "رسالة ترحيبية",
          "en": "A welcome message"
        },
        "body": {
          "ar": "عرض رسالة ترحيبية للزائر عند فتح نافذة المحادثة.",
          "en": "Show the visitor a welcome message when the chat window opens."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "بدء المحادثة من صفحات محدّدة",
          "en": "Start the chat from specific pages"
        },
        "body": {
          "ar": "إظهار المحادثة بطريقة تناسب الصفحات التي يزورها العميل.",
          "en": "Show the chat in a way that suits the pages your customers visit."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "title": {
          "ar": "معلومات الزائر",
          "en": "Visitor information"
        },
        "body": {
          "ar": "الحصول على المعلومات المتاحة عن الزائر وسياق تواصله.",
          "en": "Get the information available about the visitor and the context of their enquiry."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "تحويل إلى الموظف المناسب",
          "en": "Transfer to the right agent"
        },
        "body": {
          "ar": "انتقال المحادثة إلى الموظف المناسب حسب إعدادات الفريق.",
          "en": "The conversation moves to the right agent according to your team settings."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "clock"
        },
        "title": {
          "ar": "متابعة المحادثات",
          "en": "Follow every conversation"
        },
        "body": {
          "ar": "تبقى جميع المحادثات ضمن صندوق الوارد لمتابعتها والرد عليها.",
          "en": "All conversations stay in the inbox, ready to be followed and answered."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "كل تفاصيل المحادثة أمام الموظف",
          "en": "Every conversation detail in front of the agent"
        },
        "shot": "campaigns",
        "scene": "site-embed",
        "body": {
          "ar": "يظهر سياق المحادثة ومعلومات الزائر للموظف، ليسهل فهم السؤال وتقديم الرد المناسب، بما في ذلك الصفحة التي بدأ منها التواصل.",
          "en": "The context of the conversation and the visitor's information are shown to the agent, making the question easy to understand and answer — including the page the conversation started from."
        },
        "points": {
          "ar": [
            "رسالة ترحيب تلقائية",
            "قواعد حسب الصفحة",
            "أسئلة سريعة جاهزة للنقر",
            "جمع الإيميل قبل بدء المحادثة"
          ],
          "en": [
            "Automatic welcome message",
            "Rules per page",
            "Quick questions ready to tap",
            "Collect an email before the chat starts"
          ]
        }
      },
      {
        "title": {
          "ar": "تواصل مستمرّ حتى خارج أوقات العمل",
          "en": "Reachable even outside working hours"
        },
        "shot": "ai-settings",
        "scene": "instant-reply",
        "body": {
          "ar": "عندما لا يكون الفريق متاحاً، يمكن للزائر ترك رسالته، وتبقى المحادثة محفوظة حتى يتمكّن الموظف من متابعتها.",
          "en": "When the team is not available, the visitor can leave their message, and the conversation stays saved until an agent can follow it."
        },
        "points": {
          "ar": [
            "رد ذكي فوري خارج الدوام",
            "نموذج بيانات تواصل",
            "إشعار للزائر عند وصول ردّ",
            "استكمال المحادثة على واتساب"
          ],
          "en": [
            "Instant smart replies after hours",
            "Contact details form",
            "Notify the visitor when a reply arrives",
            "Continue the conversation on WhatsApp"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "الويدجت بألوانه وسلوكه",
      "en": "The widget, its colours and its behaviour"
    },
    "liveHighlight": {
      "ar": [
        "بألوانه",
        "وسلوكه"
      ],
      "en": [
        "colours",
        "behaviour"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "هل يمكن إضافة المحادثة إلى موقعي؟",
          "en": "Can the chat be added to my website?"
        },
        "a": {
          "ar": "نعم، يمكن إضافة نافذة المحادثة إلى موقعك لتكون متاحة للزوار أثناء التصفّح.",
          "en": "Yes. The chat window can be added to your site so it is available to visitors while they browse."
        }
      },
      {
        "q": {
          "ar": "أين تظهر رسائل زوار الموقع؟",
          "en": "Where do website visitors' messages appear?"
        },
        "a": {
          "ar": "تصل المحادثات مباشرة إلى صندوق الوارد داخل Qhub.",
          "en": "Conversations arrive straight in the inbox inside Qhub."
        }
      },
      {
        "q": {
          "ar": "هل يمكن تخصيص شكل المحادثة؟",
          "en": "Can the chat's appearance be customised?"
        },
        "a": {
          "ar": "نعم، يمكن تخصيص مظهر المحادثة بما يتناسب مع هوية نشاطك.",
          "en": "Yes. The chat's look can be adjusted to match your brand."
        }
      },
      {
        "q": {
          "ar": "هل يمكن معرفة الصفحة التي بدأ منها الزائر المحادثة؟",
          "en": "Can I see which page the visitor started the chat from?"
        },
        "a": {
          "ar": "نعم، يمكن معرفة سياق زيارة الزائر والمعلومات المتاحة عنه.",
          "en": "Yes. You can see the context of the visitor's session and the information available about them."
        }
      },
      {
        "q": {
          "ar": "ماذا يحدث إذا لم يكن هناك موظف متاح؟",
          "en": "What happens if no agent is available?"
        },
        "a": {
          "ar": "يمكن للزائر ترك رسالته، وتبقى المحادثة محفوظة حتى يتمكّن الموظف من متابعتها.",
          "en": "The visitor can leave their message, and the conversation stays saved until an agent can follow it."
        }
      },
      {
        "q": {
          "ar": "هل يمكن تحويل المحادثة إلى موظف معيّن؟",
          "en": "Can the conversation be transferred to a specific agent?"
        },
        "a": {
          "ar": "نعم، يمكن توزيع المحادثات حسب إعدادات الفريق وتحويلها إلى الموظف المناسب.",
          "en": "Yes. Conversations can be routed according to your team settings and transferred to the right agent."
        }
      },
      {
        "q": {
          "ar": "هل تظهر المحادثات السابقة للموظف؟",
          "en": "Does the agent see earlier conversations?"
        },
        "a": {
          "ar": "نعم، يظهر سجلّ المحادثة للموظف حتى يتمكّن من متابعة الحوار من النقطة نفسها.",
          "en": "Yes. The conversation history is shown to the agent, so they can pick up from the same point."
        }
      }
    ]
  },
  "integrations": {
    "eyebrow": {
      "ar": "القنوات والربط",
      "en": "Channels & Integrations"
    },
    "h1": {
      "ar": "كل قنوات التواصل في مكان واحد",
      "en": "Every communication channel in one place"
    },
    "highlight": {
      "ar": [
        "مكان",
        "واحد"
      ],
      "en": [
        "one",
        "place"
      ]
    },
    "lede": {
      "ar": "اربط قنوات التواصل الخاصة بنشاطك مع Qhub، لتصل جميع المحادثات إلى صندوق وارد واحد يتابعها فريقك بسهولة.",
      "en": "Connect the channels your business uses to Qhub, so every conversation reaches a single inbox your team can follow easily."
    },
    "heroShot": "contacts",
    "heroRoute": "contacts",
    "heroScene": "merge",
    "bullets": {
      "ar": [
        "ربط قنوات التواصل من مكان واحد",
        "جمع المحادثات في صندوق وارد موحّد",
        "الحفاظ على سياق كل محادثة"
      ],
      "en": [
        "Connect your communication channels from one place",
        "Gather conversations in a unified inbox",
        "Keep the context of every conversation"
      ]
    },
    "compare": {
      "eyebrow": {
        "ar": "الفرق",
        "en": "The difference"
      },
      "title": {
        "ar": "قنوات متعدّدة، وتجربة واحدة",
        "en": "Several channels, one experience"
      },
      "withoutLabel": {
        "ar": "بدون Qhub",
        "en": "Without Qhub"
      },
      "withLabel": {
        "ar": "مع Qhub",
        "en": "With Qhub"
      },
      "rows": [
        {
          "without": {
            "ar": "المحادثات موزّعة بين أكثر من قناة",
            "en": "Conversations spread across several channels"
          },
          "with": {
            "ar": "جمع المحادثات في صندوق وارد واحد",
            "en": "Conversations gathered in a single inbox"
          }
        },
        {
          "without": {
            "ar": "التنقّل المستمرّ بين الحسابات والمنصّات",
            "en": "Constantly switching between accounts and platforms"
          },
          "with": {
            "ar": "الوصول إلى جميع القنوات من مكان واحد",
            "en": "Reach every channel from one place"
          }
        },
        {
          "without": {
            "ar": "صعوبة متابعة جميع المحادثات",
            "en": "Hard to follow all the conversations"
          },
          "with": {
            "ar": "معرفة مصدر كل محادثة بوضوح",
            "en": "The source of every conversation is clear"
          }
        },
        {
          "without": {
            "ar": "تكرار الرد على العميل نفسه في أكثر من مكان",
            "en": "Answering the same customer in more than one place"
          },
          "with": {
            "ar": "توزيع المحادثات على الموظفين",
            "en": "Conversations distributed across the team"
          }
        },
        {
          "without": {
            "ar": "صعوبة معرفة مصدر كل محادثة",
            "en": "Hard to tell which channel a conversation came from"
          },
          "with": {
            "ar": "متابعة العميل مع الحفاظ على كامل سياق المحادثة",
            "en": "Follow the customer with the full conversation context"
          }
        }
      ]
    },
    "journey": {
      "eyebrow": {
        "ar": "داخل الشاشة",
        "en": "Inside the screen"
      },
      "title": {
        "ar": "من الربط إلى إدارة المحادثات",
        "en": "From connecting to managing conversations"
      },
      "lede": {
        "ar": "بعد ربط القنوات تظهر المحادثات في مكان واحد مع توضيح مصدر كل واحدة. اضغط أي خطوة لتنتقل إليها.",
        "en": "Once the channels are connected, conversations appear in one place with the source of each one shown. Tap any step to jump to it."
      },
      "steps": [
        {
          "title": {
            "ar": "ربط القناة",
            "en": "Connecting the channel"
          },
          "body": {
            "ar": "إضافة قناة التواصل الخاصة بنشاطك وربطها بحساب Qhub.",
            "en": "Add the communication channel your business uses and connect it to your Qhub account."
          },
          "art": {
            "kind": "flow",
            "merge": true,
            "from": "Qhub",
            "to": {
              "ar": [
                "واتساب",
                "إنستغرام",
                "ويدجت الموقع"
              ],
              "en": [
                "WhatsApp",
                "Instagram",
                "Site widget"
              ]
            }
          }
        },
        {
          "title": {
            "ar": "استقبال المحادثات",
            "en": "Conversations arrive"
          },
          "body": {
            "ar": "تصل المحادثات الجديدة تلقائياً إلى صندوق الوارد الموحّد.",
            "en": "New conversations reach the unified inbox automatically."
          },
          "art": {
            "kind": "rules",
            "pairs": [
              {
                "when": {
                  "ar": "رسالة على واتساب",
                  "en": "A WhatsApp message"
                },
                "then": {
                  "ar": "تصل الصندوق",
                  "en": "Lands in the inbox"
                }
              },
              {
                "when": {
                  "ar": "رسالة على إنستغرام",
                  "en": "An Instagram message"
                },
                "then": {
                  "ar": "تصل الصندوق",
                  "en": "Lands in the inbox"
                }
              },
              {
                "when": {
                  "ar": "محادثة من موقعك",
                  "en": "A chat from your site"
                },
                "then": {
                  "ar": "تصل الصندوق",
                  "en": "Lands in the inbox"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "توزيع المحادثات",
            "en": "Routing the conversations"
          },
          "body": {
            "ar": "تُوزَّع المحادثات على الموظفين والأقسام وفق إعدادات الفريق.",
            "en": "Conversations are routed to agents and departments according to your team settings."
          },
          "art": {
            "kind": "card",
            "title": {
              "ar": "محادثة واردة",
              "en": "Incoming conversation"
            },
            "badge": {
              "ar": "أُسندت",
              "en": "Assigned"
            },
            "rows": [
              {
                "k": {
                  "ar": "القناة",
                  "en": "Channel"
                },
                "v": {
                  "ar": "واتساب",
                  "en": "WhatsApp"
                }
              },
              {
                "k": {
                  "ar": "القسم",
                  "en": "Department"
                },
                "v": {
                  "ar": "المبيعات",
                  "en": "Sales"
                }
              },
              {
                "k": {
                  "ar": "الموظف",
                  "en": "Agent"
                },
                "v": {
                  "ar": "منال",
                  "en": "Manal"
                }
              }
            ]
          }
        },
        {
          "title": {
            "ar": "متابعة العميل",
            "en": "Following the customer"
          },
          "body": {
            "ar": "يتابع الموظف المحادثة ويرد عليها مع ظهور كامل السياق.",
            "en": "The agent follows the conversation and replies with the full context in view."
          },
          "art": {
            "kind": "chat",
            "turns": [
              {
                "from": "customer",
                "text": {
                  "ar": "أبغى أستفسر عن خدماتكم",
                  "en": "I would like to ask about your services"
                }
              },
              {
                "from": "agent",
                "text": {
                  "ar": "أهلاً بك، تفضّل — محادثتك السابقة وتفاصيلها كلها أمامي.",
                  "en": "Hello — go ahead. Your earlier conversation and all its details are in front of me."
                }
              }
            ]
          }
        }
      ]
    },
    "extras": {
      "eyebrow": {
        "ar": "تفاصيل إضافية",
        "en": "More details"
      },
      "title": {
        "ar": "أدوات تساعدك على إدارة القنوات",
        "en": "Tools that help you manage your channels"
      }
    },
    "benefits": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "plug"
        },
        "title": {
          "ar": "صندوق وارد موحّد",
          "en": "A unified inbox"
        },
        "body": {
          "ar": "جمع المحادثات القادمة من القنوات المرتبطة في مكان واحد.",
          "en": "Conversations from the connected channels gathered in one place."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "widget"
        },
        "title": {
          "ar": "معرفة مصدر المحادثة",
          "en": "See where a conversation came from"
        },
        "body": {
          "ar": "ظهور القناة التي بدأت منها كل محادثة بشكل واضح.",
          "en": "The channel each conversation started on is clearly shown."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "title": {
          "ar": "ربط أكثر من قناة",
          "en": "Connect more than one channel"
        },
        "body": {
          "ar": "إمكانية ربط أكثر من قناة تواصل ضمن الحساب نفسه.",
          "en": "More than one communication channel can be connected within the same account."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "sparkles"
        },
        "title": {
          "ar": "توزيع المحادثات",
          "en": "Conversation routing"
        },
        "body": {
          "ar": "توزيع المحادثات على الموظفين والأقسام حسب إعدادات الفريق.",
          "en": "Conversations routed to agents and departments according to your team settings."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "title": {
          "ar": "سجلّ موحّد للعميل",
          "en": "A unified customer record"
        },
        "body": {
          "ar": "الوصول إلى سجلّ المحادثات والمعلومات المرتبطة بالعميل.",
          "en": "Reach the conversation history and the information tied to the customer."
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "clock"
        },
        "title": {
          "ar": "إدارة القنوات",
          "en": "Channel management"
        },
        "body": {
          "ar": "إضافة القنوات المرتبطة وإدارة إعداداتها من مكان واحد.",
          "en": "Add connected channels and manage their settings from one place."
        }
      }
    ],
    "details": [
      {
        "title": {
          "ar": "سياق العميل يبقى واضحاً",
          "en": "The customer's context stays clear"
        },
        "shot": "inbox",
        "scene": "channel-list",
        "body": {
          "ar": "مهما كانت القناة التي بدأ منها العميل، تبقى تفاصيل المحادثة وسجلّها ومعلوماته واضحة أمام الموظف، ويمكن تحويلها ومتابعتها من النقطة نفسها.",
          "en": "Whatever channel the customer started on, the conversation details, its history and their information stay clear in front of the agent, and it can be transferred and followed from the same point."
        },
        "points": {
          "ar": [
            "مصدر كل محادثة ظاهر للموظف",
            "سجلّ محادثات العميل في مكان واحد",
            "ملاحظات داخلية على المحادثة",
            "تحويل المحادثة بكامل سياقها"
          ],
          "en": [
            "The source of every conversation is visible to the agent",
            "The customer's conversation history in one place",
            "Internal notes on the conversation",
            "Transfer a conversation with its full context"
          ]
        }
      },
      {
        "title": {
          "ar": "ربط أسهل وإدارة أوضح",
          "en": "Easier connecting, clearer management"
        },
        "shot": "overview",
        "scene": "api-hooks",
        "body": {
          "ar": "يمكن إدارة القنوات المرتبطة ومتابعة حالتها من مكان واحد، مع إضافة قنوات جديدة أو تعديل إعداداتها أو تعطيلها عند الحاجة.",
          "en": "Connected channels can be managed and their status followed from one place, adding new channels or changing or disabling their settings when needed."
        },
        "points": {
          "ar": [
            "إضافة قناة جديدة وإدارتها",
            "متابعة حالة كل قناة مرتبطة",
            "واجهة API وويبهوكس للأنظمة الأخرى",
            "تعطيل القناة أو فصلها عند الحاجة"
          ],
          "en": [
            "Add a new channel and manage it",
            "Follow the status of every connected channel",
            "An API and webhooks for other systems",
            "Disable or disconnect a channel when needed"
          ]
        }
      }
    ],
    "liveTitle": {
      "ar": "خطوات الربط لكل منصّة",
      "en": "The connection steps for each channel"
    },
    "liveHighlight": {
      "ar": [
        "خطوات",
        "الربط"
      ],
      "en": [
        "connection",
        "steps"
      ]
    },
    "faq": [
      {
        "q": {
          "ar": "ما القنوات التي يمكن ربطها مع Qhub؟",
          "en": "Which channels can be connected to Qhub?"
        },
        "a": {
          "ar": "يمكن ربط القنوات التي يدعمها Qhub وإدارتها من خلال صندوق الوارد الموحّد.",
          "en": "The channels Qhub supports can be connected and managed through the unified inbox."
        }
      },
      {
        "q": {
          "ar": "هل تظهر جميع المحادثات في مكان واحد؟",
          "en": "Do all conversations appear in one place?"
        },
        "a": {
          "ar": "نعم، تظهر المحادثات القادمة من القنوات المرتبطة داخل صندوق وارد واحد.",
          "en": "Yes. Conversations from the connected channels appear in a single inbox."
        }
      },
      {
        "q": {
          "ar": "هل يمكن معرفة القناة التي بدأت منها المحادثة؟",
          "en": "Can I see which channel a conversation started on?"
        },
        "a": {
          "ar": "نعم، يظهر مصدر كل محادثة بشكل واضح داخل صندوق الوارد.",
          "en": "Yes. The source of each conversation is clearly shown inside the inbox."
        }
      },
      {
        "q": {
          "ar": "هل يمكن ربط أكثر من قناة في الحساب نفسه؟",
          "en": "Can more than one channel be connected to the same account?"
        },
        "a": {
          "ar": "نعم، يمكن ربط القنوات المتاحة ضمن حساب Qhub نفسه.",
          "en": "Yes. The available channels can be connected within the same Qhub account."
        }
      },
      {
        "q": {
          "ar": "هل يمكن توزيع المحادثات على الموظفين؟",
          "en": "Can conversations be distributed across agents?"
        },
        "a": {
          "ar": "نعم، يمكن توزيع المحادثات حسب الأقسام وإعدادات فريقك.",
          "en": "Yes. Conversations can be routed by department and by your team's settings."
        }
      },
      {
        "q": {
          "ar": "ماذا يحدث عند فصل إحدى القنوات؟",
          "en": "What happens when a channel is disconnected?"
        },
        "a": {
          "ar": "تتوقّف المحادثات الجديدة القادمة من القناة بعد فصلها، بينما تبقى المحادثات السابقة محفوظة داخل النظام.",
          "en": "New conversations from that channel stop once it is disconnected, while earlier conversations stay saved in the system."
        }
      },
      {
        "q": {
          "ar": "هل يحتفظ Qhub بسجلّ المحادثات؟",
          "en": "Does Qhub keep a record of conversations?"
        },
        "a": {
          "ar": "نعم، تبقى المحادثات المرتبطة محفوظة ويمكن الرجوع إليها من خلال صندوق الوارد.",
          "en": "Yes. Connected conversations stay saved and can be revisited through the inbox."
        }
      }
    ]
  }
};
