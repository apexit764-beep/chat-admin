/**
 * محتوى الموقع التعريفي كما هو على الموقع — مولَّد، لا تعدّله يدوياً.
 * المصدر: qhub-site (2026-10-15T11:14:47.766Z)
 * إعادة التوليد: node scripts/import-site-content.mjs <content-seed.json>
 */
import type { SiteContent } from '@/types/siteContent';

export const siteSeed: SiteContent = {
  "home": {
    "sections": [
      {
        "key": "hero",
        "enabled": true,
        "data": {
          "previews": {
            "ar": [
              "وصلني الطلب، شكراً لكم 🙏",
              "كم سعر الباقة الجديدة؟",
              "أبغى أعدّل عنوان التوصيل",
              "متى يفتح المحل اليوم؟",
              "تم إرسال الحملة الإعلانية بنجاح",
              "فريقكم سريع 👏"
            ],
            "en": [
              "The order arrived, thank you 🙏",
              "How much is the new plan?",
              "Can I change the delivery address?",
              "What time do you open today?",
              "Requesting a wholesale quote",
              "Your team is quick 👏"
            ]
          },
          "sectionLabel": {
            "ar": "نظرة عامة على Qhub",
            "en": "An overview of Qhub"
          },
          "badge": {
            "ar": "منصة موحّدة لإدارة محادثات العملاء",
            "en": "One platform for every customer conversation"
          },
          "headline": {
            "ar": [
              "كل",
              "محادثات",
              "عملائك",
              "في",
              "مكان",
              "واحد"
            ],
            "en": [
              "Every",
              "customer",
              "conversation",
              "in",
              "one",
              "place"
            ]
          },
          "lede": {
            "ar": "يجمع Qhub كل محادثات عملائك في مكان واحد، ويساعدك على الرد بشكل أسرع وإدارة محادثاتك بكل سهولة.",
            "en": "Qhub gathers all your customer conversations in one place, helping you reply faster and manage every conversation with ease."
          },
          "start": {
            "ar": "ابدأ مجاناً",
            "en": "Start free"
          },
          "watchDemo": {
            "ar": "شاهد العرض التوضيحي",
            "en": "Watch the demo"
          },
          "inboxTitle": {
            "ar": "الوارد",
            "en": "Inbox"
          },
          "channels": [
            "whatsapp",
            "instagram",
            "telegram",
            "messenger",
            "email",
            "tiktok"
          ],
          "video": {
            "type": "media",
            "url": "https://qhub-lp.apexes.click/videos/demo-v2.mp4",
            "name": "demo-v2.mp4",
            "kind": "video"
          },
          "poster": null
        }
      },
      {
        "key": "how_it_works",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "كيف يعمل",
            "en": "How it works"
          },
          "title": {
            "ar": "من أول رسالة إلى عميل راضٍ",
            "en": "From the first message to a satisfied customer"
          },
          "highlight": {
            "ar": [
              "إلى",
              "عميل",
              "راضٍ"
            ],
            "en": [
              "a",
              "satisfied",
              "customer"
            ]
          },
          "lede": {
            "ar": "كل ما تحتاجه لإدارة محادثات عملائك في 4 خطوات بسيطة.",
            "en": "Everything you need to manage your customer conversations, in 4 simple steps."
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "bolt"
          },
          "steps": [
            {
              "n": "01",
              "title": {
                "ar": "ربط القنوات",
                "en": "Connecting the channels"
              },
              "body": {
                "ar": "اربط قنوات التواصل التي يستخدمها عملاؤك وابدأ خلال دقائق، دون تعقيد تقني.",
                "en": "Connect the channels your customers use and start within minutes, with no technical complexity."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "plug"
              }
            },
            {
              "n": "02",
              "title": {
                "ar": "تجميع المحادثات",
                "en": "Conversations gathered"
              },
              "body": {
                "ar": "كل الرسائل تصل إلى صندوق وارد واحد، حتى لا تضيع أي محادثة أو فرصة.",
                "en": "Every message reaches a single inbox, so no conversation and no opportunity is lost."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "inbox"
              }
            },
            {
              "n": "03",
              "title": {
                "ar": "ردّ المساعد الذكي",
                "en": "The assistant replies"
              },
              "body": {
                "ar": "يرد المساعد فوراً بلهجة العميل، استناداً إلى قاعدة معرفة نشاطك.",
                "en": "The assistant replies instantly in the customer's own language, drawing on your business information."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "sparkles"
              }
            },
            {
              "n": "04",
              "title": {
                "ar": "متابعة الفريق عند الحاجة",
                "en": "The team takes over"
              },
              "body": {
                "ar": "يتم تلخيص المحادثة وإرسالها إلى الموظف المناسب للمتابعة مع العميل.",
                "en": "Automatic handoff to the right agent, with the conversation already summarised."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "users"
              }
            }
          ]
        }
      },
      {
        "key": "features_overview",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "المزايا",
            "en": "Features"
          },
          "title": {
            "ar": "كل الأدوات التي يحتاجها فريقك في مكان واحد",
            "en": "Every tool your team needs in one place"
          },
          "highlight": {
            "ar": [
              "فريقك",
              "في",
              "مكان",
              "واحد"
            ],
            "en": [
              "one",
              "place"
            ]
          },
          "lede": {
            "ar": "بدلاً من التنقل بين عدة تطبيقات وأنظمة، يعطي Qhub فريقك كل ما يحتاجه لإدارة العملاء من منصة واحدة.",
            "en": "Instead of moving between several apps and systems, Qhub gives your team everything it needs to manage customers from a single platform."
          },
          "more": {
            "ar": "تفاصيل الميزة",
            "en": "Feature details"
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "sparkles"
          },
          "art": {
            "inbox": [
              {
                "n": {
                  "ar": "نورة العامري",
                  "en": "Noura Al-Amri"
                },
                "m": {
                  "ar": "وصلني الطلب، شكراً لكم",
                  "en": "Got the order, thank you!"
                }
              },
              {
                "n": {
                  "ar": "متجر لمسة",
                  "en": "Lamsa Store"
                },
                "m": {
                  "ar": "كم سعر الباقة؟",
                  "en": "How much is the plan?"
                }
              },
              {
                "n": {
                  "ar": "خالد الحارثي",
                  "en": "Khalid Al-Harthi"
                },
                "m": {
                  "ar": "متى يفتح المحل؟",
                  "en": "When do you open?"
                }
              }
            ],
            "ask": {
              "ar": "عندكم العرض لسا متاح؟",
              "en": "Is the offer still on?"
            },
            "answer": {
              "ar": "نعم، ما زال متاحاً: خصم ‎25% حتى منتصف ليلة الغد.",
              "en": "It is — ‎25% off until noon tomorrow."
            },
            "speed": {
              "ar": "ردّ خلال ثانيتين",
              "en": "Answered in two seconds"
            },
            "campaign": {
              "ar": "حملة عرض الجمعة",
              "en": "Friday offer campaign"
            },
            "channel": {
              "ar": "واتساب",
              "en": "WhatsApp"
            },
            "bars": {
              "ar": [
                "وصلت",
                "انفتحت",
                "ردّوا"
              ],
              "en": [
                "Delivered",
                "Opened",
                "Replied"
              ]
            },
            "team": [
              {
                "n": {
                  "ar": "منال",
                  "en": "Manal"
                },
                "r": {
                  "ar": "الشحن",
                  "en": "Shipping"
                },
                "s": {
                  "ar": "متاحة",
                  "en": "Available"
                }
              },
              {
                "n": {
                  "ar": "سالم",
                  "en": "Salem"
                },
                "r": {
                  "ar": "المبيعات",
                  "en": "Sales"
                },
                "s": {
                  "ar": "مشغول",
                  "en": "Busy"
                }
              },
              {
                "n": {
                  "ar": "نورة",
                  "en": "Noura"
                },
                "r": {
                  "ar": "الدعم",
                  "en": "Support"
                },
                "s": {
                  "ar": "متاحة",
                  "en": "Available"
                }
              }
            ],
            "chartLabel": {
              "ar": "المحادثات · 7 أيام",
              "en": "Conversations · 7 days"
            },
            "metrics": [
              {
                "u": {
                  "ar": "ث",
                  "en": "s"
                },
                "l": {
                  "ar": "أول رد",
                  "en": "First reply"
                }
              },
              {
                "u": {
                  "ar": "%",
                  "en": "%"
                },
                "l": {
                  "ar": "رضا",
                  "en": "Satisfaction"
                }
              }
            ],
            "domain": {
              "ar": "متجرك.com",
              "en": "yourstore.com"
            },
            "widget": {
              "ar": "كيف نساعدك؟",
              "en": "How can we help?"
            }
          }
        }
      },
      {
        "key": "ai_features",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "الذكاء الاصطناعي",
            "en": "Artificial intelligence"
          },
          "title": {
            "ar": "مساعد ذكي يفهم احتياجات عملائك",
            "en": "An AI assistant that understands what your customers need"
          },
          "highlight": {
            "ar": [
              "يفهم",
              "احتياجات",
              "عملائك"
            ],
            "en": [
              "understands",
              "what",
              "your",
              "customers",
              "need"
            ]
          },
          "lede": {
            "ar": "ذكاء اصطناعي مرتبط بقاعدة معرفة نشاطك، يرد بدقة ويحوّل المحادثة إلى الموظف عند الحاجة.",
            "en": "An assistant connected to your business knowledge base: it answers accurately, and hands the conversation to an agent when one is needed."
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "sparkles"
          },
          "cards": [
            {
              "title": {
                "ar": "يفهم اللغات واللهجات",
                "en": "Understands languages and dialects"
              },
              "body": {
                "ar": "مهما كانت اللهجة، يقرأ نيّة العميل لا كلماته وحدها، ويرد بالنبرة نفسها.",
                "en": "Whatever the dialect, it reads intent, not words alone."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "globe"
              }
            },
            {
              "title": {
                "ar": "يتكلم بصوت علامتك",
                "en": "Speaks in your brand's voice"
              },
              "body": {
                "ar": "حدّد أسلوب الرد: رسمي، أو ودود، أو مختصر، أو أي أسلوب يناسبك.",
                "en": "Set the reply style: formal, friendly or brief."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "heart"
              }
            },
            {
              "title": {
                "ar": "قاعدة معرفة مخصّصة",
                "en": "Your own knowledge base"
              },
              "body": {
                "ar": "يمكنك تزويده بمعلوماتك وأسعارك وسياساتك ليستخدمها في ردوده.",
                "en": "Give it your information, prices and policies to answer from."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "inbox"
              }
            },
            {
              "title": {
                "ar": "تحويل تلقائي إلى موظف",
                "en": "Automatic handoff to an agent"
              },
              "body": {
                "ar": "يقوم بتحويل المحادثة إلى الموظف المناسب عند الحاجة.",
                "en": "It routes the conversation to the right agent when needed."
              },
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "bolt"
              }
            }
          ]
        }
      },
      {
        "key": "chat_story",
        "enabled": true,
        "data": {
          "sectionLabel": {
            "ar": "ديمو تفاعلي لمحادثة داخل Qhub",
            "en": "An interactive demo of a conversation inside Qhub"
          },
          "eyebrow": {
            "ar": "عرض حيّ",
            "en": "Live demo"
          },
          "headA": {
            "ar": "مسار محادثة من أول رسالة إلى",
            "en": "The path of a conversation, from the first message to a"
          },
          "headStretch": {
            "ar": "عميل",
            "en": "reassured"
          },
          "headB": {
            "ar": "مطمئن",
            "en": "customer"
          },
          "lede": {
            "ar": "شاهد كيف يبدأ المساعد المحادثة ويسلّمها لفريقك عند الحاجة، بدون أن يعيد عميلك كلامه من جديد.",
            "en": "See how the assistant starts the conversation and hands it to your team when needed, without your customer having to repeat a word."
          },
          "script": {
            "ar": [
              "السلام عليكم، عندكم العرض لسا متاح؟",
              "وعليكم السلام ورحمة الله. نعم، العرض ما زال متاحاً: خصم ‎25% على كل الطلبات فوق 50 ريال، وينتهي غداً الساعة 12 منتصف الليل.",
              "حلو 👌 بس أنا طلبت قبل أسبوعين وطلبي وصل ناقص قطعة، أبغى أعرف إذا أقدر أستبدلها وأستخدم الخصم على الطلب الجديد؟",
              "الطلب يحتاج مراجعة بشرية · تم التحويل إلى منال (خدمة العملاء) مع ملخّص المحادثة",
              "أهلين أبو خالد، أنا منال 👋 شفت طلبك رقم ‎#4821 — بنرسل لك القطعة الناقصة اليوم بدون رسوم، والخصم بينطبق على طلبك الجديد.",
              "الله يعطيك العافية، خدمة سريعة 🙏"
            ],
            "en": [
              "Hi, is the offer still available?",
              "Hello. It is: ‎25% off every order over 50 SAR, ending tomorrow at midnight.",
              "Nice 👌 But I ordered two weeks ago and a piece was missing. Can I exchange it and still use the discount on a new order?",
              "This case needs a human · handed to Manal (Customer service) with a summary of the conversation",
              "Hi Abu Khalid, I'm Manal 👋 I found order ‎#4821 — we're sending the missing piece today at no charge, and the discount applies to your new order.",
              "That's great, thank you for the quick service 🙏"
            ]
          },
          "beats": [
            {
              "title": {
                "ar": "العميل يبدأ",
                "en": "The customer starts"
              },
              "body": {
                "ar": "تصل رسالته إلى صندوق وارد واحد، أياً كانت القناة التي يفضّلها.",
                "en": "A message arrives from WhatsApp straight into the unified inbox."
              }
            },
            {
              "title": {
                "ar": "الذكاء الاصطناعي يرد",
                "en": "AI answers"
              },
              "body": {
                "ar": "ردّ فوري بلغة عميلك، مبنيّ على معلومات نشاطك لا على التخمين.",
                "en": "An instant reply in the right tone, grounded in your store's knowledge base."
              }
            },
            {
              "title": {
                "ar": "سؤال يحتاج قرار",
                "en": "A question needing judgement"
              },
              "body": {
                "ar": "حالة خارج صلاحيات الرد التلقائي، فيتوقّف المساعد بدل أن يجيب بما لا يعرف.",
                "en": "An exchange plus a discount — beyond what auto-reply is allowed to decide."
              }
            },
            {
              "title": {
                "ar": "تحويل ذكي",
                "en": "Smart handoff"
              },
              "body": {
                "ar": "يحوّلها Qhub إلى الموظف المناسب ومعها ملخّص جاهز، فيبدأ من حيث انتهى المساعد.",
                "en": "Qhub routes it to the right agent with a ready-made summary."
              }
            },
            {
              "title": {
                "ar": "الموظف يكمّل",
                "en": "The agent finishes"
              },
              "body": {
                "ar": "يكمل موظفك بالسياق كاملاً، فيشعر عميلك أنه يتحدّث إلى جهة واحدة طوال الوقت.",
                "en": "Manal continues with the same context — the customer repeats nothing."
              }
            }
          ],
          "contact": {
            "ar": "أبو خالد",
            "en": "Abu Khalid"
          },
          "channelLine": {
            "ar": "واتساب · نشط الآن",
            "en": "WhatsApp · active now"
          },
          "now": {
            "ar": "الآن",
            "en": "now"
          },
          "tryPlaceholder": {
            "ar": "اكتب رسالة لتجرّب…",
            "en": "Try writing a message…"
          },
          "waitPlaceholder": {
            "ar": "انتظر انتهاء المحادثة لتجرّب بنفسك",
            "en": "Wait for the conversation to finish, then try it yourself"
          },
          "tryLabel": {
            "ar": "جرّب رسالة",
            "en": "Try a message"
          },
          "sendLabel": {
            "ar": "إرسال",
            "en": "Send"
          },
          "aiName": {
            "ar": "مساعد Qhub",
            "en": "Qhub assistant"
          },
          "agentInitial": {
            "ar": "م",
            "en": "M"
          },
          "agentName": {
            "ar": "منال · خدمة العملاء",
            "en": "Manal · Customer service"
          },
          "replies": [
            {
              "match": {
                "pattern": {
                  "ar": "سعر|كم|تكلف|بكم|فلوس|ريال",
                  "en": "price|cost|how much|pricing|plan"
                },
                "flags": {
                  "ar": "",
                  "en": "i"
                }
              },
              "reply": {
                "ar": "تبدأ باقاتنا من 19$ شهرياً وتشمل قناتين وموظفَين. هل أرسل لك مقارنة كاملة بين الباقات؟",
                "en": "Our plans start at $19 a month and include two channels and two agents. Would you like a full comparison?"
              }
            },
            {
              "match": {
                "pattern": {
                  "ar": "توصيل|شحن|وصل|طلب|متى",
                  "en": "deliver|shipping|ship|order|when"
                },
                "flags": {
                  "ar": "",
                  "en": "i"
                }
              },
              "reply": {
                "ar": "يصل طلبك عادةً خلال 2–4 أيام عمل. أعطني رقم الطلب لأتابعه لك حالاً.",
                "en": "Orders usually arrive within 2–4 working days. Send me the order number and I'll track it right away."
              }
            },
            {
              "match": {
                "pattern": {
                  "ar": "استبدال|ارجاع|إرجاع|مرتجع|عيب|ناقص",
                  "en": "exchange|return|refund|broken|missing|damaged"
                },
                "flags": {
                  "ar": "",
                  "en": "i"
                }
              },
              "reply": {
                "ar": "نعتذر عن الإزعاج. الاستبدال متاح خلال 14 يوماً من الاستلام، وأحوّلك الآن إلى موظف خدمة العملاء ليكمل معك.",
                "en": "Sorry about that. Exchanges are available within 14 days of delivery, and I'm passing you to a customer service agent now."
              }
            },
            {
              "match": {
                "pattern": {
                  "ar": "سلام|هلا|مرحبا|هاي|صباح|مساء",
                  "en": "hi|hello|hey|salam|morning|evening"
                },
                "flags": {
                  "ar": "",
                  "en": "i"
                }
              },
              "reply": {
                "ar": "أهلاً وسهلاً، معك مساعد Qhub. كيف أستطيع مساعدتك اليوم؟",
                "en": "Hello. You're speaking to the Qhub assistant. How can I help today?"
              }
            },
            {
              "match": {
                "pattern": {
                  "ar": "شكرا|مشكور|يعطيك|تسلم",
                  "en": "thank|thanks|appreciate|cheers"
                },
                "flags": {
                  "ar": "",
                  "en": "i"
                }
              },
              "reply": {
                "ar": "العفو، نحن في خدمتك دائماً. إن احتجت أي شيء آخر فأنا هنا.",
                "en": "Any time. I'm right here whenever you need anything."
              }
            }
          ],
          "fallback": {
            "ar": "وصلتني رسالتك. هذا عرض تجريبي، لكن في حسابك الحقيقي المساعد يرد من قاعدة معرفة متجرك ويحوّل لفريقك وقت ما يحتاج.",
            "en": "Got your message. This is a demo, but in your real account the assistant answers from your store's knowledge base and hands over to your team whenever it needs to."
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "play"
          }
        }
      },
      {
        "key": "sectors",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "القطاعات",
            "en": "Sectors"
          },
          "title": {
            "ar": "مهما كان مجالك، عملاؤك ينتظرون رداً",
            "en": "Sectors running on Qhub today"
          },
          "highlight": {
            "ar": [
              "عملاؤك",
              "ينتظرون",
              "رداً"
            ],
            "en": [
              "Sectors"
            ]
          },
          "lede": {
            "ar": "يعمل Qhub مع مختلف الأنشطة، من المقهى الواحد إلى شبكة المتاجر، بالطريقة التي يحتاجها كل مجال.",
            "en": "Whatever your line of work — from a single coffee shop to a chain of stores."
          },
          "sectors": [
            {
              "title": {
                "ar": "التجارة الإلكترونية",
                "en": "E-commerce"
              },
              "body": {
                "ar": "ردّ في ثوانٍ، يحوّل السؤال إلى طلب.",
                "en": "Answer in seconds, and turn the question into an order."
              }
            },
            {
              "title": {
                "ar": "صنّاع المحتوى",
                "en": "Creators"
              },
              "body": {
                "ar": "ردّ على آلاف الرسائل، دون فريق.",
                "en": "Answer thousands of messages, without a team."
              }
            },
            {
              "title": {
                "ar": "التجزئة والضيافة",
                "en": "Retail & hospitality"
              },
              "body": {
                "ar": "ردّ فوري على كل استفسار، قبل أن يسأل غيرك.",
                "en": "An instant reply to every enquiry, before they ask someone else."
              }
            },
            {
              "title": {
                "ar": "الصحة والتعليم",
                "en": "Health & education"
              },
              "body": {
                "ar": "أسئلة مراجعيك المتكرّرة، يجيب عنها المساعد ليل نهار.",
                "en": "The repeat questions your patients ask, answered day and night."
              }
            },
            {
              "title": {
                "ar": "العقارات",
                "en": "Real estate"
              },
              "body": {
                "ar": "كل مهتمّ بوحدة يصل مندوبه فوراً، بسياق محادثته كاملاً.",
                "en": "Every enquiry reaches its agent at once, with the full conversation behind it."
              }
            },
            {
              "title": {
                "ar": "الخدمات المهنية",
                "en": "Professional services"
              },
              "body": {
                "ar": "كل استشارة تبدأ برسالة، وسجلّها محفوظ بالكامل.",
                "en": "Every engagement starts with a message, and the whole record is kept."
              }
            },
            {
              "title": {
                "ar": "التجميل والعناية",
                "en": "Beauty & wellness"
              },
              "body": {
                "ar": "تصلك الرسائل وأنت مع عميل، والمساعد يرد بدلك.",
                "en": "Messages arrive while you are with a client, and the assistant replies for you."
              }
            }
          ],
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "store"
          },
          "cards": [
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "globe"
              },
              "video": null,
              "poster": null,
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "camera"
              },
              "video": {
                "type": "media",
                "url": "https://qhub-lp.apexes.click/videos/creators.mp4",
                "name": "creators.mp4",
                "kind": "video"
              },
              "poster": {
                "type": "media",
                "url": "https://qhub-lp.apexes.click/videos/creators-poster.jpg",
                "name": "creators-poster.jpg",
                "kind": "image"
              },
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "store"
              },
              "video": null,
              "poster": null,
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "stethoscope"
              },
              "video": null,
              "poster": null,
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "building"
              },
              "video": null,
              "poster": null,
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "briefcase"
              },
              "video": null,
              "poster": null,
              "image": null
            },
            {
              "icon": {
                "type": "library",
                "set": "qhub",
                "name": "heart"
              },
              "video": {
                "type": "media",
                "url": "https://qhub-lp.apexes.click/videos/beauty.mp4",
                "name": "beauty.mp4",
                "kind": "video"
              },
              "poster": {
                "type": "media",
                "url": "https://qhub-lp.apexes.click/videos/beauty-poster.jpg",
                "name": "beauty-poster.jpg",
                "kind": "image"
              },
              "image": null
            }
          ]
        }
      },
      {
        "key": "integrations",
        "enabled": true,
        "data": {
          "titleLead": {
            "ar": "القنوات",
            "en": "Channels"
          },
          "titleRest": {
            "ar": "والربط",
            "en": "& Integrations"
          },
          "lede": {
            "ar": "اربط القنوات التي يستخدمها عملاؤك ومتجرك بحسابك في Qhub، بدون تعقيد تقني.",
            "en": "Connect the channels your customers and your store use to your Qhub account, with no technical complexity."
          },
          "cta": {
            "ar": "اطلب عرضاً توضيحياً",
            "en": "Request a demo"
          },
          "arcs": [
            [
              "whatsapp",
              "instagram",
              "messenger",
              "telegram",
              "tiktok",
              "livechat",
              "gmail",
              "outlook"
            ],
            [
              "salla",
              "zid",
              "shopify",
              "woocommerce",
              "smtp"
            ]
          ]
        }
      },
      {
        "key": "stats",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "بالأرقام",
            "en": "By the numbers"
          },
          "title": {
            "ar": "أرقام تهمّك قبل أن تبدأ",
            "en": "Numbers worth knowing before you start"
          },
          "highlight": {
            "ar": [
              "تهمّك",
              "قبل",
              "أن",
              "تبدأ"
            ],
            "en": [
              "before",
              "you",
              "start"
            ]
          },
          "messages": {
            "ar": "رسالة شهرياً عبر Qhub",
            "en": "messages a month through Qhub"
          },
          "channels": {
            "ar": "قناة ومنصة تربطها بحسابك",
            "en": "channels and platforms to connect"
          },
          "accuracy": {
            "ar": "دقّة في فهم عميلك",
            "en": "accuracy in understanding your customers"
          },
          "response": {
            "ar": "متوسط زمن أول رد",
            "en": "average time to first reply"
          },
          "seconds": {
            "ar": "ث",
            "en": "s"
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "chart"
          },
          "video": {
            "type": "media",
            "url": "https://qhub-lp.apexes.click/videos/dialects.mp4",
            "name": "dialects.mp4",
            "kind": "video"
          },
          "poster": {
            "type": "media",
            "url": "https://qhub-lp.apexes.click/videos/dialects-poster.jpg",
            "name": "dialects-poster.jpg",
            "kind": "image"
          },
          "chips": [
            "whatsapp",
            "instagram",
            "messenger",
            "telegram",
            "gmail",
            "outlook",
            "yahoo",
            "tiktok",
            "livechat",
            "salla",
            "zid",
            "shopify"
          ]
        }
      },
      {
        "key": "testimonials",
        "enabled": true,
        "data": {
          "eyebrow": {
            "ar": "آراء العملاء",
            "en": "Customer stories"
          },
          "title": {
            "ar": "ما الذي تغيّر بعد Qhub؟",
            "en": "What changed after Qhub?"
          },
          "highlight": {
            "ar": [
              "تغيّر",
              "بعد",
              "Qhub؟"
            ],
            "en": [
              "changed",
              "after",
              "Qhub?"
            ]
          },
          "dot": {
            "ar": "الرأي {0}",
            "en": "Testimonial {0}"
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "heart"
          }
        }
      },
      {
        "key": "final_cta",
        "enabled": true,
        "data": {
          "badge": {
            "ar": "جاهز خلال أقل من 10 دقائق",
            "en": "Setup takes under 10 minutes"
          },
          "title": {
            "ar": "ابدأ تجربة Qhub المجانية",
            "en": "Start the free Qhub trial"
          },
          "highlight": {
            "ar": [
              "تجربة",
              "Qhub",
              "المجانية"
            ],
            "en": [
              "free",
              "Qhub",
              "trial"
            ]
          },
          "lede": {
            "ar": "جرّب Qhub مجاناً 7 أيام، وشوف بنفسك كيف تتغيّر سرعة ردودك ورضا عملائك.",
            "en": "Try Qhub free for 7 days and watch how much faster you reply — and how much happier your customers are."
          },
          "primary": {
            "ar": "ابدأ مجاناً",
            "en": "Start free"
          },
          "secondary": {
            "ar": "اطلب عرضاً توضيحياً",
            "en": "Request a demo"
          },
          "perks": {
            "ar": [
              "بدون بطاقة ائتمان",
              "إلغاء في أي وقت",
              "دعم على مدار الساعة"
            ],
            "en": [
              "No credit card",
              "Cancel any time",
              "Support 24/7"
            ]
          },
          "channels": [
            "whatsapp",
            "instagram",
            "telegram",
            "messenger"
          ]
        }
      },
      {
        "key": "partners_marquee",
        "enabled": false,
        "data": {
          "label": {
            "ar": "شركاؤنا وعملاؤنا",
            "en": "Our partners and customers"
          }
        }
      },
      {
        "key": "guided_tour",
        "enabled": false,
        "data": {
          "eyebrow": {
            "ar": "جولة تفاعلية",
            "en": "Interactive tour"
          },
          "heading": {
            "ar": "جرّب Qhub بنفسك قبل التسجيل",
            "en": "Try Qhub yourself before you sign up"
          },
          "highlight": {
            "ar": [
              "بنفسك"
            ],
            "en": [
              "yourself"
            ]
          },
          "lede": {
            "ar": "ست خطوات داخل النظام الحقيقي — دون حساب ودون تنزيل.",
            "en": "Six steps inside the real product — no account, no download."
          },
          "startTitle": {
            "ar": "جولة إرشادية داخل Qhub",
            "en": "A guided tour inside Qhub"
          },
          "startBody": {
            "ar": "ست خطوات قصيرة على شاشات النظام الحقيقية.",
            "en": "Six short steps on the real product screens."
          },
          "startCta": {
            "ar": "ابدأ الجولة الآن",
            "en": "Start the tour"
          },
          "stepOf": {
            "ar": "الخطوة {0} من {1}",
            "en": "Step {0} of {1}"
          },
          "next": {
            "ar": "التالي",
            "en": "Next"
          },
          "restart": {
            "ar": "أعد الجولة",
            "en": "Restart the tour"
          },
          "prev": {
            "ar": "السابق",
            "en": "Back"
          },
          "steps": [
            {
              "title": {
                "ar": "تعرف موقعك من أول نظرة",
                "en": "See where you stand at a glance"
              },
              "body": {
                "ar": "المحادثات المفتوحة والمغلقة والمستلمة، وكل رقم بجانبه تغيّره عن الأسبوع الماضي.",
                "en": "Open, closed and assigned conversations — each number next to how it moved since last week."
              }
            },
            {
              "title": {
                "ar": "كل القنوات في وارد واحد",
                "en": "Every channel in one inbox"
              },
              "body": {
                "ar": "واتساب وإنستغرام وماسنجر والبريد — كل محادثة عليها شعار قناتها وحالتها، ويمكنك تصفيتها بضغطة.",
                "en": "WhatsApp, Instagram, Messenger and email — each conversation carries its channel logo and status, and filters in a click."
              }
            },
            {
              "title": {
                "ar": "سياق العميل بجانب المحادثة",
                "en": "Customer context beside the chat"
              },
              "body": {
                "ar": "بياناته وقسمه ووسومه وسجلّ محادثاته السابقة — كلها ظاهرة وأنت ترد، دون أن تفتح شاشة أخرى.",
                "en": "Their details, department, tags and past conversations — all visible while you reply, without opening another screen."
              }
            },
            {
              "title": {
                "ar": "اضبط المساعد كما تريد",
                "en": "Tune the assistant to your taste"
              },
              "body": {
                "ar": "نبرة الرد، اللهجة، ومتى يحوّل للموظف — كلها إعدادات تتحكم فيها بنفسك.",
                "en": "Reply tone, dialect, and when it hands over to an agent — all settings you control yourself."
              }
            },
            {
              "title": {
                "ar": "حملات تنطلق بضغطة",
                "en": "Campaigns that go out in a click"
              },
              "body": {
                "ar": "اختر القالب والجمهور واضغط إرسال — وتابع معدّل الفتح والردود لحظة بلحظة.",
                "en": "Pick the template and audience, hit send — then watch open and reply rates in real time."
              }
            },
            {
              "title": {
                "ar": "أرقام تقرأ أداء فريقك",
                "en": "Numbers that read your team's performance"
              },
              "body": {
                "ar": "زمن أول رد، نسبة الرضا، وتوزيع المحادثات حسب القناة والموظف — جاهزة للتصدير.",
                "en": "First reply time, satisfaction rate, and conversation split by channel and agent — ready to export."
              }
            }
          ],
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "play"
          }
        }
      },
      {
        "key": "system_preview",
        "enabled": false,
        "data": {
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "widget"
          },
          "screens": [
            {
              "file": "overview",
              "title": {
                "ar": "نظرة عامة",
                "en": "نظرة عامة"
              }
            },
            {
              "file": "inbox",
              "title": {
                "ar": "المحادثات",
                "en": "المحادثات"
              }
            },
            {
              "file": "ai-settings",
              "title": {
                "ar": "إعدادات الذكاء الاصطناعي",
                "en": "إعدادات الذكاء الاصطناعي"
              }
            },
            {
              "file": "campaigns",
              "title": {
                "ar": "الحملات التسويقية",
                "en": "الحملات التسويقية"
              }
            },
            {
              "file": "contacts",
              "title": {
                "ar": "العملاء",
                "en": "العملاء"
              }
            },
            {
              "file": "reports",
              "title": {
                "ar": "التقارير",
                "en": "التقارير"
              }
            }
          ]
        }
      },
      {
        "key": "pricing_teaser",
        "enabled": false,
        "data": {
          "eyebrow": {
            "ar": "الأسعار",
            "en": "Pricing"
          },
          "title": {
            "ar": "باقات واضحة، بدون مفاجآت",
            "en": "Clear plans, no surprises"
          },
          "highlight": {
            "ar": [
              "باقات",
              "واضحة"
            ],
            "en": [
              "Clear",
              "plans"
            ]
          },
          "lede": {
            "ar": "ابدأ مجاناً 7 أيام — دون بطاقة ائتمان، ويمكنك تغيير باقتك في أي وقت.",
            "en": "Start with 7 days free — no credit card, and change your plan whenever you like."
          },
          "featured": {
            "ar": "الأكثر اختياراً",
            "en": "Most popular"
          },
          "perMonth": {
            "ar": "/ شهرياً",
            "en": "/ month"
          },
          "subscribe": {
            "ar": "اشترك الآن",
            "en": "Subscribe now"
          },
          "compare": {
            "ar": "قارن الباقات بالتفصيل",
            "en": "Compare plans in detail"
          },
          "monthly": {
            "ar": "شهري",
            "en": "Monthly"
          },
          "yearly": {
            "ar": "سنوي",
            "en": "Yearly"
          },
          "save": {
            "ar": "وفّر ‎20%",
            "en": "Save 20%"
          },
          "eyebrowIcon": {
            "type": "library",
            "set": "qhub",
            "name": "shield"
          }
        }
      }
    ]
  },
  "features": {
    "cards": [
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
          "ar": "نافذة الدردشة المباشرة",
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
      }
    ],
    "pages": {
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
          "ar": "اربط واتساب وإنستغرام وتيك توك وبريدك ومتجرك، ويجمع Qhub محادثات عملائك في صندوق واحد، لتكون كل محادثة واضحة لفريقك وسهلة المتابعة.",
          "en": "Connect WhatsApp, Instagram, TikTok, your email and your store, and Qhub gathers your customers' conversations into one inbox, so every conversation is clear to your team and easy to follow."
        },
        "heroShot": "inbox",
        "heroRoute": "inbox",
        "heroScene": "merge",
        "bullets": {
          "ar": [
            "كل قنواتك ومتجرك في صندوق واحد، بلا تنقّل بين المنصّات",
            "كل محادثة مرتبطة بالموظف المسؤول عنها",
            "معلومات العميل وسياق المحادثة في المكان نفسه"
          ],
          "en": [
            "Every channel and your store in one inbox, with no platform switching",
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
                "ar": "صعوبة معرفة القناة التي جاءت منها المحادثة",
                "en": "Hard to tell which channel a conversation came from"
              },
              "with": {
                "ar": "مصدر كل محادثة ظاهر من أول نظرة",
                "en": "The source of every conversation visible at a glance"
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
              "name": "plug"
            },
            "title": {
              "ar": "إدارة القنوات",
              "en": "Channel management"
            },
            "body": {
              "ar": "إضافة القنوات وضبط إعداداتها أو فصلها من مكان واحد.",
              "en": "Add channels, adjust their settings or disconnect them from one place."
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
              "ar": "هل يمكن ربط أكثر من حساب؟",
              "en": "Can I link more than one account?"
            },
            "a": {
              "ar": "نعم. يمكنك ربط أكثر من حساب في القناة الواحدة حسب باقتك، وتصل محادثاتها كلها إلى صفحة المحادثات مع إمكانية التصفية حسب القناة. كل بطاقة قناة تعرض عدد الحسابات المتاحة لك والمستخدم منها.",
              "en": "Yes. You can link more than one account per channel, depending on your plan. All their conversations arrive in the Inbox, and you can filter by channel. Each channel card shows how many accounts are available to you and how many are used."
            }
          },
          {
            "q": {
              "ar": "أي قنوات تدعمونها؟",
              "en": "Which channels do you support?"
            },
            "a": {
              "ar": "قنوات المراسلة: واتساب للأعمال، فيسبوك ماسنجر، إنستغرام دايركت، تيليجرام، ونافذة الدردشة المباشرة لموقعك. تيك توك قريباً. ويُستخدم البريد الإلكتروني (Gmail) للحملات والإشعارات.",
              "en": "Messaging channels: WhatsApp Business, Facebook Messenger, Instagram Direct, Telegram and the Live Chat Widget for your website. TikTok is coming soon. Email (Gmail) is used for campaigns and notifications."
            }
          },
          {
            "q": {
              "ar": "كيف تُوزَّع المحادثات على الفريق؟",
              "en": "How are conversations distributed across the team?"
            },
            "a": {
              "ar": "تُسند المحادثة من لوحة التفاصيل إلى موظف مسؤول وقسم، ويمكن تغيير الإسناد في أي وقت. ويُربط كل قسم بقنواته من صفحة الأقسام. وإذا كان المساعد الذكي مفعّلاً، فإنه يحوّل المحادثة إلى الموظف الذي تحدده في التحويل والجدولة.",
              "en": "A conversation is assigned to an employee and a department from the Details panel, and the assignment can be changed at any time. Each department is linked to its channels from Departments. If the Smart Assistant is on, it transfers conversations to the employee you choose in Transfer & schedule."
            }
          },
          {
            "q": {
              "ar": "هل يمكن إعادة إسناد المحادثة أو تحويلها إلى موظف معيّن؟",
              "en": "Can a conversation be reassigned or transferred to a specific employee?"
            },
            "a": {
              "ar": "نعم. من لوحة التفاصيل غيّر الموظف المسؤول أو القسم في أي وقت، وتبقى الرسائل والملاحظات الداخلية في نفس المحادثة.",
              "en": "Yes. In the Details panel, change the assigned employee or department at any time. Messages and internal notes stay in the same conversation."
            }
          },
          {
            "q": {
              "ar": "ماذا يحدث إذا لم يكن هناك موظف متاح؟",
              "en": "What happens if no employee is available?"
            },
            "a": {
              "ar": "تبقى المحادثة بحالة جديدة في صفحة المحادثات حتى يستلمها موظف. وإذا كان المساعد الذكي مفعّلاً على القناة، فإنه يرد على العميل في هذه الأثناء.",
              "en": "The conversation stays New in the Inbox until an employee picks it up. If the Smart Assistant is on for that channel, it replies to the customer in the meantime."
            }
          },
          {
            "q": {
              "ar": "هل يمكن الوصول إلى المحادثات المغلقة؟",
              "en": "Can closed conversations be reached?"
            },
            "a": {
              "ar": "نعم. تبقى المحادثة المغلقة محفوظة، وتظهر عند تصفية القائمة حسب الحالة أو بالبحث. للعمل عليها مرة أخرى اضغط إعادة فتح.",
              "en": "Yes. A closed conversation stays saved and appears when you filter the list by Status or search for it. To work on it again, click Reopen."
            }
          },
          {
            "q": {
              "ar": "هل يرى الموظف المحادثات السابقة للعميل؟",
              "en": "Does the employee see the customer's earlier conversations?"
            },
            "a": {
              "ar": "نعم. كل فتح وإغلاق للمحادثة يُعد جلسة، ويظهر فاصل برقم الجلسة وتاريخها، فيبقى سجل العميل كاملاً في محادثة واحدة أمام الموظف.",
              "en": "Yes. Each time a conversation is opened and closed counts as a session, with a divider showing the session number and date, so the customer's full history stays in one conversation."
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
              "ar": "هل المساعد يفهم اللهجات؟",
              "en": "Does the assistant understand dialects?"
            },
            "a": {
              "ar": "نعم. تختار لهجة الرد من إعدادات الذكاء الاصطناعي ← اللغة والأسلوب: فصحى مبسّطة، خليجية، مصرية، أو شامية.",
              "en": "Yes. Choose the reply dialect in AI settings → Language & tone: Simplified Modern Standard Arabic, Khaleeji, Egyptian or Levantine."
            }
          },
          {
            "q": {
              "ar": "هل يدعم أكثر من لغة؟",
              "en": "Does it support more than one language?"
            },
            "a": {
              "ar": "يرد بالعربية أو الإنجليزية أو بكلتيهما، حسب اختيارك في اللغة والأسلوب.",
              "en": "It replies in Arabic, English or both, depending on what you choose in Language & tone."
            }
          },
          {
            "q": {
              "ar": "كيف أعرّف المساعد على منتجاتي وخدماتي؟",
              "en": "How do I teach the assistant about my products and services?"
            },
            "a": {
              "ar": "من المعرفة والقيود اختر الحساب المرتبط، واكتب تعليمات الشركة (من أنتم، ماذا تقدمون، وكيف يرد المساعد) حتى 4,000 حرف، ثم حدّد مصادر التعلم: المستندات وردود الموظفين. تُضبط الإعدادات لكل حساب مرتبط على حدة.",
              "en": "In Knowledge & limits, choose the linked account and write the Company knowledge (Prompt): who you are, what you offer and how the assistant should reply, up to 4,000 characters. Then select the Learning sources: documents and employee replies. Settings are configured for each linked account separately."
            }
          },
          {
            "q": {
              "ar": "كيف يمكن تخصيص المساعد؟",
              "en": "How can the assistant be customised?"
            },
            "a": {
              "ar": "يمكنك تحديد لغة الرد، والنبرة (مختصر ومباشر، ودود وحماسي، رسمي ومحترف، فاخر وراقي)، واللهجة، وتعليمات الشركة، والمواضيع الممنوعة والرد عليها، والقنوات التي يعمل عليها.",
              "en": "You can set the reply language, the tone (short and direct, friendly and enthusiastic, formal and professional, luxurious and elegant), the dialect, the company knowledge, the forbidden topics and the reply to them, and the channels it works on."
            }
          },
          {
            "q": {
              "ar": "هل يمكنني إيقافه؟",
              "en": "Can I turn it off?"
            },
            "a": {
              "ar": "نعم. أوقفه بالكامل من مفتاح التشغيل الرئيسي في إعدادات الذكاء الاصطناعي، أو شغّله على قنوات معيّنة فقط باختيار القنوات التي يعمل عليها.",
              "en": "Yes. Turn it off completely with the main switch in AI settings, or run it on specific channels only by selecting the Enabled channels."
            }
          },
          {
            "q": {
              "ar": "ماذا يحدث عندما لا يعرف المساعد الإجابة؟",
              "en": "What happens when the assistant doesn't know the answer?"
            },
            "a": {
              "ar": "يعتمد المساعد على ما تحدده أنت. إذا طرح العميل موضوعاً من المواضيع الممنوعة يرسل الرد الذي كتبته لها، وإذا وردت كلمة من الكلمات المفتاحية للتحويل (مثل: شكوى، استرداد) تُحوَّل المحادثة إلى الموظف المحدد. لذلك اكتب تعليمات واضحة، وأضف الكلمات المفتاحية للحالات التي تريد أن يتولاها موظف.",
              "en": "The assistant follows what you set. If a customer raises one of your Forbidden topics, it sends the reply you wrote for them. If a message contains one of your transfer Keywords (for example: complaint, refund), the conversation is transferred to the chosen employee. Write clear instructions and add keywords for the cases you want an employee to handle."
            }
          },
          {
            "q": {
              "ar": "هل يمكن للمساعد تحويل المحادثة إلى موظف؟",
              "en": "Can the assistant transfer a conversation to an employee?"
            },
            "a": {
              "ar": "نعم. فعّل التحويل إلى موظف من التحويل والجدولة، وحدّد شروطه والكلمات المفتاحية والموظف الذي تُحوَّل إليه. بعد التحويل يتولى الموظف الرد، وتبقى المحادثة كاملة أمامه، ويمكنه توليد ملخص لها من لوحة التفاصيل.",
              "en": "Yes. Turn on Transfer to a human agent in Transfer & schedule, and set its conditions, keywords and the employee who receives the conversation. After the transfer, the employee takes over; the full conversation stays in front of them, and they can Generate summary from the Details panel."
            }
          },
          {
            "q": {
              "ar": "هل يعمل المساعد خارج ساعات العمل؟",
              "en": "Does the assistant work outside working hours?"
            },
            "a": {
              "ar": "نعم. حدّد ساعات عمل الموظفين لكل يوم من التحويل والجدولة، والمساعد يرد في باقي الأوقات، أو اجعله يعمل على مدار الساعة. ويمكنك كتابة رسالة تُرسل للعميل خارج ساعات العمل.",
              "en": "Yes. Set the employees' working hours for each day in Transfer & schedule; the assistant replies the rest of the time, or you can let it work around the clock. You can also write a message that is sent outside working hours."
            }
          },
          {
            "q": {
              "ar": "هل تكلفة المساعد الذكي مشمولة في الاشتراك؟",
              "en": "Is the Smart Assistant's cost included in my subscription?"
            },
            "a": {
              "ar": "يعمل المساعد عبر مزوّد ذكاء اصطناعي تربطه بحسابك (OpenAI أو Claude أو Gemini) بمفتاح ربط برمجي (API Key) من حسابك لدى المزوّد، وتكلفة الاستخدام تُدفع للمزوّد مباشرة.",
              "en": "The assistant runs on an AI provider that you connect to your account (OpenAI, Claude or Gemini) with an API key from your account with that provider. Usage is billed by the provider directly."
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
              "ar": "نعم. عند إنشاء الحملة اختر جدولة موعد بدل إرسال الآن، وتظهر الحملات المجدولة في صفحة الحملات التسويقية.",
              "en": "Yes. When creating a campaign, schedule a time instead of choosing Send Now. Scheduled campaigns appear on the Campaigns page."
            }
          },
          {
            "q": {
              "ar": "كيف يتم تحديد الجمهور المستهدف؟",
              "en": "How is the target audience chosen?"
            },
            "a": {
              "ar": "تختار الجمهور المستهدف في خطوة مستقلة أثناء إنشاء الحملة، من جهات الاتصال المسجّلة في حسابك.",
              "en": "You select the Target Audience in its own step while creating the campaign, from the contacts in your account."
            }
          },
          {
            "q": {
              "ar": "هل يمكن متابعة نتائج الحملة؟",
              "en": "Can campaign results be followed?"
            },
            "a": {
              "ar": "نعم. صفحة الحملات التسويقية تعرض إجمالي الحملات والرسائل المُرسلة ومتوسط الفتح والحملات المجدولة، ولكل حملة: الجمهور، عدد المُرسل، معدل الفتح، التاريخ والحالة. ويمكنك تصدير القائمة بصيغة CSV.",
              "en": "Yes. The Campaigns page shows total campaigns, messages sent, average open rate and scheduled campaigns, and for each campaign: audience, sent count, open rate, date and status. You can export the list as CSV."
            }
          },
          {
            "q": {
              "ar": "هل يمكن مراجعة الحملة قبل إرسالها؟",
              "en": "Can a campaign be checked before it is sent?"
            },
            "a": {
              "ar": "راجع المعاينة قبل الإرسال. وللحملات الكبيرة اختر سرعة الإرسال بطيئة لأنها الأكثر أماناً.",
              "en": "Check the Preview before sending. For large campaigns, choose the Slow sending speed; it is the safest."
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
              "ar": "هل يستطيع كل موظف رؤية جميع المحادثات؟",
              "en": "Can every employee see all conversations?"
            },
            "a": {
              "ar": "لا. ما يراه الموظف يحدده الدور المسند إليه والأقسام المرتبط بها. ويمكنك أيضاً تفعيل إخفاء أرقام جهات الاتصال عند دعوته حتى لا يرى أرقام العملاء.",
              "en": "No. What an employee sees depends on their Role and the Departments they belong to. You can also turn on Hide customer numbers when inviting them, so they don't see customers' phone numbers."
            }
          },
          {
            "q": {
              "ar": "هل يمكنني متابعة أداء كل موظف؟",
              "en": "Can I follow each employee's performance?"
            },
            "a": {
              "ar": "نعم. افتح التقارير ← أداء الموظفين: عدد المحادثات، متوسط الرد، نسبة الحل والتقييم. ويظهر ملخص الأداء أيضاً في نظرة عامة.",
              "en": "Yes. Open Reports → Employee performance: conversations, average reply, resolution rate and rating. A summary also appears on Overview."
            }
          },
          {
            "q": {
              "ar": "هل يمكن إعادة إسناد المحادثة أو تحويلها إلى موظف معيّن؟",
              "en": "Can a conversation be reassigned or transferred to a specific employee?"
            },
            "a": {
              "ar": "نعم. من لوحة التفاصيل غيّر الموظف المسؤول أو القسم في أي وقت، وتبقى الرسائل والملاحظات الداخلية في نفس المحادثة.",
              "en": "Yes. In the Details panel, change the assigned employee or department at any time. Messages and internal notes stay in the same conversation."
            }
          },
          {
            "q": {
              "ar": "ماذا يحدث إذا لم يكن هناك موظف متاح؟",
              "en": "What happens if no employee is available?"
            },
            "a": {
              "ar": "تبقى المحادثة بحالة جديدة في صفحة المحادثات حتى يستلمها موظف. وإذا كان المساعد الذكي مفعّلاً على القناة، فإنه يرد على العميل في هذه الأثناء.",
              "en": "The conversation stays New in the Inbox until an employee picks it up. If the Smart Assistant is on for that channel, it replies to the customer in the meantime."
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
                      "ar": "تيك توك",
                      "en": "TikTok"
                    },
                    "sub": {
                      "ar": "متوسط الردّ 4.1 د",
                      "en": "Avg. reply 4.1 m"
                    },
                    "ch": "tiktok",
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
              "ar": "هل يمكن تصدير التقارير؟",
              "en": "Can reports be exported?"
            },
            "a": {
              "ar": "نعم. من صفحة التقارير اضغط PDF أو Excel.",
              "en": "Yes. On the Reports page, click PDF or Excel."
            }
          },
          {
            "q": {
              "ar": "هل يمكن مقارنة فترتين؟",
              "en": "Can two periods be compared?"
            },
            "a": {
              "ar": "في نظرة عامة تظهر بجانب كل رقم نسبة التغيّر مقارنة بالفترة السابقة المساوية لها في الطول. غيّر الفترة الزمنية من أعلى الصفحة لتحديث الأرقام.",
              "en": "On Overview, the percentage next to each number shows the change compared with the previous period of the same length. Change the date range at the top of the page to update the numbers."
            }
          },
          {
            "q": {
              "ar": "من يستطيع رؤية تقارير الفريق؟",
              "en": "Who can see the team's reports?"
            },
            "a": {
              "ar": "يعتمد ذلك على صلاحيات الدور؛ ما يصل إليه كل موظف في النظام يحدده الدور المسند إليه في الأدوار والصلاحيات.",
              "en": "It depends on role permissions: what each employee can access is set by their role in Roles & Permissions."
            }
          }
        ]
      },
      "chat-widget": {
        "eyebrow": {
          "ar": "نافذة الدردشة المباشرة",
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
            "ar": "تظهر نافذة الدردشة المباشرة للزائر أثناء تصفّحه، وتصل الرسائل مباشرة إلى فريقك. اضغط أي خطوة لتنتقل إليها.",
            "en": "The chat window appears to visitors while they browse, and the messages reach your team directly. Tap any step to jump to it."
          },
          "steps": [
            {
              "title": {
                "ar": "تظهر للزائر",
                "en": "It appears to the visitor"
              },
              "body": {
                "ar": "تظهر نافذة الدردشة المباشرة داخل الموقع بطريقة بسيطة وسهلة الوصول.",
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
                      "ar": "نافذة الدردشة المباشرة",
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
              "ar": "تخصيص مظهر نافذة الدردشة المباشرة بما يتناسب مع هوية نشاطك.",
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
              "ar": "عرض رسالة ترحيبية للزائر عند فتح نافذة الدردشة المباشرة.",
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
          "ar": "نافذة الدردشة بألوانها وسلوكها",
          "en": "The widget, its colours and its behaviour"
        },
        "liveHighlight": {
          "ar": [
            "بألوانها",
            "وسلوكها"
          ],
          "en": [
            "colours",
            "behaviour"
          ]
        },
        "faq": [
          {
            "q": {
              "ar": "هل يمكن إضافة نافذة الدردشة المباشرة إلى موقعي؟ وأين تظهر رسائلها؟",
              "en": "Can I add live chat to my website, and where do its messages go?"
            },
            "a": {
              "ar": "نعم. اربط نافذة الدردشة المباشرة من الحسابات والربط لتظهر لزوار موقعك، وتصل رسائلهم إلى صفحة المحادثات مثل باقي القنوات.",
              "en": "Yes. Link the Live Chat Widget from Channels & connections so the chat window appears to your website visitors. Their messages arrive in the Inbox like any other channel."
            }
          },
          {
            "q": {
              "ar": "ماذا يحدث إذا لم يكن هناك موظف متاح؟",
              "en": "What happens if no employee is available?"
            },
            "a": {
              "ar": "تبقى المحادثة بحالة جديدة في صفحة المحادثات حتى يستلمها موظف. وإذا كان المساعد الذكي مفعّلاً على القناة، فإنه يرد على العميل في هذه الأثناء.",
              "en": "The conversation stays New in the Inbox until an employee picks it up. If the Smart Assistant is on for that channel, it replies to the customer in the meantime."
            }
          },
          {
            "q": {
              "ar": "هل يمكن إعادة إسناد المحادثة أو تحويلها إلى موظف معيّن؟",
              "en": "Can a conversation be reassigned or transferred to a specific employee?"
            },
            "a": {
              "ar": "نعم. من لوحة التفاصيل غيّر الموظف المسؤول أو القسم في أي وقت، وتبقى الرسائل والملاحظات الداخلية في نفس المحادثة.",
              "en": "Yes. In the Details panel, change the assigned employee or department at any time. Messages and internal notes stay in the same conversation."
            }
          },
          {
            "q": {
              "ar": "هل يرى الموظف المحادثات السابقة للعميل؟",
              "en": "Does the employee see the customer's earlier conversations?"
            },
            "a": {
              "ar": "نعم. كل فتح وإغلاق للمحادثة يُعد جلسة، ويظهر فاصل برقم الجلسة وتاريخها، فيبقى سجل العميل كاملاً في محادثة واحدة أمام الموظف.",
              "en": "Yes. Each time a conversation is opened and closed counts as a session, with a divider showing the session number and date, so the customer's full history stays in one conversation."
            }
          }
        ]
      }
    }
  },
  "solutions": {
    "page": {
      "eyebrow": {
        "ar": "الحلول",
        "en": "Solutions"
      },
      "title": {
        "ar": "إعداد Qhub يختلف حسب القطاع",
        "en": "Qhub configured per sector"
      },
      "highlight": {
        "ar": [
          "حسب",
          "القطاع"
        ],
        "en": [
          "per",
          "sector"
        ]
      },
      "lede": {
        "ar": "المنصّة تُهيّأ لتناسب طبيعة كل قطاع، وتساعدك على إدارة المحادثات والطلبات ومتابعة العملاء بطريقة تناسب احتياجات نشاطك.",
        "en": "The platform adapts to how your sector works, helping you manage conversations and requests and follow up with customers the way your business needs."
      },
      "ctaPrimary": {
        "ar": "ابدأ مجاناً",
        "en": "Start free"
      },
      "ctaSecondary": {
        "ar": "اطلب عرضاً توضيحياً",
        "en": "Request a demo"
      },
      "eyebrowIcon": {
        "type": "library",
        "set": "qhub",
        "name": "globe"
      }
    },
    "items": [
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "store"
        },
        "sector": {
          "ar": "التجارة الإلكترونية",
          "en": "E-commerce"
        },
        "pain": {
          "ar": "تواصل أسهل مع العملاء، ومتابعة أفضل للطلبات والاستفسارات من مكان واحد.",
          "en": "Easier conversations with your customers, and better follow-up on orders and enquiries from one place."
        },
        "wins": {
          "ar": [
            "استفسارات الطلبات تصل إلى صندوق واحد",
            "ردود جاهزة لأسئلة الشحن والاسترجاع",
            "ربط متجرك في سلة أو زد أو شوبيفاي",
            "الرد على استفسارات العملاء بسرعة"
          ],
          "en": [
            "Order enquiries all land in one inbox",
            "Saved replies for shipping and returns",
            "Connect your Salla, Zid or Shopify store",
            "Answer customer questions quickly"
          ]
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "camera"
        },
        "sector": {
          "ar": "صنّاع المحتوى",
          "en": "Creators"
        },
        "pain": {
          "ar": "نظّم تواصل جمهورك معك، واجمع الرسائل والاستفسارات في مكان واحد دون متابعة كل قناة بشكل منفصل.",
          "en": "Organise how your audience reaches you, and gather every message and enquiry in one place instead of watching each channel separately."
        },
        "wins": {
          "ar": [
            "جمع المحادثات في صندوق وارد واحد",
            "تنظيم استفسارات الجمهور",
            "ردود جاهزة للأسئلة المتكرّرة",
            "متابعة المحادثات والردود بوضوح"
          ],
          "en": [
            "Every conversation in a single inbox",
            "Audience enquiries kept organised",
            "Saved replies for repeat questions",
            "Clear follow-up on chats and replies"
          ]
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "stethoscope"
        },
        "sector": {
          "ar": "العيادات والمراكز الطبية",
          "en": "Clinics & medical centers"
        },
        "pain": {
          "ar": "تنظيم استفسارات المراجعين وطلباتهم، مع متابعة المحادثات وتسهيل الوصول إلى المعلومات المهمة.",
          "en": "Keep patient enquiries and requests organised, follow the conversations, and make the information that matters easy to reach."
        },
        "wins": {
          "ar": [
            "استقبال طلبات المراجعين من كل القنوات",
            "ردود جاهزة عن الخدمات وأوقات العمل",
            "تنظيم بيانات العملاء",
            "توزيع المحادثات على الأقسام والموظفين"
          ],
          "en": [
            "Patient requests arrive from every channel",
            "Saved replies on services and opening hours",
            "Customer records kept organised",
            "Routing to the right department and agent"
          ]
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "building"
        },
        "sector": {
          "ar": "العقار",
          "en": "Real estate"
        },
        "pain": {
          "ar": "كل عميل يمرّ بمراحل مختلفة من البحث عن العقار وحتى إتمام الصفقة، لذلك يساعدك Qhub على تنظيم المحادثات ومتابعة العملاء في كل مرحلة.",
          "en": "Every client moves through different stages, from browsing a property to closing the deal — so Qhub helps you organise the conversations and follow each client at every stage."
        },
        "wins": {
          "ar": [
            "تصنيف العملاء بالوسوم حسب مرحلة المتابعة",
            "متابعة العملاء والمهتمين بالعقارات",
            "إرسال معلومات العقارات وصورها من المحادثة",
            "متابعة المحادثات حتى إتمام الصفقة"
          ],
          "en": [
            "Tag clients by their follow-up stage",
            "Follow up with leads and interested buyers",
            "Send listing details and photos from the chat",
            "Follow the conversation through to the deal"
          ]
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "briefcase"
        },
        "sector": {
          "ar": "الخدمات والاستشارات",
          "en": "Services & consulting"
        },
        "pain": {
          "ar": "استفسارات العملاء قد تصل في أوقات مختلفة وتحتاج إلى ردّ سريع قبل انتقال العميل إلى جهة أخرى.",
          "en": "Enquiries arrive at all hours and need a fast reply before the client moves on to someone else."
        },
        "wins": {
          "ar": [
            "ردود فورية على مدار الساعة",
            "قوالب ردود جاهزة للطلبات المتكرّرة",
            "دعم لغات متعدّدة",
            "متابعة العميل بعد انتهاء الخدمة"
          ],
          "en": [
            "Instant replies around the clock",
            "Saved-reply templates for common requests",
            "Support for multiple languages",
            "Follow up once the work is done"
          ]
        }
      },
      {
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "heart"
        },
        "sector": {
          "ar": "التجميل والعناية",
          "en": "Beauty & wellness"
        },
        "pain": {
          "ar": "استفسارات العملاء وطلباتهم في مكان واحد، مع متابعة المحادثات قبل الزيارة وبعدها.",
          "en": "Customer requests and questions in one place, with follow-up before and after the visit."
        },
        "wins": {
          "ar": [
            "استقبال طلبات العملاء واستفساراتهم",
            "قائمة الأسعار والخدمات جاهزة للإرسال",
            "تنظيم بيانات العملاء",
            "متابعة العملاء بعد الزيارة"
          ],
          "en": [
            "Requests and questions arrive in one inbox",
            "A price and service list ready to send",
            "Customer records kept organised",
            "Follow up with customers after the visit"
          ]
        }
      }
    ],
    "faq": [
      {
        "q": {
          "ar": "هل Qhub مناسب لنشاطي؟",
          "en": "Is Qhub a fit for my business?"
        },
        "a": {
          "ar": "نعم، يمكن إعداد Qhub بما يتناسب مع طبيعة نشاطك وطريقة تواصلك مع العملاء، سواء كنت تعمل في التجارة أو الخدمات أو أي قطاع آخر.",
          "en": "Yes. Qhub can be set up to match how your business works and how you talk to your customers — retail, services, or any other sector."
        }
      },
      {
        "q": {
          "ar": "هل يمكن تخصيص Qhub حسب طبيعة النشاط؟",
          "en": "Can Qhub be tailored to my line of work?"
        },
        "a": {
          "ar": "نعم، يمكن تخصيص إعدادات الفريق والمحادثات والصلاحيات والمساعد الذكي بما يناسب احتياجات نشاطك.",
          "en": "Yes. Team settings, conversations, permissions and the AI assistant can all be adjusted to what your business needs."
        }
      },
      {
        "q": {
          "ar": "هل يمكن استخدام Qhub لأكثر من قسم؟",
          "en": "Can we use Qhub across more than one department?"
        },
        "a": {
          "ar": "نعم، يمكن تنظيم الموظفين ضمن أقسام مختلفة وتوزيع المحادثات حسب طبيعة كل قسم.",
          "en": "Yes. Staff can be organised into separate departments, and conversations routed according to what each department handles."
        }
      }
    ]
  },
  "faq": {
    "page": {
      "eyebrow": {
        "ar": "الأسئلة الشائعة",
        "en": "FAQ"
      },
      "title": {
        "ar": "كل ما تحتاج معرفته عن Qhub",
        "en": "Everything you need to know about Qhub"
      },
      "highlight": {
        "ar": [
          "Qhub"
        ],
        "en": [
          "Qhub"
        ]
      },
      "lede": {
        "ar": "جمعنا هنا أكثر الأسئلة التي تصلنا. لم تجد جوابك؟ تحدّث إلينا ونرد عليك سريعاً.",
        "en": "We collected the questions we hear most. Didn't find yours? Message us and we'll answer quickly."
      },
      "eyebrowIcon": {
        "type": "library",
        "set": "qhub",
        "name": "sparkles"
      }
    },
    "directory": {
      "sections": {
        "ar": "الأقسام · {0} سؤال",
        "en": "Sections · {0} questions"
      },
      "navLabel": {
        "ar": "أقسام الأسئلة",
        "en": "Question sections"
      },
      "helpTitle": {
        "ar": "لم تجد جوابك؟",
        "en": "Still stuck?"
      },
      "helpBody": {
        "ar": "تحدّث إلينا، ونرد عليك بالعربية سريعاً.",
        "en": "Message us and we will get back to you quickly."
      },
      "helpCta": {
        "ar": "تواصل معنا",
        "en": "Contact us"
      }
    },
    "defaults": {
      "eyebrow": {
        "ar": "أسئلة شائعة",
        "en": "FAQ"
      },
      "title": {
        "ar": "الأسئلة الأكثر تكراراً",
        "en": "The questions we hear most"
      },
      "highlight": {
        "ar": [
          "الأسئلة"
        ],
        "en": [
          "questions"
        ]
      },
      "eyebrowIcon": {
        "type": "library",
        "set": "qhub",
        "name": "sparkles"
      }
    },
    "groups": [
      {
        "id": "start",
        "title": {
          "ar": "البدء السريع",
          "en": "Getting Started"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "bolt"
        },
        "items": [
          {
            "q": {
              "ar": "ما هو Qhub وكيف يعمل؟",
              "en": "What is Qhub and how does it work?"
            },
            "a": {
              "ar": "Qhub منصة تجمع محادثات عملائك من قنوات التواصل المختلفة في صندوق وارد واحد، ليتمكن فريقك والمساعد الذكي من الرد عليها ومتابعتها من مكان واحد.\nآلية العمل\n1. تربط قنواتك (واتساب، ماسنجر، إنستغرام، تيليجرام، نافذة الدردشة المباشرة) من الحسابات والربط.\n2. تصل رسائل العملاء مباشرة إلى صفحة المحادثات.\n3. يرد المساعد الذكي تلقائيًا إن كان مفعّلًا، ويحوّل المحادثة إلى موظف عند الحاجة.\n4. يرد الموظف المسؤول، ثم يغلق المحادثة عند انتهائها، ويمكن إغلاقها تلقائيًا حسب إعدادات الإغلاق التلقائي.\n5. يستلم العميل رابط تقييم بعد إغلاق المحادثة.\n6. تتابع الأداء من نظرة عامة والتقارير.\nملاحظة: يمكنك أيضًا إرسال حملات تسويقية عبر واتساب والبريد الإلكتروني من الحملات التسويقية.",
              "en": "Qhub brings your customer conversations from different messaging channels into one inbox, so your team and the Smart Assistant can reply and follow up from a single place.\nHow it works\n1. Connect your channels (WhatsApp, Messenger, Instagram, Telegram, Live Chat Widget) from Channels & connections.\n2. Customer messages arrive directly in the Inbox.\n3. The Smart Assistant replies automatically if enabled, and transfers the conversation to an employee when needed.\n4. The assigned employee replies, then closes the conversation when it is done; it can also be closed automatically based on the auto-close settings.\n5. The customer receives a rating link after the conversation is closed.\n6. Track performance from Overview and Reports.\nNote: You can also send marketing campaigns by WhatsApp and email from Campaigns."
            }
          },
          {
            "q": {
              "ar": "إنشاء حساب وتسجيل الدخول",
              "en": "Create an account and sign in"
            },
            "a": {
              "ar": "حساب الشركة يُنشئه مدير الحساب مرة واحدة، ثم يدعو باقي الموظفين.\n1. افتح صفحة إنشاء الحساب في Qhub.\n2. أدخل البيانات المطلوبة.\n3. وافق على الشروط والأحكام ثم اضغط إنشاء الحساب.\n4. أكمل خطوة التحقق من الحساب (OTP).\n5. لتسجيل الدخول لاحقًا: أدخل البريد الإلكتروني وكلمة المرور.\nملاحظة: الموظفون لا يُنشئون حسابات بأنفسهم؛ تصلهم دعوة بالبريد من فريق العمل.",
              "en": "The company account is created once by the account owner, who then invites the rest of the team.\n1. Open the Qhub sign-up page.\n2. Enter the required details.\n3. Accept the terms and conditions, then click Create account.\n4. Complete the account verification step (OTP).\n5. To sign in later, enter your email and password.\nNote: Employees do not sign up by themselves; they receive an email invitation from Team."
            }
          },
          {
            "q": {
              "ar": "خطوات الإعداد الأولى",
              "en": "First-time setup checklist"
            },
            "a": {
              "ar": "اتبع هذا الترتيب لتجهيز حسابك لاستقبال أول محادثة.\n1. أكمل بيانات شركتك من الإعدادات ← إعدادات الشركة.\n2. اربط أول قناة من الحسابات والربط (إجباري لنجاح عمل النظام).\n3. ادعُ موظفيك من فريق العمل وحدّد دور كل موظف وأقسامه.\n4. فعّل المساعد الذكي من إعدادات الذكاء الاصطناعي.\n5. أضف الردود السريعة والوسوم من الإعدادات.\n6. أرسل رسالة تجريبية إلى قناتك وتأكد من ظهورها في المحادثات.",
              "en": "Follow this order to get your account ready for its first conversation.\n1. Complete your company details in Settings → Company.\n2. Connect your first channel from Channels & connections (mandatory for the system to work).\n3. Invite your employees from Team and set each employee's role and departments.\n4. Enable the Smart Assistant from AI settings.\n5. Add quick replies and tags from Settings.\n6. Send a test message to your channel and make sure it appears in the Inbox."
            }
          },
          {
            "q": {
              "ar": "جولة في لوحة التحكم",
              "en": "A tour of the dashboard"
            },
            "a": {
              "ar": "تتكون الواجهة من قائمة جانبية للتنقل وشريط علوي للأدوات السريعة.\nالقائمة الجانبية\n• الرئيسية: نظرة عامة، المحادثات، جهات الاتصال، التقارير.\n• الإدارة: الحسابات والربط، الأقسام، فريق العمل، الحملات التسويقية، إعدادات الذكاء الاصطناعي.\n• النظام: الشكاوى والاقتراحات، الباقات والاشتراك، الإعدادات.\nالشريط العلوي\n• البحث: ابحث في المحادثات وجهات الاتصال والموظفين.\n• قاعدة المعرفة: أيقونة المساعدة لفتح مقالات الشرح.\n• الإشعارات: تنبيهات تخص الباقات والموظفين والشكاوى والقنوات.\n• الملف الشخصي: بيانات حسابك وتسجيل الخروج.\nملاحظة: ما يمكنك الوصول إليه يعتمد على صلاحيات دورك.",
              "en": "The interface has a sidebar for navigation and a top bar for quick tools.\nSidebar\n• Main: Overview, Inbox, Contacts, Reports.\n• Management: Channels & connections, Departments, Team, Campaigns, AI settings.\n• System: Complaints & Suggestions, Plans & billing, Settings.\nTop bar\n• Search: search conversations, contacts and employees.\n• Knowledge base: the help icon that opens the help articles.\n• Notifications: alerts about plans, employees, complaints and channels.\n• Profile: your account details and sign out.\nNote: What you can access depends on the permissions of your role."
            }
          }
        ]
      },
      {
        "id": "channels",
        "title": {
          "ar": "القنوات",
          "en": "Channels"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "plug"
        },
        "items": [
          {
            "q": {
              "ar": "القنوات المتاحة وعدد الحسابات",
              "en": "Available channels and number of accounts"
            },
            "a": {
              "ar": "القناة هي الوسيلة التي يتواصل بها عملاؤك معك. يمكنك ربط أكثر من حساب في القناة الواحدة حسب باقتك.\nقنوات المراسلة\n• واتساب للأعمال\n• فيسبوك ماسنجر\n• إنستغرام دايركت\n• تيليجرام\n• نافذة الدردشة المباشرة (لموقعك الإلكتروني)\n• تيك توك (قريبًا)\nالبريد الإلكتروني\n• Gmail: يُستخدم للحملات والإشعارات.\nملاحظة: كل بطاقة قناة تعرض عدد الحسابات المتاحة لك وعدد المستخدم منها.\nملاحظة: اضغط إدارة في بطاقة القناة لفتح صفحتها: عن القناة، الحسابات المرتبطة، كيفية الربط.",
              "en": "A channel is the way your customers reach you. You can link more than one account per channel, depending on your plan.\nMessaging channels\n• WhatsApp Business\n• Facebook Messenger\n• Instagram Direct\n• Telegram\n• Live Chat Widget (for your website)\n• TikTok (coming soon)\nEmail\n• Gmail: used for campaigns and notifications.\nNote: Each channel card shows how many accounts are available to you and how many are used.\nNote: Click Manage on a channel card to open its page: About the Channel, Linked Accounts, How to Link."
            }
          },
          {
            "q": {
              "ar": "ربط واتساب للأعمال",
              "en": "Connect WhatsApp Business"
            },
            "a": {
              "ar": "يوفّر Qhub ثلاث طرق لربط رقم واتساب. اختر الطريقة الأنسب لك.\n1. افتح الحسابات والربط ثم اضغط إدارة في بطاقة واتساب للأعمال.\n2. اضغط ربط حساب جديد.\n3. اختر طريقة الربط (انظر الطرق أدناه).\n4. اتبع التعليمات حتى يظهر الرقم ضمن الحسابات المرتبطة.\nطرق الربط\n• ربط سريع عبر Meta (موصى به): تسجيل دخول بحساب فيسبوك دون إدخال بيانات يدويًا. يتطلب صلاحيات على حساب Facebook Business.\n• Meta Business Cloud API (موصى به): الربط الرسمي باستخدام بيانات الاعتماد و Webhook. يتطلب إعداد حساب Meta Business وبيانات أكثر.\n• Coexistence: تواصل استخدام تطبيق WhatsApp Business على هاتفك وتُزامَن الرسائل مع Qhub. يجب إبقاء التطبيق متصلًا، وقد يتطلب موافقة Meta.\nملاحظة: رسوم رسائل واتساب تُدفع إلى Meta مباشرة من حسابك لديها، وهي منفصلة عن اشتراك Qhub.\nملاحظة: بعد الربط، أضف الحساب إلى القسم المناسب من الأقسام.",
              "en": "Qhub offers three ways to link a WhatsApp number. Choose the one that suits you.\n1. Open Channels & connections, then click Manage on the WhatsApp Business card.\n2. Click Link New Account.\n3. Choose a linking method (see the methods below).\n4. Follow the instructions until the number appears under Linked Accounts.\nLinking methods\n• Quick link via Meta (recommended): sign in with Facebook, with no manual data entry. Requires permissions on the Facebook Business account.\n• Meta Business Cloud API (recommended): the official connection using credentials and a webhook. Requires a Meta Business setup and more details.\n• WhatsApp Business App (Coexistence): keep using the WhatsApp Business app on your phone while messages sync with Qhub. The app must stay connected, and Meta approval may be required.\nNote: WhatsApp message fees are paid directly to Meta from your Meta account and are separate from your Qhub subscription.\nNote: After linking, add the account to the right department from Departments."
            }
          },
          {
            "q": {
              "ar": "ربط تيليجرام",
              "en": "Connect Telegram"
            },
            "a": {
              "ar": "يُربط تيليجرام عن طريق بوت تنشئه من داخل تيليجرام نفسه.\n1. افتح تيليجرام وابحث عن BotFather.\n2. أنشئ بوتًا جديدًا واتبع تعليمات BotFather.\n3. انسخ رمز البوت (Bot Token) الذي يرسله لك BotFather.\n4. في Qhub افتح الحسابات والربط ثم اضغط إدارة في بطاقة تيليجرام.\n5. اضغط ربط حساب جديد والصق الرمز في معالج الربط.\n6. أكمل الخطوات حتى يظهر البوت ضمن الحسابات المرتبطة.\nملاحظة: احتفظ برمز البوت سرًّا؛ من يملكه يستطيع التحكم في البوت.",
              "en": "Telegram is linked through a bot that you create inside Telegram itself.\n1. Open Telegram and search for BotFather.\n2. Create a new bot and follow BotFather's instructions.\n3. Copy the Bot Token that BotFather sends you.\n4. In Qhub, open Channels & connections and click Manage on the Telegram card.\n5. Click Link New Account and paste the token into the linking wizard.\n6. Complete the steps until the bot appears under Linked Accounts.\nNote: Keep the Bot Token secret; anyone who has it can control the bot."
            }
          },
          {
            "q": {
              "ar": "ربط القنوات الأخرى (ماسنجر، إنستغرام، نافذة الدردشة المباشرة، Gmail)",
              "en": "Connect other channels (Messenger, Instagram, Live Chat Widget, Gmail)"
            },
            "a": {
              "ar": "خطوات الربط واحدة في كل القنوات، وتختلف المتطلبات فقط.\n1. افتح الحسابات والربط.\n2. اضغط إدارة في بطاقة القناة المطلوبة.\n3. اضغط ربط حساب جديد واتبع الخطوات.\n4. تأكد من ظهور الحساب ضمن الحسابات المرتبطة.\nملاحظة: Gmail يُربط بكلمة مرور التطبيقات (App Password) وليس بكلمة مرور بريدك العادية.\nملاحظة: إذا وصلت للحد الأقصى من الحسابات في القناة، ستحتاج إلى ترقية باقتك لإضافة حساب جديد.",
              "en": "The linking steps are the same for every channel; only the requirements differ.\n1. Open Channels & connections.\n2. Click Manage on the channel card you want.\n3. Click Link New Account and follow the steps.\n4. Make sure the account appears under Linked Accounts.\nNote: Gmail is linked with an App Password, not your normal email password.\nNote: If you have reached the maximum number of accounts for a channel, you will need to upgrade your plan to add a new one."
            }
          }
        ]
      },
      {
        "id": "inbox",
        "title": {
          "ar": "المحادثات",
          "en": "Conversations"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "inbox"
        },
        "items": [
          {
            "q": {
              "ar": "صندوق المحادثات",
              "en": "The inbox"
            },
            "a": {
              "ar": "صفحة المحادثات تعرض محادثات العملاء من كل القنوات في قائمة واحدة.\n• البحث: ابحث عن محادثة من مربع البحث أعلى القائمة.\n• تصفية: اعرض المحادثات حسب القناة أو القسم.\n• الترتيب: غيّر ترتيب القائمة.\n• الحالة: اعرض المحادثات حسب حالتها.\n• محادثة جديدة: ابدأ محادثة مع عميل.\nاضغط على أي محادثة لفتحها وقراءة الرسائل والرد عليها.",
              "en": "The Inbox page shows customer conversations from all channels in one list.\n• Search: find a conversation from the search box above the list.\n• Filter: show conversations by channel or department.\n• Sort: change the order of the list.\n• Status: show conversations by their status.\n• New conversation: start a conversation with a customer.\nClick any conversation to open it, read the messages and reply."
            }
          },
          {
            "q": {
              "ar": "الرد على العميل",
              "en": "Reply to a customer"
            },
            "a": {
              "ar": "1. افتح المحادثة من القائمة.\n2. اكتب ردّك في مربع الكتابة أسفل المحادثة.\n3. أضف ما تحتاجه: رد سريع، إيموجي، مرفق أو رسالة صوتية.\n4. اضغط إرسال.\nالملاحظة الداخلية\n• بدّل من رد إلى ملاحظة داخلية لكتابة ملاحظة يراها فريقك فقط ولا تُرسل إلى العميل.\nملاحظة: على واتساب يمكنك الرد برسائل حرة خلال 24 ساعة من آخر رسالة للعميل؛ بعدها تحتاج إلى قالب رسالة معتمد.\nملاحظة: لا يمكن الرد على محادثة مغلقة قبل إعادة فتحها.",
              "en": "1. Open the conversation from the list.\n2. Type your reply in the message box below the conversation.\n3. Add what you need: a quick reply, emoji, attachment or voice message.\n4. Click send.\nInternal note\n• Switch from Reply to Internal note to write a note that only your team can see; it is not sent to the customer.\nNote: On WhatsApp you can reply with free-form messages within 24 hours of the customer's last message; after that you need an approved message template.\nNote: You cannot reply to a closed conversation until it is reopened."
            }
          },
          {
            "q": {
              "ar": "حالات المحادثة والجلسات",
              "en": "Conversation statuses and sessions"
            },
            "a": {
              "ar": "الحالات\n• جديدة: وصلت ولم يبدأ العمل عليها بعد.\n• قيد المعالجة: يعمل عليها أحد الموظفين.\n• مغلقة: انتهت المحادثة.\nتغيير الحالة\n1. افتح المحادثة.\n2. اختر الحالة من القائمة أعلى المحادثة، أو اضغط إغلاق.\n3. عند الإغلاق يُرسل للعميل رابط تقييم.\n4. للعمل على محادثة مغلقة مرة أخرى اضغط إعادة فتح.\nالجلسات\nكل مرة تُفتح فيها المحادثة ثم تُغلق تُعد جلسة. يظهر فاصل برقم الجلسة وتاريخها بين الجلسات، فيبقى سجل العميل كاملًا في محادثة واحدة.\nملاحظة: يمكن ضبط الإغلاق التلقائي للمحادثات بعد عدد ساعات من إعدادات الذكاء الاصطناعي ← التحويل والجدولة.",
              "en": "Statuses\n• New: received and not yet being worked on.\n• In progress: an employee is working on it.\n• Closed: the conversation is finished.\nChange the status\n1. Open the conversation.\n2. Choose the status from the menu above the conversation, or click Close.\n3. When it is closed, a rating link is sent to the customer.\n4. To work on a closed conversation again, click Reopen.\nSessions\nEach time a conversation is opened and then closed counts as one session (shown as Round in the conversation). A divider with the session number and date appears between sessions, so the customer's full history stays in one conversation.\nNote: You can set conversations to close automatically after a number of hours from AI settings → Transfer & schedule."
            }
          },
          {
            "q": {
              "ar": "إسناد المحادثة إلى موظف أو قسم",
              "en": "Assign a conversation to an employee or department"
            },
            "a": {
              "ar": "الإسناد يحدد من المسؤول عن متابعة المحادثة.\n1. افتح المحادثة ثم افتح لوحة التفاصيل.\n2. من حقل الموظف المسؤول اختر الموظف.\n3. من حقل القسم اختر القسم المناسب.\nملاحظة: يمكنك تصفية صندوق المحادثات حسب القسم لمتابعة محادثات كل قسم.\nملاحظة: أداء كل موظف يظهر في التقارير ضمن أداء الموظفين.",
              "en": "Assignment defines who is responsible for following up on the conversation.\n1. Open the conversation, then open the Details panel.\n2. Choose the employee in the assigned employee field.\n3. Choose the right department in the department field.\nNote: You can filter the inbox by department to follow each department's conversations.\nNote: Each employee's performance appears in Reports under Employee performance."
            }
          },
          {
            "q": {
              "ar": "تفاصيل المحادثة والملخص الذكي",
              "en": "Conversation details and AI summary"
            },
            "a": {
              "ar": "لوحة التفاصيل بجانب المحادثة تجمع كل ما يخصها.\n• الموظف المسؤول والقسم: من يتابع المحادثة.\n• الوسوم: أضف وسمًا لتصنيف موضوع المحادثة.\n• تصنيف العميل: حدّد تصنيف جهة الاتصال.\n• خصائص المحادثة: بيانات إضافية عن المحادثة.\n• توليد ملخص: ملخص تلقائي للمحادثة بالذكاء الاصطناعي.\n• ملء الشاشة: عرض المحادثة بكامل الشاشة.",
              "en": "The Details panel next to the conversation gathers everything related to it.\n• Assigned employee and department: who is following the conversation.\n• Tags: add a tag to label the topic of the conversation.\n• Customer category: set the category of the contact.\n• Conversation attributes: extra data about the conversation.\n• Generate summary: an automatic AI summary of the conversation.\n• Full screen: view the conversation in full screen."
            }
          },
          {
            "q": {
              "ar": "بدء محادثة جديدة",
              "en": "Start a new conversation"
            },
            "a": {
              "ar": "1. من المحادثات اضغط محادثة جديدة.\n2. اختر القناة المُرسلة (الحساب الذي سترسل منه).\n3. اختر جهة الاتصال، أو اضغط جهة اتصال جديدة لإضافتها.\n4. اختر الموظف المسؤول، والقسم إن أردت.\n5. اختر قالبًا من قوالب الردود السريعة، أو اتركه بدون قالب لكتابة نص حر.\n6. اكتب الرسالة ثم اضغط إرسال.\nملاحظة: على واتساب، مراسلة عميل لم يراسلك خلال آخر 24 ساعة تتطلب قالب رسالة معتمدًا من Meta.",
              "en": "1. In the Inbox, click New conversation.\n2. Choose the Sending channel (the account you will send from).\n3. Choose the Contact, or click New contact to add one.\n4. Choose the responsible Employee, and the Department if you want.\n5. Choose a template from your quick replies, or leave it without a template to write free text.\n6. Write the Message, then click Send.\nNote: On WhatsApp, messaging a customer who has not messaged you in the last 24 hours requires a message template approved by Meta."
            }
          },
          {
            "q": {
              "ar": "الردود السريعة والوسوم",
              "en": "Quick replies and tags"
            },
            "a": {
              "ar": "الردود السريعة نصوص جاهزة تدرجها أثناء الرد. الوسوم تسميات تصنّف بها المحادثات.\nالردود السريعة\n1. افتح الإعدادات ← الردود السريعة.\n2. اضغط إضافة رد وأدخل اسم الرد ونصه.\n3. نظّم الردود في مجموعات من إدارة التصنيفات.\nالوسوم\n1. افتح الإعدادات ← الوسوم.\n2. اضغط وسم جديد وأدخل اسم الوسم.\nملاحظة: يمكنك أيضًا إضافة وسم جديد مباشرة من لوحة تفاصيل المحادثة.\nملاحظة: توزيع المحادثات حسب الوسم يظهر في التقارير.",
              "en": "Quick replies are ready-made texts you insert while replying. Tags are labels used to classify conversations.\nQuick replies\n1. Open Settings → Quick replies.\n2. Click Add reply and enter the reply name and text.\n3. Organise replies into groups from Manage categories.\nTags\n1. Open Settings → Tags.\n2. Click New tag and enter the tag name.\nNote: You can also add a new tag directly from the conversation details panel.\nNote: The breakdown of conversations by tag appears in Reports."
            }
          }
        ]
      },
      {
        "id": "contacts",
        "title": {
          "ar": "جهات الاتصال",
          "en": "Contacts"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "briefcase"
        },
        "items": [
          {
            "q": {
              "ar": "إضافة جهة اتصال",
              "en": "Add a contact"
            },
            "a": {
              "ar": "صفحة جهات الاتصال هي قائمة عملائك مع رقم أو معرّف كل عميل وآخر تفاعل له وعدد محادثاته.\n1. افتح جهات الاتصال واضغط جهة اتصال جديدة.\n2. أدخل الاسم الكامل.\n3. اختر القناة، ثم أدخل رقم الهاتف أو المعرّف.\n4. اختر تصنيف جهة الاتصال وأضف ملاحظات (اختياري).\n5. اضغط إضافة.\nملاحظة: اضغط عرض بجانب أي جهة اتصال لفتح بياناتها.",
              "en": "The Contacts page is your customer list, with each customer's phone number or username, last interaction and number of conversations.\n1. Open Contacts and click New contact.\n2. Enter the full name.\n3. Choose the channel, then enter the phone number or username.\n4. Choose a contact classification and add notes (optional).\n5. Click Add.\nNote: Click View next to any contact to open its details."
            }
          },
          {
            "q": {
              "ar": "التصنيفات والفلاتر والاستيراد والتصدير",
              "en": "Categories, filters, import and export"
            },
            "a": {
              "ar": "• إدارة التصنيفات: أنشئ تصنيفات لعملائك وعدّلها.\n• البحث: ابحث بالاسم أو الرقم.\n• الفلاتر: صفِّ القائمة حسب القناة، النوع أو الحالة.\n• استيراد/تصدير: أضف جهات اتصال دفعة واحدة من ملف، أو صدّر القائمة.\nملاحظة: تصنيف العميل يظهر أيضًا في لوحة تفاصيل المحادثة ويمكن تغييره منها.",
              "en": "• Manage categories: create and edit categories for your customers.\n• Search: search by name or number.\n• Filters: filter the list by channel, type or status.\n• Import/Export: add contacts in bulk from a file, or export the list.\nNote: The customer category also appears in the conversation details panel and can be changed from there."
            }
          }
        ]
      },
      {
        "id": "team",
        "title": {
          "ar": "الفريق والأدوار",
          "en": "Team & Roles"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "users"
        },
        "items": [
          {
            "q": {
              "ar": "دعوة موظف",
              "en": "Invite an employee"
            },
            "a": {
              "ar": "1. افتح فريق العمل واضغط دعوة موظف.\n2. أدخل الاسم والبريد الإلكتروني (رقم الهاتف اختياري).\n3. اختر الدور.\n4. اختر الأقسام التي يعمل بها الموظف.\n5. فعّل إخفاء أرقام جهات الاتصال إن أردت ألا يرى الموظف أرقام العملاء.\n6. اضغط إرسال الدعوة.\nملاحظة: يصل الموظف رابط دعوة على بريده، يفتحه ويعيّن كلمة مروره بنفسه.\nملاحظة: من قائمة الفريق يمكنك تعديل بيانات الموظف، تعطيل حسابه أو حذفه.",
              "en": "1. Open Team and click Invite employee.\n2. Enter the name and email (phone number is optional).\n3. Choose the Role.\n4. Choose the Departments the employee works in.\n5. Turn on Hide customer numbers if the employee should not see customer phone numbers.\n6. Click Send invitation.\nNote: The employee receives an invitation link by email, opens it and sets their own password.\nNote: From the team list you can edit an employee, disable their account or delete it."
            }
          },
          {
            "q": {
              "ar": "الأدوار والصلاحيات",
              "en": "Roles and permissions"
            },
            "a": {
              "ar": "الدور مجموعة صلاحيات تحدد ما يستطيع الموظف رؤيته وفعله في النظام.\n1. افتح فريق العمل ثم الأدوار والصلاحيات.\n2. اضغط دور جديد.\n3. اكتب اسم الدور وحدّد صلاحياته.\n4. احفظ الدور، ثم اختره عند دعوة الموظف أو تعديله.\nملاحظة: دور الأدمن دور أساسي في النظام يملك كل الصلاحيات ولا يمكن تعديله.\nملاحظة: تعديل صلاحيات دور يُطبَّق على كل الموظفين المرتبطين به.",
              "en": "A role is a set of permissions that defines what an employee can see and do in the system.\n1. Open Team, then Roles & Permissions.\n2. Click New role.\n3. Enter the role name and select its permissions.\n4. Save the role, then choose it when you invite or edit an employee.\nNote: The Admin role is a built-in system role with all permissions and cannot be edited.\nNote: Changing a role's permissions applies to every employee who has that role."
            }
          },
          {
            "q": {
              "ar": "الأقسام",
              "en": "Departments"
            },
            "a": {
              "ar": "القسم يجمع الموظفين المسؤولين عن نوع من المحادثات، مثل المبيعات أو الدعم.\n1. افتح الأقسام واضغط قسم جديد.\n2. أدخل اسم القسم ووصفه.\n3. اختر لون القسم.\n4. ابحث عن القنوات وأضفها إلى القسم.\n5. اضغط إضافة.\n6. اربط الموظفين بالقسم من فريق العمل عند الدعوة أو التعديل.\nملاحظة: يمكنك تعديل القسم أو حذفه من صفحة الأقسام.",
              "en": "A department groups the employees responsible for one type of conversation, such as Sales or Support.\n1. Open Departments and click New department.\n2. Enter the department name and description.\n3. Choose the department color.\n4. Search for channels and add them to the department.\n5. Click Add.\n6. Link employees to the department from Team when inviting or editing them.\nNote: You can edit or delete a department from the Departments page."
            }
          }
        ]
      },
      {
        "id": "ai",
        "title": {
          "ar": "المساعد الذكي",
          "en": "Smart Assistant (AI)"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "bot"
        },
        "items": [
          {
            "q": {
              "ar": "تفعيل المساعد الذكي وربط المزوّد",
              "en": "Enable the Smart Assistant and connect a provider"
            },
            "a": {
              "ar": "المساعد الذكي يرد على عملائك تلقائيًا باستخدام مزوّد ذكاء اصطناعي تربطه بحسابك.\n1. افتح إعدادات الذكاء الاصطناعي.\n2. فعّل المساعد من مفتاح التشغيل الرئيسي.\n3. في تبويب إعدادات الربط اختر المزوّد: OpenAI أو Claude أو Gemini.\n4. أدخل مفتاح الربط البرمجي (API Key) ثم اضغط فحص الاتصال.\n5. اختر النموذج والحد الأقصى لطول الرد.\n6. حدّد القنوات التي يعمل عليها المساعد.\n7. احفظ التغييرات.\nملاحظة: مفتاح الربط تحصل عليه من حسابك لدى المزوّد، وتكلفة استخدامه تُدفع للمزوّد مباشرة.\nملاحظة: API اختصار Application Programming Interface، أي واجهة الربط البرمجي.",
              "en": "The Smart Assistant replies to your customers automatically, using an AI provider that you connect to your account.\n1. Open AI settings.\n2. Turn the assistant on using the main switch.\n3. In the Connection tab, choose the provider: OpenAI, Claude or Gemini.\n4. Enter the API key, then click Check connection.\n5. Choose the Model and the Max response length.\n6. Select the Enabled channels the assistant works on.\n7. Save your changes.\nNote: You get the API key from your account with the provider, and usage is billed by the provider directly."
            }
          },
          {
            "q": {
              "ar": "لغة المساعد وأسلوبه",
              "en": "Assistant language and tone"
            },
            "a": {
              "ar": "1. افتح إعدادات الذكاء الاصطناعي ← اللغة والأسلوب.\n2. اختر لغات الرد: العربية، الإنجليزية، أو كلتيهما.\n3. اختر النبرة المناسبة لعلامتك.\n4. اختر اللهجة العربية.\n5. احفظ التغييرات.\nالنبرات المتاحة\n• مختصر ومباشر: إجابات سريعة بلا تفاصيل زائدة.\n• ودود وحماسي: لطيف ويستخدم الإيموجي أحيانًا.\n• رسمي ومحترف: لغة جادة ومنظمة.\n• فاخر وراقي: أسلوب يناسب العلامات الفاخرة.\nاللهجات المتاحة\n• فصحى مبسّطة، خليجية، مصرية، شامية.",
              "en": "1. Open AI settings → Language & tone.\n2. Choose the reply languages: Arabic, English, or both.\n3. Choose the tone that fits your brand.\n4. Choose the Arabic dialect.\n5. Save your changes.\nAvailable tones\n• Short and direct: quick answers without extra details.\n• Friendly and enthusiastic: kind, sometimes uses emojis.\n• Formal and professional: serious, organised language.\n• Luxurious and elegant: a style that suits luxury brands.\nAvailable dialects\n• Simplified Modern Standard Arabic, Khaleeji, Egyptian, Levantine."
            }
          },
          {
            "q": {
              "ar": "معرفة المساعد والمواضيع الممنوعة",
              "en": "Assistant knowledge and forbidden topics"
            },
            "a": {
              "ar": "من تبويب المعرفة والقيود تحدد ما يعرفه المساعد عن شركتك وما لا يتحدث فيه. الإعدادات تُضبط لكل حساب مرتبط على حدة.\n1. افتح إعدادات الذكاء الاصطناعي ← المعرفة والقيود.\n2. اختر الحساب المرتبط الذي تريد ضبطه.\n3. اكتب تعليمات الشركة: من أنتم، ماذا تقدمون، وكيف يرد المساعد (حتى 4,000 حرف).\n4. حدّد مصادر التعلم: المستندات، ردود الموظفين.\n5. أضف المواضيع الممنوعة، موضوعًا في كل سطر.\n6. اكتب الرد الذي يُرسَل عند طرح موضوع ممنوع.\n7. احفظ التغييرات.\nملاحظة: كلما كانت التعليمات والمستندات أوضح وأحدث، كانت ردود المساعد أدق.",
              "en": "In the Knowledge & limits tab you define what the assistant knows about your company and what it must not discuss. Settings are configured for each linked account separately.\n1. Open AI settings → Knowledge & limits.\n2. Choose the linked account you want to configure.\n3. Write the Company knowledge (Prompt): who you are, what you offer and how the assistant should reply (up to 4,000 characters).\n4. Select the Learning sources: documents, employee replies.\n5. Add Forbidden topics, one per line.\n6. Write the reply sent when a forbidden topic is raised.\n7. Save your changes.\nNote: The clearer and more up to date your instructions and documents are, the more accurate the assistant's replies will be."
            }
          },
          {
            "q": {
              "ar": "التحويل إلى موظف وساعات عمل المساعد",
              "en": "Transfer to an employee and assistant working hours"
            },
            "a": {
              "ar": "1. افتح إعدادات الذكاء الاصطناعي ← التحويل والجدولة.\n2. فعّل التحويل إلى موظف وحدّد شروطه.\n3. أضف الكلمات المفتاحية التي تُحوَّل المحادثة عند ورودها (مثل: شكوى، استرداد).\n4. اختر الموظف الذي تُحوَّل إليه المحادثة.\n5. حدّد ساعات عمل الموظفين لكل يوم، والمساعد يعمل في باقي الأوقات أو اجعله يعمل على مدار الساعة.\n6. اكتب الرسالة التي تُرسَل خارج ساعات العمل.\n7. فعّل الإغلاق التلقائي وحدّد عدد الساعات (اختياري).\n8. احفظ التغييرات.\nملاحظة: بعد التحويل يتولى الموظف الرد على المحادثة.",
              "en": "1. Open AI settings → Transfer & schedule.\n2. Turn on Transfer to a human agent and set its conditions.\n3. Add the Keywords that trigger transfer (for example: complaint, refund).\n4. Choose the employee the conversation is transferred to.\n5. Set the employees' working hours for each day, and the assistant works the rest of the time, or let it work around the clock.\n6. Write the message sent outside working hours.\n7. Turn on Auto-close conversations and set the number of hours (optional).\n8. Save your changes.\nNote: After the transfer, the employee takes over replying to the conversation."
            }
          }
        ]
      },
      {
        "id": "campaigns",
        "title": {
          "ar": "الحملات التسويقية",
          "en": "Campaigns"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "megaphone"
        },
        "items": [
          {
            "q": {
              "ar": "إنشاء حملة واتساب",
              "en": "Create a WhatsApp campaign"
            },
            "a": {
              "ar": "الحملة رسالة جماعية ترسلها إلى مجموعة من عملائك دفعة واحدة أو في وقت مجدول.\n1. افتح الحملات التسويقية ثم تبويب حملات WhatsApp واضغط حملة جديدة.\n2. أدخل اسم الحملة واختر رقم الإرسال.\n3. اختر رسالة مخصصة أو قوالب الرسائل.\n4. اكتب نص الرسالة (حتى 1000 حرف). يمكنك استخدام المتغيرات بصيغة {{var}}.\n5. أضف مرفقًا (اختياري).\n6. حدّد الجمهور المستهدف.\n7. اختر التوقيت: إرسال الآن أو جدولة موعد.\n8. اختر سرعة الإرسال: بطيئة، عادية أو سريعة.\n9. راجع المعاينة ثم أرسل الحملة.\nملاحظة: يجب ربط حساب واتساب أولًا ليظهر في رقم الإرسال.\nملاحظة: السرعة البطيئة هي الأكثر أمانًا ويُنصح بها للحملات الكبيرة.\nملاحظة: على واتساب، الرسائل التسويقية لعملاء خارج نافذة 24 ساعة تتطلب قالبًا معتمدًا من Meta، وتخضع لرسوم Meta.",
              "en": "A campaign is a bulk message sent to a group of your customers at once or at a scheduled time.\n1. Open Campaigns, go to the WhatsApp campaigns tab and click New campaign.\n2. Enter the Campaign Name and choose the Sending Number.\n3. Choose Custom message or Message templates.\n4. Write the Message Text (up to 1000 characters). You can use variables in the form {{var}}.\n5. Add an Attachment (optional).\n6. Select the Target Audience.\n7. Choose the Timing: Send Now or schedule a time.\n8. Choose the Sending speed: Slow, Normal or Fast.\n9. Check the Preview, then send the campaign.\nNote: A WhatsApp account must be linked first so it appears under Sending Number.\nNote: Slow speed is the safest and is recommended for large campaigns.\nNote: On WhatsApp, marketing messages to customers outside the 24-hour window require a template approved by Meta and are subject to Meta fees."
            }
          },
          {
            "q": {
              "ar": "قوالب الرسائل وحملات البريد",
              "en": "Message templates and email campaigns"
            },
            "a": {
              "ar": "قوالب الرسائل\n1. افتح الحملات التسويقية واضغط إدارة القوالب.\n2. أنشئ قالبًا جديدًا أو عدّل قالبًا موجودًا.\n3. استخدم القالب عند إنشاء حملة باختيار قوالب الرسائل.\nحملات البريد الإلكتروني\n1. اربط بريدك من الحسابات والربط (Gmail).\n2. افتح الحملات التسويقية ثم تبويب حملات Email.\n3. أنشئ الحملة وحدّد الجمهور والتوقيت.",
              "en": "Message templates\n1. Open Campaigns and click Manage templates.\n2. Create a new template or edit an existing one.\n3. Use the template when creating a campaign by choosing Message templates.\nEmail campaigns\n1. Link your email from Channels & connections (Gmail).\n2. Open Campaigns and go to the Email campaigns tab.\n3. Create the campaign and set the audience and timing."
            }
          },
          {
            "q": {
              "ar": "متابعة نتائج الحملات",
              "en": "Track campaign results"
            },
            "a": {
              "ar": "صفحة الحملات التسويقية تعرض ملخصًا لأداء حملاتك.\n• البطاقات: إجمالي الحملات، الرسائل المُرسلة، متوسط الفتح، الحملات المجدولة.\n• جدول الحملات: الرسالة، الجمهور، عدد المُرسل، معدل الفتح، التاريخ والحالة لكل حملة.\n• فلتر الفترة: اعرض حملات فترة زمنية محددة.\n• CSV: صدّر قائمة الحملات إلى ملف.",
              "en": "The Campaigns page shows a summary of how your campaigns are performing.\n• Cards: total campaigns, messages sent, average open rate, scheduled campaigns.\n• Campaigns table: message, audience, sent count, open rate, date and status for each campaign.\n• Period filter: show the campaigns of a specific period.\n• CSV: export the campaigns list to a file."
            }
          }
        ]
      },
      {
        "id": "analytics",
        "title": {
          "ar": "التقارير",
          "en": "Reports"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "chart"
        },
        "items": [
          {
            "q": {
              "ar": "صفحة نظرة عامة",
              "en": "The Overview page"
            },
            "a": {
              "ar": "نظرة عامة هي الصفحة الرئيسية، وتعرض ملخصًا سريعًا لنشاط حسابك خلال الفترة المحددة.\n• البطاقات: أهم أرقام المحادثات في الفترة.\n• المساعد الذكي: ملخص أداء المساعد.\n• محادثات آخر 7 أيام: عدد المحادثات يومًا بيوم.\n• توزيع الحالات: نسبة المحادثات في كل حالة.\n• أحدث المحادثات وأداء الموظفين.\nملاحظة: النسبة المئوية بجانب الرقم تعني التغيّر مقارنة بالفترة السابقة المساوية لها في الطول.\nملاحظة: غيّر الفترة الزمنية من أعلى الصفحة لتحديث الأرقام.",
              "en": "Overview is the home page and shows a quick summary of your account activity during the selected period.\n• Cards: the key conversation numbers for the period.\n• Smart Assistant: a summary of the assistant's performance.\n• Conversations last 7 days: number of conversations day by day.\n• Status distribution: the share of conversations in each status.\n• Latest conversations and Employee performance.\nNote: The percentage next to a number is the change compared with the previous period of the same length.\nNote: Change the date range at the top of the page to update the numbers."
            }
          },
          {
            "q": {
              "ar": "صفحة التقارير والتصدير",
              "en": "The Reports page and exporting"
            },
            "a": {
              "ar": "1. افتح التقارير.\n2. اختر الفترة الزمنية والحساب من الفلاتر أعلى الصفحة.\n3. راجع أقسام التقرير.\n4. اضغط PDF أو Excel لتصدير التقرير.\nأقسام التقرير\n• أداء المساعد الذكي، ومقارنته بالموظفين، وأسباب التحويل إلى موظف.\n• المحادثات الجديدة ووقت الرد الأول.\n• ساعات الذروة: الأوقات الأكثر ازدحامًا خلال الأسبوع.\n• المحادثات حسب الوسم.\n• أداء الموظفين: عدد المحادثات، متوسط الرد، نسبة الحل والتقييم.",
              "en": "1. Open Reports.\n2. Choose the date range and the account from the filters at the top of the page.\n3. Review the report sections.\n4. Click PDF or Excel to export the report.\nReport sections\n• Smart Assistant performance, Smart Assistant vs employees, and reasons for transfer to a human employee.\n• New conversations and first response time.\n• Peak hours: the busiest times during the week.\n• Conversations by tag.\n• Employee performance: conversations, average reply, resolution rate and rating."
            }
          },
          {
            "q": {
              "ar": "تقييمات العملاء",
              "en": "Customer ratings"
            },
            "a": {
              "ar": "بعد إغلاق المحادثة يستلم العميل رابطًا لتقييم المحادثة والموظف.\n1. افتح التقارير وانزل إلى قسم تقييمات جهات الاتصال.\n2. اختر الفترة الزمنية.\n3. راجع توزيع الرضا وملخص سريع.\n4. ابحث بالاسم أو التعليق، أو صفِّ حسب التقييم.\n5. افتح المحادثة المرتبطة بأي تقييم من الجدول.\nملاحظة: جدول التقييمات يعرض تقييم المحادثة، تقييم الموظف، والتعليق الذي كتبه العميل.",
              "en": "After a conversation is closed, the customer receives a link to rate the conversation and the employee.\n1. Open Reports and scroll to the Contact ratings section.\n2. Choose the date range.\n3. Review Satisfaction distribution and Quick summary.\n4. Search by name or comment, or filter by rating.\n5. Open the conversation related to any rating from the table.\nNote: The ratings table shows the conversation rating, the agent rating and the comment written by the customer."
            }
          }
        ]
      },
      {
        "id": "pricing",
        "title": {
          "ar": "الفواتير والاشتراكات",
          "en": "Billing & Subscriptions"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "store"
        },
        "items": [
          {
            "q": {
              "ar": "باقتك الحالية والفترة التجريبية",
              "en": "Your current plan and the trial period"
            },
            "a": {
              "ar": "• افتح الباقات والاشتراك لعرض باقتك الحالية وتفاصيل الاشتراك.\n• في الباقة التجريبية يظهر شريط أعلى الصفحة بعدد الأيام المتبقية وزر اختر باقة.\n• اشترك قبل انتهاء الفترة التجريبية حتى لا تنقطع محادثاتك وإعداداتك.",
              "en": "• Open Plans & billing to see your current plan and Subscription details.\n• On the trial plan, a bar at the top of the page shows the days remaining and a Choose a plan button.\n• Subscribe before the trial ends to keep your conversations and settings without interruption."
            }
          },
          {
            "q": {
              "ar": "تغيير الباقة",
              "en": "Change your plan"
            },
            "a": {
              "ar": "1. افتح الباقات والاشتراك واضغط تغيير الباقة.\n2. اختر دورة الدفع: شهري أو سنوي.\n3. حرّك شريط عدد المحادثات بحسب احتياجك.\n4. قارن بين الباقات ومزاياها ثم اختر الباقة.\n5. أكمل خطوات الدفع.\nملاحظة: لباقة Enterprise اضغط تواصل معنا.\nملاحظة: طلب تغيير الباقة يظهر في تبويب الطلبات.",
              "en": "1. Open Plans & billing and click Change plan.\n2. Choose the billing cycle: monthly or annual.\n3. Move the conversations slider to match your needs.\n4. Compare the plans and their features, then choose a plan.\n5. Complete the payment steps.\nNote: For the Enterprise plan, click Contact us.\nNote: Your plan change request appears in the Orders tab."
            }
          },
          {
            "q": {
              "ar": "الفواتير والطلبات",
              "en": "Invoices and orders"
            },
            "a": {
              "ar": "في صفحة الباقات والاشتراك تبويبان لمتابعة مدفوعاتك.\n• الفواتير: رقم الفاتورة، الوصف، التاريخ، المبلغ والحالة.\n• الطلبات: طلبات الاشتراك وتغيير الباقة وحالة كل طلب.\n• فلتر الحالة: الكل، مدفوعة، بانتظار الدفع.\n• فلتر الفترة: اعرض فواتير فترة زمنية محددة.",
              "en": "The Plans & billing page has two tabs for tracking your payments.\n• Invoices: invoice number, description, date, amount and status.\n• Orders: subscription and plan change requests, with the status of each.\n• Status filter: All, Paid, Awaiting payment.\n• Period filter: show the invoices of a specific period."
            }
          },
          {
            "q": {
              "ar": "طرق الدفع والتجديد التلقائي",
              "en": "Payment methods and auto-renewal"
            },
            "a": {
              "ar": "1. افتح الباقات والاشتراك ← إعدادات الدفع.\n2. راجع طرق الدفع المحفوظة.\n3. حدّد البطاقة الافتراضية أو احذف بطاقة لا تحتاجها.\n4. التجديد التلقائي مفعّل دائمًا ويتم إيقافه عند إلغاء الاشتراك.\nملاحظة: التجديد يتم تلقائيًا ما دام الاشتراك نشطًا.",
              "en": "1. Open Plans & billing → Payment settings.\n2. Review your Saved payment methods.\n3. Set the default card, or remove a card you no longer need.\n4. Auto-renewal is always on and stops when the subscription is cancelled.\nNote: Renewal happens automatically as long as the subscription is active."
            }
          }
        ]
      },
      {
        "id": "security",
        "title": {
          "ar": "الإعدادات والأمان",
          "en": "Settings & Security"
        },
        "icon": {
          "type": "library",
          "set": "qhub",
          "name": "shield"
        },
        "items": [
          {
            "q": {
              "ar": "الملف الشخصي وإعدادات الشركة",
              "en": "Profile and company settings"
            },
            "a": {
              "ar": "الملف الشخصي\n• غيّر صورتك، اسم العرض ورقم الهاتف.\n• تغيير البريد الإلكتروني يتطلب رمز تحقق.\n• من هنا يمكنك أيضًا حذف حسابك نهائيًا.\nإعدادات الشركة\n• الشعار، اسم الشركة، القطاع، حجم الشركة والدولة.\nملاحظة: بعد أي تعديل اضغط حفظ التغييرات.\nملاحظة: حذف الحساب نهائي ولا يمكن التراجع عنه.\nملاحظة: الموظف ليس له صلاحية تغيير البريد الإلكتروني.",
              "en": "Profile\n• Change your photo, display name and phone number.\n• Changing your email requires a verification code.\n• You can also delete your account permanently from here.\nCompany\n• Logo, company name, industry, company size and country.\nNote: After any change, click Save changes.\nNote: Deleting the account is permanent and cannot be undone.\nNote: Employees do not have permission to change the email address."
            }
          },
          {
            "q": {
              "ar": "الإشعارات والمظهر واللغة",
              "en": "Notifications, appearance and language"
            },
            "a": {
              "ar": "• الإشعارات: اختر ما تريد التنبيه عليه: محادثة جديدة، رسالة جديدة، الحملات، إشعارات المتصفح والصوت.\n• المظهر: الوضع الفاتح أو الداكن، حجم الخط، والقائمة الجانبية المصغّرة.\n• اللغة والمنطقة: لغة الواجهة، المنطقة الزمنية وتنسيق التاريخ.",
              "en": "• Notifications: choose what you are alerted about: new conversation, new message, campaigns, browser notifications and sound.\n• Appearance: light or dark mode, font size and compact sidebar.\n• Language & region: interface language, time zone and date format."
            }
          },
          {
            "q": {
              "ar": "أمان الحساب",
              "en": "Account security"
            },
            "a": {
              "ar": "من الإعدادات ← الأمان تتحكم في حماية حسابك.\n• تغيير كلمة المرور: غيّرها دوريًا واستخدم كلمة قوية.\n• التحقق بخطوتين (Two-Factor Authentication – 2FA): خطوة تأكيد إضافية عند تسجيل الدخول.\n• تسجيل الخروج التلقائي: حدّد مدة عدم النشاط التي يُسجَّل بعدها خروجك.\n• الجلسات النشطة: الأجهزة المسجّل منها الدخول. اضغط إنهاء لأي جلسة لا تعرفها.\nملاحظة: إذا رأيت جلسة لا تعرفها: أنهِها ثم غيّر كلمة المرور فورًا.",
              "en": "In Settings → Security you control how your account is protected.\n• Change password: change it regularly and use a strong one.\n• Two-factor authentication (2FA): an extra confirmation step when signing in.\n• Auto logout: set the period of inactivity after which you are signed out.\n• Active sessions: the devices you are signed in from. Click End session for any session you do not recognise.\nNote: If you see a session you do not recognise, end it and change your password immediately."
            }
          },
          {
            "q": {
              "ar": "الدعم والمساعدة",
              "en": "Support and help"
            },
            "a": {
              "ar": "إرسال شكوى أو اقتراح\n1. افتح الشكاوى والاقتراحات واضغط تذكرة جديدة.\n2. اختر النوع: شكوى أو اقتراح.\n3. اختر الأولوية: عالية، متوسطة أو منخفضة.\n4. اكتب الموضوع والوصف بالتفصيل.\n5. اضغط إرسال، وتابع حالة التذكرة والرد على الشكوى من نفس الصفحة.\nطرق مساعدة أخرى\n• قاعدة المعرفة: من أيقونة المساعدة في الشريط العلوي.\n• دردشة الدعم: من أيقونة الدردشة أسفل الصفحة.\nملاحظة: التذاكر ذات الأولوية العالية تُعالج خلال 24 ساعة.",
              "en": "Send a complaint or suggestion\n1. Open Complaints & Suggestions and click New ticket.\n2. Choose the type: Complaint or Suggestion.\n3. Choose the priority: High, Medium or Low.\n4. Write the subject and a detailed description.\n5. Click Send, then follow the ticket status and the reply to your complaint on the same page.\nOther ways to get help\n• Knowledge base: from the help icon in the top bar.\n• Support chat: from the chat icon at the bottom of the page.\nNote: High-priority tickets are handled within 24 hours."
            }
          }
        ]
      }
    ],
    "featureSections": {
      "ar": [],
      "en": []
    },
    "order": [
      "start",
      "channels",
      "inbox",
      "contacts",
      "team",
      "ai",
      "campaigns",
      "analytics",
      "pricing",
      "security"
    ]
  },
  "testimonials": {
    "items": [
      {
        "quote": {
          "ar": "وفّر Qhub علينا وقتاً كبيراً؛ يؤدّي المساعد الذكي عمل ثلاثة موظفين، وجميع المحادثات في شاشة واحدة بدل أربعة تطبيقات.",
          "en": "Qhub saved us a huge amount of time — the AI assistant now does the work of three agents, and every conversation is on one screen instead of four apps."
        },
        "name": {
          "ar": "سعيد الرواحي",
          "en": "Said Al-Rawahi"
        },
        "role": {
          "ar": "مدير التشغيل",
          "en": "Operations Manager"
        },
        "company": {
          "ar": "متجر لمسة",
          "en": "Lamsa Store"
        },
        "initials": {
          "ar": "س ر",
          "en": "SR"
        },
        "tint": "#2563EB"
      },
      {
        "quote": {
          "ar": "يرد المساعد على ‎70% من الأسئلة المتكرّرة بلهجتنا، وأصبح فريقي يركّز على الحالات التي تحتاج تدخّلاً بشرياً فعلاً.",
          "en": "The AI assistant answers ‎70% of repeat questions in our own dialect. My team now focuses on the cases that genuinely need a human."
        },
        "name": {
          "ar": "منى الحبسية",
          "en": "Muna Al-Habsi"
        },
        "role": {
          "ar": "مسؤولة خدمة العملاء",
          "en": "Customer Service Lead"
        },
        "company": {
          "ar": "عيادات نور",
          "en": "Noor Clinics"
        },
        "initials": {
          "ar": "م ح",
          "en": "MH"
        },
        "tint": "#047857"
      },
      {
        "quote": {
          "ar": "ربطنا سلة مع Qhub في اليوم نفسه، وأصبح الموظف يرى تفاصيل الطلب أثناء ردّه على العميل؛ الفرق في السرعة واضح.",
          "en": "We connected Salla to Qhub the same day. Agents see the order details while they reply — it made a huge difference to our speed."
        },
        "name": {
          "ar": "أحمد البلوشي",
          "en": "Ahmed Al-Balushi"
        },
        "role": {
          "ar": "مؤسس",
          "en": "Founder"
        },
        "company": {
          "ar": "دكان",
          "en": "Dukkan"
        },
        "initials": {
          "ar": "أ ب",
          "en": "AB"
        },
        "tint": "#6D28D9"
      },
      {
        "quote": {
          "ar": "أظهرت لنا التقارير أوقات الذروة بدقّة فعدّلنا ورديّات الفريق، وارتفعت نسبة رضا العملاء من ‎78% إلى ‎94%.",
          "en": "The reports showed us exactly when our peaks were, so we reshuffled the shifts. Customer satisfaction went from ‎78% to ‎94%."
        },
        "name": {
          "ar": "ريم الكندية",
          "en": "Reem Al-Kindi"
        },
        "role": {
          "ar": "مديرة تجربة العملاء",
          "en": "Customer Experience Director"
        },
        "company": {
          "ar": "مجموعة الواحة",
          "en": "Al-Waha Group"
        },
        "initials": {
          "ar": "ر ك",
          "en": "RK"
        },
        "tint": "#B45309"
      }
    ]
  },
  "channels": {
    "items": [
      {
        "key": "whatsapp",
        "name": {
          "ar": "واتساب",
          "en": "WhatsApp"
        },
        "tint": "#25D366",
        "ring": "rgba(37,211,102,.18)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/whatsapp.svg",
          "name": "whatsapp.svg",
          "kind": "icon"
        }
      },
      {
        "key": "instagram",
        "name": {
          "ar": "إنستغرام",
          "en": "Instagram"
        },
        "tint": "#D62976",
        "ring": "rgba(214,41,118,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/instagram.svg",
          "name": "instagram.svg",
          "kind": "icon"
        }
      },
      {
        "key": "messenger",
        "name": {
          "ar": "ماسنجر",
          "en": "Messenger"
        },
        "tint": "#006AFF",
        "ring": "rgba(0,106,255,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/messenger.svg",
          "name": "messenger.svg",
          "kind": "icon"
        }
      },
      {
        "key": "telegram",
        "name": {
          "ar": "تيليجرام",
          "en": "Telegram"
        },
        "tint": "#229ED9",
        "ring": "rgba(34,158,217,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/telegram.svg",
          "name": "telegram.svg",
          "kind": "icon"
        }
      },
      {
        "key": "tiktok",
        "name": {
          "ar": "تيك توك",
          "en": "TikTok"
        },
        "tint": "#FE2C55",
        "ring": "rgba(254,44,85,.14)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/tiktok.svg",
          "name": "tiktok.svg",
          "kind": "icon"
        }
      },
      {
        "key": "email",
        "name": {
          "ar": "البريد",
          "en": "Email"
        },
        "tint": "#64748B",
        "ring": "rgba(100,116,139,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/email.svg",
          "name": "email.svg",
          "kind": "icon"
        }
      },
      {
        "key": "gmail",
        "name": {
          "ar": "Gmail",
          "en": "Gmail"
        },
        "tint": "#EA4335",
        "ring": "rgba(234,67,53,.14)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/gmail.svg",
          "name": "gmail.svg",
          "kind": "icon"
        }
      },
      {
        "key": "outlook",
        "name": {
          "ar": "Outlook",
          "en": "Outlook"
        },
        "tint": "#1880E5",
        "ring": "rgba(24,128,229,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/outlook.svg",
          "name": "outlook.svg",
          "kind": "icon"
        }
      },
      {
        "key": "yahoo",
        "name": {
          "ar": "Yahoo",
          "en": "Yahoo"
        },
        "tint": "#7D2EFF",
        "ring": "rgba(125,46,255,.14)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/yahoo.svg",
          "name": "yahoo.svg",
          "kind": "icon"
        }
      },
      {
        "key": "smtp",
        "name": {
          "ar": "SMTP",
          "en": "SMTP"
        },
        "tint": "#475569",
        "ring": "rgba(71,85,105,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/smtp.svg",
          "name": "smtp.svg",
          "kind": "icon"
        }
      },
      {
        "key": "livechat",
        "name": {
          "ar": "الدردشة المباشرة",
          "en": "Live chat"
        },
        "tint": "#2563EB",
        "ring": "rgba(37,99,235,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/livechat.svg",
          "name": "livechat.svg",
          "kind": "icon"
        }
      },
      {
        "key": "salla",
        "name": {
          "ar": "سلة",
          "en": "Salla"
        },
        "tint": "#004956",
        "ring": "rgba(0,73,86,.14)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/salla.svg",
          "name": "salla.svg",
          "kind": "icon"
        }
      },
      {
        "key": "zid",
        "name": {
          "ar": "زد",
          "en": "Zid"
        },
        "tint": "#AE72FF",
        "ring": "rgba(174,114,255,.18)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/zid.svg",
          "name": "zid.svg",
          "kind": "icon"
        }
      },
      {
        "key": "shopify",
        "name": {
          "ar": "شوبيفاي",
          "en": "Shopify"
        },
        "tint": "#95BF47",
        "ring": "rgba(149,191,71,.18)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/shopify.svg",
          "name": "shopify.svg",
          "kind": "icon"
        }
      },
      {
        "key": "woocommerce",
        "name": {
          "ar": "ووكومرس",
          "en": "WooCommerce"
        },
        "tint": "#873EFF",
        "ring": "rgba(135,62,255,.16)",
        "logo": {
          "type": "media",
          "url": "/site-media/channels/woocommerce.svg",
          "name": "woocommerce.svg",
          "kind": "icon"
        }
      }
    ]
  },
  "partners": {
    "items": [
      {
        "key": "sports-for-all",
        "name": {
          "ar": "الرياضة للجميع",
          "en": "Sports for All"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/sports-for-all.svg",
          "name": "sports-for-all.svg",
          "kind": "image"
        },
        "inkRatio": 3.21,
        "inkFill": 0.22
      },
      {
        "key": "taibah-university",
        "name": {
          "ar": "جامعة طيبة",
          "en": "Taibah University"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/taibah-university.svg",
          "name": "taibah-university.svg",
          "kind": "image"
        },
        "inkRatio": 4.43,
        "inkFill": 0.96
      },
      {
        "key": "mawhiba",
        "name": {
          "ar": "موهبة",
          "en": "Mawhiba"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/mawhiba.svg",
          "name": "mawhiba.svg",
          "kind": "image"
        },
        "inkRatio": 2.79,
        "inkFill": 0.99
      },
      {
        "key": "inaash",
        "name": {
          "ar": "منصة إنعاش",
          "en": "Inaash"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/inaash.svg",
          "name": "inaash.svg",
          "kind": "image"
        },
        "inkRatio": 2.44,
        "inkFill": 0.27
      },
      {
        "key": "rasekh",
        "name": {
          "ar": "منصة رسخ",
          "en": "Rasekh"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/rasekh.svg",
          "name": "rasekh.svg",
          "kind": "image"
        },
        "inkRatio": 3.78,
        "inkFill": 0.82
      },
      {
        "key": "beem",
        "name": {
          "ar": "بيم",
          "en": "Beem"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/beem.svg",
          "name": "beem.svg",
          "kind": "image"
        },
        "inkRatio": 3.37,
        "inkFill": 0.16
      },
      {
        "key": "ways",
        "name": {
          "ar": "وايز",
          "en": "Ways"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/ways.svg",
          "name": "ways.svg",
          "kind": "image"
        },
        "inkRatio": 5.06,
        "inkFill": 0.13
      },
      {
        "key": "wateen",
        "name": {
          "ar": "وتين",
          "en": "Wateen"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/wateen.svg",
          "name": "wateen.svg",
          "kind": "image"
        },
        "inkRatio": 2.39,
        "inkFill": 0.29
      },
      {
        "key": "momtathil",
        "name": {
          "ar": "ممتثل",
          "en": "Momtathil"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/momtathil.svg",
          "name": "momtathil.svg",
          "kind": "image"
        },
        "inkRatio": 2.68,
        "inkFill": 0.65
      },
      {
        "key": "rehlat-manafe",
        "name": {
          "ar": "رحلات ومنافع",
          "en": "Rehlat & Manafe"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/rehlat-manafe.svg",
          "name": "rehlat-manafe.svg",
          "kind": "image"
        },
        "inkRatio": 4.5,
        "inkFill": 1
      },
      {
        "key": "expo-time",
        "name": {
          "ar": "اكسبو تايم",
          "en": "Expo Time"
        },
        "logo": {
          "type": "media",
          "url": "https://qhub-lp.apexes.click/partners/expo-time.png",
          "name": "expo-time.png",
          "kind": "image"
        },
        "inkRatio": 3.87,
        "inkFill": 0.94
      }
    ]
  },
  "stats": {
    "items": {
      "messages": {
        "to": 12,
        "suffix": {
          "ar": "M+",
          "en": "M+"
        },
        "duration": 2200
      },
      "channels": {
        "to": 10,
        "unit": {
          "ar": "+",
          "en": "+"
        }
      },
      "accuracy": {
        "to": 95,
        "suffix": {
          "ar": "%+",
          "en": "%+"
        }
      },
      "response": {
        "to": 1.6,
        "decimals": 1
      }
    }
  },
  "legal": {
    "privacy": {
      "title": {
        "ar": "سياسة الخصوصية",
        "en": "Privacy Policy"
      },
      "updated": {
        "ar": "23 أغسطس 2026",
        "en": "23 August 2026"
      },
      "intro": {
        "ar": "توضّح هذه السياسة أنواع البيانات الي نجمعها منك ومن عملائك، وكيف نستخدمها ونحميها، وما هي حقوقك تجاهها.",
        "en": "This policy explains what data we collect from you and your customers, how we use and protect it, and what rights you have over it."
      },
      "sections": [
        {
          "h": {
            "ar": "البيانات الي نجمعها",
            "en": "The data we collect"
          },
          "p": {
            "ar": [
              "نجمع نوعين من البيانات:"
            ],
            "en": [
              "We collect two kinds of data:"
            ]
          },
          "list": {
            "ar": [
              "بيانات حسابك: الاسم، البريد الإلكتروني، رقم الجوال، اسم المنشأة وبيانات الفوترة.",
              "بيانات محادثات عملائك: محتوى الرسائل والمرفقات وأرقام التواصل، وتُخزَّن نيابة عنك بصفتك المتحكّم فيها.",
              "بيانات استخدام تقنية: عنوان IP، نوع المتصفح والجهاز، وسجلات الدخول والأخطاء."
            ],
            "en": [
              "Your account data: name, email address, phone number, organisation name and billing details.",
              "Your customers' conversation data: message content, attachments and contact numbers, stored on your behalf while you remain the controller of it.",
              "Technical usage data: IP address, browser and device type, and sign-in and error logs."
            ]
          }
        },
        {
          "h": {
            "ar": "كيف نستخدم البيانات",
            "en": "How we use the data"
          },
          "p": {
            "ar": [
              "نستخدم البيانات لأغراض محدّدة فقط:"
            ],
            "en": [
              "We use data for specific purposes only:"
            ]
          },
          "list": {
            "ar": [
              "تشغيل الخدمة وتقديم المزايا الي اشتركت فيها.",
              "الدعم الفني والرد على استفساراتك.",
              "تحسين الأداء والاستقرار عبر إحصاءات مجمّعة لا تحدّد هوية أحد.",
              "الفوترة وإرسال إشعارات الخدمة الأساسية."
            ],
            "en": [
              "Running the service and delivering the features you subscribed to.",
              "Technical support and answering your questions.",
              "Improving performance and stability through aggregate statistics that identify nobody.",
              "Billing and sending essential service notifications."
            ]
          }
        },
        {
          "h": {
            "ar": "الذكاء الاصطناعي وبياناتك",
            "en": "Artificial intelligence and your data"
          },
          "p": {
            "ar": [
              "محتوى محادثاتك يُستخدم لتشغيل مزايا الذكاء الاصطناعي داخل حسابك أنت فقط: الردود الآلية وقاعدة المعرفة والتلخيص.",
              "لا نستخدم بياناتك لتدريب نماذج عامة، ولا نشاركها مع عملاء آخرين."
            ],
            "en": [
              "Your conversation content powers the AI features inside your account only — automatic replies, the knowledge base and summarisation.",
              "We do not use your data to train general-purpose models, and we never share it with other customers."
            ]
          }
        },
        {
          "h": {
            "ar": "مشاركة البيانات مع أطراف ثالثة",
            "en": "Sharing data with third parties"
          },
          "p": {
            "ar": [
              "نشارك الحد الأدنى الضروري مع مزوّدي خدمات يشتغلون نيابة عنا وملتزمين باتفاقيات سرّية ومعالجة بيانات:"
            ],
            "en": [
              "We share the minimum necessary with service providers acting on our behalf under confidentiality and data-processing agreements:"
            ]
          },
          "list": {
            "ar": [
              "مزوّدو الاستضافة والبنية التحتية.",
              "مزوّدو منصّات المراسلة الي تربطها (واتساب، ميتا، تيليجرام وغيرها) وفق شروطهم.",
              "بوّابات الدفع لمعالجة الاشتراكات.",
              "جهات حكومية عند وجود إلزام نظامي."
            ],
            "en": [
              "Hosting and infrastructure providers.",
              "The messaging platforms you connect (WhatsApp, Meta, Telegram and others), subject to their terms.",
              "Payment gateways, to process subscriptions.",
              "Government authorities, where legally required."
            ]
          }
        },
        {
          "h": {
            "ar": "أمان البيانات",
            "en": "Data security"
          },
          "p": {
            "ar": [
              "نشفّر البيانات أثناء النقل وأثناء التخزين، ونطبّق صلاحيات وصول صارمة داخل فريقنا مع تسجيل كل وصول.",
              "لا يطّلع أحد من فريقنا على محتوى محادثاتك إلا بطلب دعم منك وبموافقتك."
            ],
            "en": [
              "We encrypt data in transit and at rest, and apply strict internal access controls with every access logged.",
              "Nobody on our team reads your conversation content unless you open a support request and grant access."
            ]
          }
        },
        {
          "h": {
            "ar": "مدة الاحتفاظ",
            "en": "Retention period"
          },
          "p": {
            "ar": [
              "نحتفظ ببياناتك طوال فترة اشتراكك. بعد إنهاء الحساب نحتفظ بها مدة محدودة تسمح لك بالاسترجاع، ثم تُحذف نهائياً ما لم يُلزمنا نظام بخلاف ذلك."
            ],
            "en": [
              "We keep your data for as long as your subscription is active. After the account closes we retain it for a limited window so you can recover it, then delete it permanently unless the law requires otherwise."
            ]
          }
        },
        {
          "h": {
            "ar": "حقوقك",
            "en": "Your rights"
          },
          "p": {
            "ar": [
              "تقدر في أي وقت:"
            ],
            "en": [
              "At any time you can:"
            ]
          },
          "list": {
            "ar": [
              "تطلب نسخة من بياناتك.",
              "تصحّح بيانات غير دقيقة.",
              "تطلب حذف حسابك وبياناته.",
              "تعترض على معالجة معيّنة أو تسحب موافقتك."
            ],
            "en": [
              "Request a copy of your data.",
              "Correct inaccurate data.",
              "Request deletion of your account and its data.",
              "Object to a specific processing activity or withdraw your consent."
            ]
          }
        },
        {
          "h": {
            "ar": "ملفات تعريف الارتباط",
            "en": "Cookies"
          },
          "p": {
            "ar": [
              "نستخدم ملفات ضرورية لتشغيل الموقع وحفظ تفضيلاتك مثل الثيم، وملفات تحليلية اختيارية تقدر ترفضها بدون ما تتأثر الخدمة."
            ],
            "en": [
              "We use cookies that are necessary to run the site and remember preferences such as your theme, plus optional analytics cookies you can decline without affecting the service."
            ]
          }
        },
        {
          "h": {
            "ar": "التعديلات على السياسة",
            "en": "Changes to this policy"
          },
          "p": {
            "ar": [
              "قد نحدّث هذه السياسة، ونشعرك بأي تغيير جوهري عبر البريد أو داخل لوحة التحكم قبل سريانه."
            ],
            "en": [
              "We may update this policy, and we will notify you of any material change by email or inside your dashboard before it takes effect."
            ]
          }
        }
      ]
    },
    "terms": {
      "title": {
        "ar": "شروط الاستخدام",
        "en": "Terms of Use"
      },
      "updated": {
        "ar": "23 أغسطس 2026",
        "en": "23 August 2026"
      },
      "intro": {
        "ar": "باستخدامك منصّة Qhub فأنت توافق على هذه الشروط. اقرأها بعناية لأنها تحدّد حقوقك والتزاماتك.",
        "en": "By using the Qhub platform you agree to these terms. Please read them carefully — they set out your rights and obligations."
      },
      "sections": [
        {
          "h": {
            "ar": "الحساب",
            "en": "Your account"
          },
          "p": {
            "ar": [
              "إنشاء الحساب واستخدامه مشروط بالآتي:"
            ],
            "en": [
              "Creating and using an account is conditional on the following:"
            ]
          },
          "list": {
            "ar": [
              "تقديم بيانات صحيحة وتحديثها عند تغيّرها.",
              "أن تكون مخوّلاً بالتعاقد نيابة عن منشأتك.",
              "المحافظة على سرّية بيانات الدخول، وأنت مسؤول عن أي نشاط يتم عبر حسابك.",
              "إبلاغنا فوراً عند اشتباهك بأي استخدام غير مصرّح به."
            ],
            "en": [
              "Providing accurate information and keeping it up to date.",
              "Being authorised to contract on behalf of your organisation.",
              "Keeping your sign-in credentials confidential; you are responsible for all activity under your account.",
              "Telling us immediately if you suspect any unauthorised use."
            ]
          }
        },
        {
          "h": {
            "ar": "الاشتراك والدفع",
            "en": "Subscription and payment"
          },
          "p": {
            "ar": [
              "الاشتراك يتجدّد تلقائياً في نهاية كل دورة ما لم تلغِه قبل موعد التجديد. تقدر تلغي في أي وقت وتستمر خدمتك لنهاية الدورة المدفوعة.",
              "الأسعار المعروضة قبل الضريبة، وتُضاف الضريبة حسب دولتك عند الدفع."
            ],
            "en": [
              "Subscriptions renew automatically at the end of each cycle unless cancelled before the renewal date. You may cancel at any time and your service continues to the end of the paid cycle.",
              "Listed prices are before tax; tax is added for your country at checkout."
            ]
          }
        },
        {
          "h": {
            "ar": "الاستخدام المقبول",
            "en": "Acceptable use"
          },
          "p": {
            "ar": [
              "يُمنع استخدام المنصّة في أيٍّ من الآتي:"
            ],
            "en": [
              "The platform may not be used for any of the following:"
            ]
          },
          "list": {
            "ar": [
              "إرسال رسائل جماعية غير مرغوبة أو مخالفة لسياسات منصّات المراسلة.",
              "أي نشاط مخالف للأنظمة أو ينتهك حقوق الغير.",
              "محاولة اختراق المنصّة أو تعطيلها أو تجاوز حدود باقتك تقنياً.",
              "إعادة بيع الخدمة أو الوصول إليها آلياً بما يخالف حدود الاستخدام."
            ],
            "en": [
              "Sending unsolicited bulk messages, or anything that breaches messaging platform policies.",
              "Any activity that breaks the law or infringes the rights of others.",
              "Attempting to breach or disrupt the platform, or to technically circumvent your plan's limits.",
              "Reselling the service, or accessing it programmatically beyond the usage limits."
            ]
          }
        },
        {
          "h": {
            "ar": "محتواك وبيانات عملائك",
            "en": "Your content and your customers' data"
          },
          "p": {
            "ar": [
              "أنت تملك محتواك وبيانات عملائك، وتمنحنا ترخيصاً محدوداً لمعالجتها لغرض تشغيل الخدمة لك فقط.",
              "أنت مسؤول عن مشروعية جمع بيانات عملائك والحصول على موافقاتهم اللازمة قبل مراسلتهم."
            ],
            "en": [
              "You own your content and your customers' data, and grant us a limited licence to process it solely to operate the service for you.",
              "You are responsible for the lawfulness of collecting your customers' data and for obtaining the consents needed before messaging them."
            ]
          }
        },
        {
          "h": {
            "ar": "توفّر الخدمة",
            "en": "Service availability"
          },
          "p": {
            "ar": [
              "نسعى لاستمرارية الخدمة، وقد نجري صيانة مجدولة نشعرك بها مسبقاً. الأعطال الناتجة عن منصّات خارجية تربطها خارج نطاق سيطرتنا المباشرة."
            ],
            "en": [
              "We work to keep the service running, and may carry out scheduled maintenance with advance notice. Outages caused by the external platforms you connect are outside our direct control."
            ]
          }
        },
        {
          "h": {
            "ar": "الملكية الفكرية",
            "en": "Intellectual property"
          },
          "p": {
            "ar": [
              "المنصّة وتصميمها وشعاراتها وبرمجياتها ملك لنا. لا يمنحك الاشتراك أي حق في نسخها أو اشتقاق أعمال منها."
            ],
            "en": [
              "The platform, its design, logos and software belong to us. Your subscription grants no right to copy them or create derivative works."
            ]
          }
        },
        {
          "h": {
            "ar": "حدود المسؤولية",
            "en": "Limitation of liability"
          },
          "p": {
            "ar": [
              "تُقدَّم الخدمة على حالتها. مسؤوليتنا الإجمالية عن أي مطالبة لا تتجاوز ما دفعته خلال الاثني عشر شهراً السابقة للمطالبة، ولا نتحمّل الأضرار غير المباشرة أو فوات الربح."
            ],
            "en": [
              "The service is provided as is. Our total liability for any claim will not exceed what you paid in the twelve months preceding the claim, and we are not liable for indirect damages or lost profit."
            ]
          }
        },
        {
          "h": {
            "ar": "إنهاء الخدمة",
            "en": "Termination"
          },
          "p": {
            "ar": [
              "تقدر تنهي اشتراكك في أي وقت. ونقدر نوقف الحساب عند مخالفة جوهرية لهذه الشروط بعد إشعارك ومنحك فرصة معالجة المخالفة، ما لم تكن المخالفة تمسّ أمن المنصّة أو أنظمتها."
            ],
            "en": [
              "You may end your subscription at any time. We may suspend an account for a material breach of these terms after notifying you and giving you a chance to remedy it — unless the breach affects the security of the platform or its systems."
            ]
          }
        },
        {
          "h": {
            "ar": "القانون الواجب التطبيق",
            "en": "Governing law"
          },
          "p": {
            "ar": [
              "تخضع هذه الشروط لأنظمة الدولة الي تأسّست فيها الشركة، وتختص محاكمها بأي نزاع ينشأ عنها."
            ],
            "en": [
              "These terms are governed by the laws of the country in which the company is incorporated, and its courts have jurisdiction over any dispute arising from them."
            ]
          }
        }
      ]
    },
    "sla": {
      "title": {
        "ar": "اتفاقية مستوى الخدمة",
        "en": "Service Level Agreement"
      },
      "updated": {
        "ar": "23 أغسطس 2026",
        "en": "23 August 2026"
      },
      "intro": {
        "ar": "تحدّد هذه الاتفاقية مستوى التوفّر الي نلتزم به، وأزمنة الاستجابة للدعم، والتعويضات عند الإخلال. تنطبق على باقة المؤسسات ما لم يُتّفق على خلافها كتابةً.",
        "en": "This agreement sets out the availability we commit to, our support response times, and the credits due if we fall short. It applies to the Enterprise plan unless otherwise agreed in writing."
      },
      "sections": [
        {
          "h": {
            "ar": "التزام التوفّر",
            "en": "Availability commitment"
          },
          "p": {
            "ar": [
              "نلتزم بتوفّر شهري لا يقل عن ‎99.9% لخدمات المنصّة الأساسية، محسوباً على مدار الشهر التقويمي."
            ],
            "en": [
              "We commit to monthly availability of no less than 99.9% for the platform's core services, measured across the calendar month."
            ]
          }
        },
        {
          "h": {
            "ar": "ما لا يُحتسب في التوفّر",
            "en": "What does not count against availability"
          },
          "p": {
            "ar": [
              "تُستثنى من الحساب الفترات الآتية:"
            ],
            "en": [
              "The following periods are excluded from the calculation:"
            ]
          },
          "list": {
            "ar": [
              "الصيانة المجدولة المُعلَن عنها قبل 48 ساعة على الأقل.",
              "انقطاعات ناتجة عن منصّات خارجية (واتساب، ميتا، تيليجرام) أو مزوّد اتصالك.",
              "الاستخدام المخالف لحدود الباقة أو للشروط.",
              "ظروف قاهرة خارجة عن السيطرة المعقولة."
            ],
            "en": [
              "Scheduled maintenance announced at least 48 hours in advance.",
              "Outages caused by external platforms (WhatsApp, Meta, Telegram) or by your own connectivity provider.",
              "Use that breaches your plan's limits or these terms.",
              "Force majeure events outside reasonable control."
            ]
          }
        },
        {
          "h": {
            "ar": "تصنيف البلاغات وأزمنة الاستجابة",
            "en": "Issue severity and response times"
          },
          "p": {
            "ar": [
              "نصنّف البلاغات حسب أثرها على شغلك:"
            ],
            "en": [
              "We classify reports by their impact on your business:"
            ]
          },
          "list": {
            "ar": [
              "حرج — توقّف كامل للخدمة: استجابة خلال ساعة، ومتابعة متواصلة حتى الحل.",
              "عالٍ — تعطّل ميزة أساسية بدون بديل: استجابة خلال 4 ساعات عمل.",
              "متوسط — خلل يؤثر جزئياً وله بديل: استجابة خلال يوم عمل.",
              "منخفض — استفسار أو طلب تحسين: استجابة خلال يومَي عمل."
            ],
            "en": [
              "Critical — the service is fully down: response within one hour, and continuous work until resolved.",
              "High — a core feature is broken with no workaround: response within 4 working hours.",
              "Medium — a partial fault with a workaround: response within one working day.",
              "Low — a question or an improvement request: response within two working days."
            ]
          }
        },
        {
          "h": {
            "ar": "التعويض عند الإخلال",
            "en": "Credits when we fall short"
          },
          "p": {
            "ar": [
              "إذا نزل التوفّر الشهري عن الالتزام، تستحق رصيداً على فاتورة الشهر التالي:"
            ],
            "en": [
              "If monthly availability drops below our commitment, you earn a credit on the following month's invoice:"
            ]
          },
          "list": {
            "ar": [
              "أقل من ‎99.9% وحتى ‎99.0%: رصيد ‎10% من قيمة الاشتراك الشهري.",
              "أقل من ‎99.0% وحتى ‎95.0%: رصيد ‎25%.",
              "أقل من ‎95.0%: رصيد ‎50%."
            ],
            "en": [
              "Below 99.9% down to 99.0%: a credit of 10% of the monthly subscription.",
              "Below 99.0% down to 95.0%: a credit of 25%.",
              "Below 95.0%: a credit of 50%."
            ]
          }
        },
        {
          "h": {
            "ar": "كيف تطلب التعويض",
            "en": "How to claim a credit"
          },
          "p": {
            "ar": [
              "تُقدَّم المطالبة خلال 30 يوماً من نهاية الشهر المتأثر عبر قنوات الدعم، مع بيان فترات الانقطاع. نراجعها ونرد خلال 10 أيام عمل.",
              "الرصيد هو التعويض الوحيد المستحق عن الإخلال بمستوى التوفّر."
            ],
            "en": [
              "Submit the claim within 30 days of the end of the affected month through our support channels, listing the outage periods. We review it and reply within 10 working days.",
              "The credit is the sole remedy for a breach of the availability commitment."
            ]
          }
        },
        {
          "h": {
            "ar": "النسخ الاحتياطي والاسترجاع",
            "en": "Backup and recovery"
          },
          "p": {
            "ar": [
              "نأخذ نسخاً احتياطية يومية ونحتفظ بها 30 يوماً. هدف زمن الاسترجاع 4 ساعات، وهدف نقطة الاسترجاع 24 ساعة."
            ],
            "en": [
              "We take daily backups and retain them for 30 days. Our recovery time objective is 4 hours and our recovery point objective is 24 hours."
            ]
          }
        },
        {
          "h": {
            "ar": "الدعم المخصّص",
            "en": "Dedicated support"
          },
          "p": {
            "ar": [
              "تشمل باقة المؤسسات مدير حساب مخصّص، وقناة دعم مباشرة، ومراجعة دورية لأداء حسابك واستخدامك للمنصّة."
            ],
            "en": [
              "The Enterprise plan includes a dedicated account manager, a direct support channel, and a regular review of your account's performance and platform usage."
            ]
          }
        }
      ]
    }
  },
  "pricing": {
    "page": {
      "eyebrow": {
        "ar": "الأسعار",
        "en": "Pricing"
      },
      "title": {
        "ar": "باقات مخصّصة لتناسب احتياجات عملك",
        "en": "Plans tailored to what your business needs"
      },
      "highlight": {
        "ar": [
          "مخصّصة",
          "لتناسب",
          "احتياجات",
          "عملك"
        ],
        "en": [
          "tailored",
          "to",
          "what",
          "your",
          "business",
          "needs"
        ]
      },
      "lede": {
        "ar": "ابدأ مجاناً 7 أيام، دون بطاقة ائتمان، ويمكنك ترقية باقتك أو تخفيضها في أي وقت.",
        "en": "Start with 7 days free — no credit card, and you can move up or down a plan whenever you want."
      },
      "eyebrowIcon": {
        "type": "library",
        "set": "qhub",
        "name": "shield"
      }
    },
    "table": {
      "compare": {
        "ar": "قارن المزايا",
        "en": "Compare features"
      },
      "featured": {
        "ar": "الأكثر اختياراً",
        "en": "Most popular"
      },
      "per": {
        "ar": "محادثة / شهر",
        "en": "conversations / month"
      },
      "perMonth": {
        "ar": "/ شهرياً",
        "en": "/ month"
      },
      "subscribe": {
        "ar": "اشترك الآن",
        "en": "Subscribe now"
      },
      "onRequest": {
        "ar": "السعر بالتواصل",
        "en": "Price on request"
      },
      "helpTitle": {
        "ar": "لست متأكداً من الباقة المناسبة؟",
        "en": "Not sure which plan fits?"
      },
      "helpBody": {
        "ar": "تحدّث إلينا لنساعدك في الاختيار حسب حجم فريقك وعدد محادثاتك.",
        "en": "Talk to us and we'll help you pick based on your team size and conversation volume."
      },
      "helpCta": {
        "ar": "تواصل معنا",
        "en": "Contact us"
      },
      "yes": {
        "ar": "متوفرة",
        "en": "Included"
      },
      "no": {
        "ar": "غير متوفرة",
        "en": "Not included"
      }
    },
    "slider": {
      "ask": {
        "ar": "كم محادثة تستقبل شهرياً؟ اسحب المؤشّر —",
        "en": "How many conversations do you handle each month? Drag the handle —"
      },
      "match": {
        "ar": "الباقة المناسبة: {0}",
        "en": "your plan: {0}"
      },
      "label": {
        "ar": "اختيار الباقة حسب عدد المحادثات شهرياً",
        "en": "Pick a plan by monthly conversation volume"
      },
      "per": {
        "ar": "محادثة / شهر",
        "en": "conversations / month"
      }
    },
    "enterprise": {
      "cta": {
        "ar": "تواصل معنا",
        "en": "Contact us"
      },
      "sentTitle": {
        "ar": "وصلنا طلبك",
        "en": "We got your request"
      },
      "sentBody": {
        "ar": "فريق المؤسسات بيتواصل معك خلال يوم عمل واحد بعرض مفصّل يناسب حجم منشأتك.",
        "en": "Our enterprise team will reach out within one business day with a detailed proposal for your organisation."
      },
      "close": {
        "ar": "إغلاق",
        "en": "Close"
      },
      "title": {
        "ar": "اطلب اشتراك المؤسسات",
        "en": "Request an Enterprise plan"
      },
      "lede": {
        "ar": "نجهّز لك عرضاً مبنياً على حجم فريقك ومحادثاتك، مع SLA ومدير حساب مخصّص.",
        "en": "We'll build a proposal around your team size and conversation volume — with an SLA and a dedicated account manager."
      },
      "company": {
        "ar": "اسم المنشأة",
        "en": "Organisation name"
      },
      "companyPh": {
        "ar": "شركة …",
        "en": "Company …"
      },
      "contactName": {
        "ar": "اسم المسؤول",
        "en": "Contact name"
      },
      "contactNamePh": {
        "ar": "اسمك الكامل",
        "en": "Your full name"
      },
      "email": {
        "ar": "البريد الإلكتروني",
        "en": "Email address"
      },
      "phone": {
        "ar": "رقم الجوال",
        "en": "Phone number"
      },
      "dialLabel": {
        "ar": "مقدّمة الدولة",
        "en": "Country code"
      },
      "phonePh": {
        "ar": "9000 0000",
        "en": "9000 0000"
      },
      "agents": {
        "ar": "حد الموظفين المطلوب",
        "en": "Agents needed"
      },
      "agentsPh": {
        "ar": "مثال: 120",
        "en": "e.g. 120"
      },
      "channels": {
        "ar": "حد القنوات المطلوب",
        "en": "Channels needed"
      },
      "channelsPh": {
        "ar": "مثال: 15",
        "en": "e.g. 15"
      },
      "convos": {
        "ar": "حد المحادثات المطلوب",
        "en": "Monthly conversations needed"
      },
      "convosPh": {
        "ar": "مثال: 50,000",
        "en": "e.g. 50,000"
      },
      "limitsNote": {
        "ar": "نرشّح لك الباقة المناسبة من باقات المؤسسات بناءً على هذه الأرقام.",
        "en": "We'll suggest the right Enterprise plan based on these numbers."
      },
      "needs": {
        "ar": "احتياجاتك أو استفسارك (اختياري)",
        "en": "Your needs or questions (optional)"
      },
      "needsPh": {
        "ar": "أخبرنا باحتياجاتك الخاصة، الميزات المطلوبة، أو أي متطلبات أمنية…",
        "en": "Tell us about your specific needs, the features you want, or any security requirements…"
      },
      "replyNote": {
        "ar": "نرد خلال يوم عمل واحد.",
        "en": "We reply within one business day."
      },
      "sending": {
        "ar": "جارٍ الإرسال…",
        "en": "Sending…"
      },
      "send": {
        "ar": "إرسال الطلب",
        "en": "Send request"
      }
    },
    "plans": [
      {
        "id": "starter",
        "name": {
          "ar": "البداية",
          "en": "Starter"
        },
        "tagline": {
          "ar": "لصاحب المشروع في بدايته",
          "en": "For the founder just getting going"
        },
        "reach": {
          "ar": "حتى 500",
          "en": "Up to 500"
        },
        "perks": {
          "ar": [
            "قناتان",
            "موظفان",
            "500 محادثة شهرياً",
            "ردود AI أساسية"
          ],
          "en": [
            "2 channels",
            "2 agents",
            "500 conversations a month",
            "Basic AI replies"
          ]
        }
      },
      {
        "id": "pro",
        "name": {
          "ar": "الاحترافية",
          "en": "Professional"
        },
        "tagline": {
          "ar": "للفرق التي تنمو بسرعة",
          "en": "For teams growing fast"
        },
        "reach": {
          "ar": "حتى 2,500",
          "en": "Up to 2,500"
        },
        "perks": {
          "ar": [
            "5 قنوات",
            "7 موظفين",
            "محادثات غير محدودة",
            "قاعدة معرفة + حملات"
          ],
          "en": [
            "5 channels",
            "7 agents",
            "Unlimited conversations",
            "Knowledge base + campaigns"
          ]
        },
        "featured": true
      },
      {
        "id": "business",
        "name": {
          "ar": "الأعمال",
          "en": "Business"
        },
        "tagline": {
          "ar": "لفرق خدمة العملاء الكاملة",
          "en": "For a full customer service team"
        },
        "reach": {
          "ar": "حتى 10,000",
          "en": "Up to 10,000"
        },
        "perks": {
          "ar": [
            "كل القنوات",
            "20 موظف",
            "تقارير متقدّمة",
            "تكاملات المتاجر"
          ],
          "en": [
            "Every channel",
            "20 agents",
            "Advanced reports",
            "Store integrations"
          ]
        }
      },
      {
        "id": "enterprise",
        "name": {
          "ar": "المؤسسات",
          "en": "Enterprise"
        },
        "tagline": {
          "ar": "لمن يحتاج تحكّم كامل",
          "en": "For teams that need full control"
        },
        "reach": {
          "ar": "‎+10,000",
          "en": "10,000+"
        },
        "perks": {
          "ar": [
            "موظفون بلا حد",
            "SLA مخصّص",
            "مدير حساب",
            "تكامل API كامل"
          ],
          "en": [
            "Unlimited agents",
            "Custom SLA",
            "Account manager",
            "Full API integration"
          ]
        },
        "contactOnly": true
      }
    ],
    "comparison": [
      {
        "title": {
          "ar": "الأساسيات",
          "en": "Essentials"
        },
        "rows": [
          {
            "label": {
              "ar": "القنوات المتصلة",
              "en": "Connected channels"
            },
            "values": {
              "ar": [
                "قناتان",
                "5 قنوات",
                "كل القنوات",
                "كل القنوات"
              ],
              "en": [
                "2 channels",
                "5 channels",
                "Every channel",
                "Every channel"
              ]
            }
          },
          {
            "label": {
              "ar": "عدد الموظفين",
              "en": "Agents"
            },
            "values": {
              "ar": [
                "2",
                "7",
                "20",
                "بلا حد"
              ],
              "en": [
                "2",
                "7",
                "20",
                "Unlimited"
              ]
            }
          },
          {
            "label": {
              "ar": "المحادثات شهرياً",
              "en": "Conversations per month"
            },
            "values": {
              "ar": [
                "500",
                "2,500",
                "10,000",
                "بلا حدّ"
              ],
              "en": [
                "500",
                "2,500",
                "10,000",
                "Unlimited"
              ]
            }
          },
          {
            "label": {
              "ar": "جهات الاتصال",
              "en": "Contacts"
            },
            "values": {
              "ar": [
                "1,000",
                "10,000",
                "غير محدودة",
                "غير محدودة"
              ],
              "en": [
                "1,000",
                "10,000",
                "Unlimited",
                "Unlimited"
              ]
            }
          },
          {
            "label": {
              "ar": "الأقسام",
              "en": "Departments"
            },
            "values": {
              "ar": [
                false,
                "3",
                "10",
                "بلا حد"
              ],
              "en": [
                false,
                "3",
                "10",
                "Unlimited"
              ]
            }
          }
        ]
      },
      {
        "title": {
          "ar": "الذكاء الاصطناعي",
          "en": "Artificial intelligence"
        },
        "rows": [
          {
            "label": {
              "ar": "ردود تلقائية ذكية",
              "en": "Smart automatic replies"
            },
            "values": {
              "ar": [
                true,
                true,
                true,
                true
              ],
              "en": [
                true,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "فهم اللهجات العربية",
              "en": "Arabic dialect understanding"
            },
            "values": {
              "ar": [
                true,
                true,
                true,
                true
              ],
              "en": [
                true,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "قاعدة معرفة مخصّصة",
              "en": "Custom knowledge base"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تخصيص شخصية البوت",
              "en": "Custom bot personality"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تفريغ الرسائل الصوتية",
              "en": "Voice message transcription"
            },
            "values": {
              "ar": [
                false,
                false,
                true,
                true
              ],
              "en": [
                false,
                false,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تحويل تلقائي للموظف",
              "en": "Automatic handoff to an agent"
            },
            "values": {
              "ar": [
                true,
                true,
                true,
                true
              ],
              "en": [
                true,
                true,
                true,
                true
              ]
            }
          }
        ]
      },
      {
        "title": {
          "ar": "التسويق",
          "en": "Marketing"
        },
        "rows": [
          {
            "label": {
              "ar": "حملات واتساب",
              "en": "WhatsApp campaigns"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "حملات إيميل",
              "en": "Email campaigns"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "قوالب جاهزة",
              "en": "Ready-made templates"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "جدولة الإرسال",
              "en": "Send scheduling"
            },
            "values": {
              "ar": [
                false,
                false,
                true,
                true
              ],
              "en": [
                false,
                false,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تقارير الحملات",
              "en": "Campaign reports"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          }
        ]
      },
      {
        "title": {
          "ar": "الإدارة والتقارير",
          "en": "Management & reporting"
        },
        "rows": [
          {
            "label": {
              "ar": "أدوار وصلاحيات",
              "en": "Roles and permissions"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "ساعات عمل للموظفين",
              "en": "Agent working hours"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تقارير الأداء",
              "en": "Performance reports"
            },
            "values": {
              "ar": [
                "أساسية",
                "متقدّمة",
                "متقدّمة",
                "متقدّمة"
              ],
              "en": [
                "Basic",
                "Advanced",
                "Advanced",
                "Advanced"
              ]
            }
          },
          {
            "label": {
              "ar": "تقييمات العملاء",
              "en": "Customer ratings"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تصدير التقارير",
              "en": "Report export"
            },
            "values": {
              "ar": [
                false,
                false,
                true,
                true
              ],
              "en": [
                false,
                false,
                true,
                true
              ]
            }
          }
        ]
      },
      {
        "title": {
          "ar": "الربط والدعم",
          "en": "Integrations & support"
        },
        "rows": [
          {
            "label": {
              "ar": "نافذة الدردشة المباشرة",
              "en": "Chat widget"
            },
            "values": {
              "ar": [
                true,
                true,
                true,
                true
              ],
              "en": [
                true,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "سلة وزد",
              "en": "Salla and Zid"
            },
            "values": {
              "ar": [
                false,
                true,
                true,
                true
              ],
              "en": [
                false,
                true,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "شوبيفاي وووكومرس",
              "en": "Shopify and WooCommerce"
            },
            "values": {
              "ar": [
                false,
                false,
                true,
                true
              ],
              "en": [
                false,
                false,
                true,
                true
              ]
            }
          },
          {
            "label": {
              "ar": "تكامل API",
              "en": "API integration"
            },
            "values": {
              "ar": [
                false,
                false,
                "محدود",
                "كامل"
              ],
              "en": [
                false,
                false,
                "Limited",
                "Full"
              ]
            }
          },
          {
            "label": {
              "ar": "الدعم",
              "en": "Support"
            },
            "values": {
              "ar": [
                "إيميل",
                "أولوية",
                "أولوية",
                "مدير حساب"
              ],
              "en": [
                "Email",
                "Priority",
                "Priority",
                "Account manager"
              ]
            }
          },
          {
            "label": {
              "ar": "اتفاقية مستوى خدمة (SLA)",
              "en": "Service level agreement (SLA)"
            },
            "values": {
              "ar": [
                false,
                false,
                false,
                true
              ],
              "en": [
                false,
                false,
                false,
                true
              ]
            }
          }
        ]
      }
    ]
  },
  "site": {
    "links": {
      "name": {
        "ar": "Qhub",
        "en": "Qhub"
      },
      "appUrl": {
        "ar": "https://qhub-client.apexes.click/overview",
        "en": "https://qhub-client.apexes.click/overview"
      },
      "loginUrl": {
        "ar": "https://qhub-client.apexes.click/login",
        "en": "https://qhub-client.apexes.click/login"
      },
      "signupUrl": {
        "ar": "https://qhub-client.apexes.click/register",
        "en": "https://qhub-client.apexes.click/register"
      },
      "email": {
        "ar": "info@qhub.sa",
        "en": "info@qhub.sa"
      },
      "whatsapp": {
        "ar": "+968 0000 0000",
        "en": "+968 0000 0000"
      }
    },
    "navbar": {
      "home": {
        "ar": "Qhub — الرئيسية",
        "en": "Qhub — Home"
      },
      "login": {
        "ar": "تسجيل دخول",
        "en": "Log in"
      },
      "start": {
        "ar": "ابدأ مجاناً",
        "en": "Start free"
      },
      "menu": {
        "ar": "القائمة",
        "en": "Menu"
      }
    },
    "nav": [
      {
        "label": {
          "ar": "الرئيسية",
          "en": "Home"
        },
        "href": "/"
      },
      {
        "label": {
          "ar": "المزايا",
          "en": "Product"
        },
        "href": "/features",
        "children": [
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
              "ar": "نافذة الدردشة المباشرة",
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
          }
        ]
      },
      {
        "label": {
          "ar": "الحلول",
          "en": "Solutions"
        },
        "href": "/solutions"
      },
      {
        "label": {
          "ar": "الأسعار",
          "en": "Pricing"
        },
        "href": "/pricing"
      },
      {
        "label": {
          "ar": "الأسئلة الشائعة",
          "en": "FAQ"
        },
        "href": "/faq"
      }
    ],
    "footer": {
      "blurb": {
        "ar": "منصة عربية توحّد محادثات عملائك من كل القنوات، مع مساعد ذكاء اصطناعي يفهم لهجتهم.",
        "en": "An Arabic-first platform that brings every customer conversation into one place, with an AI assistant that speaks their dialect."
      },
      "rights": {
        "ar": "جميع الحقوق محفوظة.",
        "en": "All rights reserved."
      },
      "socials": {
        "facebook": {
          "ar": "فيسبوك",
          "en": "Facebook"
        },
        "instagram": {
          "ar": "إنستغرام",
          "en": "Instagram"
        },
        "tiktok": {
          "ar": "تيك توك",
          "en": "TikTok"
        },
        "x": {
          "ar": "إكس",
          "en": "X"
        }
      },
      "groups": [
        {
          "title": {
            "ar": "المنتج",
            "en": "Product"
          },
          "links": [
            {
              "label": {
                "ar": "المحادثات الموحدة",
                "en": "Unified Inbox"
              },
              "href": "/features/unified-inbox"
            },
            {
              "label": {
                "ar": "مساعد الذكاء الاصطناعي",
                "en": "AI Assistant"
              },
              "href": "/features/ai-assistant"
            },
            {
              "label": {
                "ar": "الحملات التسويقية",
                "en": "Campaigns"
              },
              "href": "/features/campaigns"
            },
            {
              "label": {
                "ar": "إدارة الفريق والصلاحيات",
                "en": "Team & Permissions"
              },
              "href": "/features/team"
            },
            {
              "label": {
                "ar": "التقارير والتحليلات",
                "en": "Reports & Analytics"
              },
              "href": "/features/analytics"
            },
            {
              "label": {
                "ar": "نافذة الدردشة المباشرة",
                "en": "Chat Widget"
              },
              "href": "/features/chat-widget"
            }
          ]
        },
        {
          "title": {
            "ar": "الشركة",
            "en": "Company"
          },
          "links": [
            {
              "label": {
                "ar": "الحلول",
                "en": "Solutions"
              },
              "href": "/solutions"
            },
            {
              "label": {
                "ar": "الأسعار",
                "en": "Pricing"
              },
              "href": "/pricing"
            },
            {
              "label": {
                "ar": "الأسئلة الشائعة",
                "en": "FAQ"
              },
              "href": "/faq"
            },
            {
              "label": {
                "ar": "تواصل معنا",
                "en": "Contact us"
              },
              "href": "/contact"
            }
          ]
        },
        {
          "title": {
            "ar": "قانوني",
            "en": "Legal"
          },
          "links": [
            {
              "label": {
                "ar": "سياسة الخصوصية",
                "en": "Privacy Policy"
              },
              "href": "/legal/privacy"
            },
            {
              "label": {
                "ar": "شروط الاستخدام",
                "en": "Terms of Use"
              },
              "href": "/legal/terms"
            },
            {
              "label": {
                "ar": "اتفاقية مستوى الخدمة",
                "en": "Service Level Agreement"
              },
              "href": "/legal/sla"
            }
          ]
        }
      ],
      "links": [
        {
          "key": "facebook",
          "href": "https://www.facebook.com/qhub2027"
        },
        {
          "key": "instagram",
          "href": "https://www.instagram.com/qhub2027/"
        },
        {
          "key": "tiktok",
          "href": "https://www.tiktok.com/@qhub2027"
        },
        {
          "key": "x",
          "href": "https://x.com/Qhub2027"
        }
      ]
    },
    "payments": {
      "ar": "وسائل الدفع المقبولة",
      "en": "Accepted payment methods"
    }
  },
  "seo": {
    "root": {
      "title": {
        "ar": "Qhub — كل محادثات عملائك في مكان واحد",
        "en": "Qhub — Every customer conversation in one place"
      },
      "description": {
        "ar": "منصة عربية توحّد محادثات واتساب وإنستغرام وماسنجر وتيليجرام والإيميل في صندوق وارد واحد، مع مساعد ذكاء اصطناعي يفهم اللهجات العربية ويرد على عملائك فوراً.",
        "en": "An Arabic-first platform that unifies WhatsApp, Instagram, Messenger, Telegram and email into a single shared inbox, with an AI assistant that understands Arabic dialects and replies to your customers instantly."
      },
      "og": {
        "ar": "وحّد قنواتك، ودع المساعد يرد فوراً، وليتدخّل فريقك حين يلزم.",
        "en": "Unify your channels, let AI answer instantly, and step in whenever your team is needed."
      },
      "keywords": {
        "ar": [
          "Qhub",
          "كيوهب",
          "منصة محادثات",
          "خدمة عملاء",
          "واتساب بيزنس",
          "ذكاء اصطناعي",
          "صندوق وارد موحد"
        ],
        "en": [
          "Qhub",
          "omnichannel inbox",
          "customer service platform",
          "WhatsApp Business API",
          "AI customer support",
          "shared inbox",
          "Arabic AI assistant"
        ]
      }
    },
    "pages": {
      "pricing": {
        "title": {
          "ar": "الأسعار",
          "en": "Pricing"
        },
        "description": {
          "ar": "باقات Qhub بكل تفاصيلها: قارن المزايا واختر ما يناسب عدد محادثاتك الشهرية. ابدأ مجاناً 7 أيام دون بطاقة ائتمان.",
          "en": "Every Qhub plan in full — compare the features and pick the one that fits your monthly conversation volume. Start with a free 7-day trial, no credit card needed."
        }
      },
      "features": {
        "title": {
          "ar": "مزايا المنتج",
          "en": "Product features"
        },
        "description": {
          "ar": "كل ما تحتاجه لإدارة محادثات عملائك: صندوق وارد موحّد، مساعد ذكي، حملات، تقارير، ربط القنوات وأكثر، مع عرض حيّ لكل ميزة.",
          "en": "Everything you need to run customer conversations — a unified inbox, an AI assistant, campaigns, reports, channel integrations and more, each with a live demo."
        }
      },
      "contact": {
        "title": {
          "ar": "تواصل معنا",
          "en": "Contact us"
        },
        "description": {
          "ar": "تحدّث إلى فريق Qhub لاستفسارات المبيعات أو الدعم الفني أو طلب عرض توضيحي، ونرد بسرعة.",
          "en": "Talk to the Qhub team — sales questions, technical support, or a product demo. We reply fast."
        }
      },
      "faq": {
        "title": {
          "ar": "الأسئلة الشائعة",
          "en": "FAQ"
        },
        "description": {
          "ar": "كل ما تحتاج معرفته عن Qhub في مكان واحد: إجابات واضحة وشروحات خطوة بخطوة لتبدأ وتدير محادثات عملائك بسهولة.",
          "en": "Everything you need to know about Qhub in one place: clear answers and step-by-step guides to get started and manage your customer conversations with ease."
        }
      },
      "solutions": {
        "title": {
          "ar": "الحلول",
          "en": "Solutions"
        },
        "description": {
          "ar": "Qhub لكل قطاع: التجارة الإلكترونية وصنّاع المحتوى والعيادات والعقار والخدمات والتجميل. انظر كيف يعمل في مجالك.",
          "en": "Qhub for every sector — e-commerce, creators, clinics, real estate, services and beauty. See how it works in your field."
        }
      }
    }
  },
  "ui": {
    "contact": {
      "page": {
        "eyebrow": {
          "ar": "تواصل معنا",
          "en": "Contact us"
        },
        "title": {
          "ar": "طرق التواصل مع فريق Qhub",
          "en": "Ways to reach the Qhub team"
        },
        "highlight": {
          "ar": [
            "فريق",
            "Qhub"
          ],
          "en": [
            "Qhub",
            "team"
          ]
        },
        "lede": {
          "ar": "سواء كان لديك سؤال عن الباقات، أو تريد عرضاً توضيحياً، أو تحتاج مساعدة تقنية، فنحن هنا.",
          "en": "Whether it's a question about plans, a demo request, or something technical — we're here."
        },
        "eyebrowIcon": {
          "type": "library",
          "set": "qhub",
          "name": "send"
        }
      },
      "channels": [
        {
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "send"
          },
          "title": {
            "ar": "راسلنا",
            "en": "Email us"
          },
          "body": {
            "ar": "info@qhub.sa",
            "en": "info@qhub.sa"
          },
          "href": "mailto:info@qhub.sa",
          "hint": {
            "ar": "نرد خلال ساعات العمل",
            "en": "We reply during working hours"
          }
        },
        {
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "clock"
          },
          "title": {
            "ar": "ساعات العمل",
            "en": "Working hours"
          },
          "body": {
            "ar": "الأحد – الخميس، 9ص – 6م",
            "en": "Sunday – Thursday, 9am – 6pm"
          },
          "hint": {
            "ar": "بتوقيت مكة المكرمة",
            "en": "Makkah time (GMT+3)"
          }
        },
        {
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "shield"
          },
          "title": {
            "ar": "عميل حالي؟",
            "en": "Already a customer?"
          },
          "body": {
            "ar": "الدعم من داخل لوحة التحكم",
            "en": "Support lives inside your dashboard"
          },
          "href": "https://qhub-client.apexes.click/overview",
          "hint": {
            "ar": "أسرع طريقة للوصول إلى فريق الدعم",
            "en": "The fastest way to reach the support team"
          }
        }
      ],
      "form": {
        "subjects": [
          {
            "v": {
              "ar": "استفسار عن الباقات",
              "en": "Plans enquiry"
            },
            "ph": {
              "ar": "كم موظفاً في فريقك؟ وكم محادثة تستقبلون شهرياً تقريباً؟",
              "en": "How many agents are on your team, and roughly how many conversations a month?"
            }
          },
          {
            "v": {
              "ar": "طلب عرض توضيحي",
              "en": "Request a demo"
            },
            "ph": {
              "ar": "ما القنوات التي تستعملونها اليوم؟ ومتى يناسبكم الموعد؟",
              "en": "Which channels do you use today, and when suits you for a call?"
            }
          },
          {
            "v": {
              "ar": "دعم فني",
              "en": "Technical support"
            },
            "ph": {
              "ar": "ما الذي حصل بالضبط؟ وعلى أي قناة أو صفحة؟ ومتى بدأ؟",
              "en": "What exactly happened, on which channel or page, and when did it start?"
            }
          },
          {
            "v": {
              "ar": "شراكة",
              "en": "Partnership"
            },
            "ph": {
              "ar": "حدّثنا عن شركتك ونوع الشراكة التي تقترحها.",
              "en": "Tell us about your company and the kind of partnership you have in mind."
            }
          },
          {
            "v": {
              "ar": "أخرى",
              "en": "Other"
            },
            "ph": {
              "ar": "اكتب لنا ما تحتاجه ونوجّهك للشخص المناسب.",
              "en": "Tell us what you need and we'll point you to the right person."
            }
          }
        ],
        "sentTitle": {
          "ar": "وصلتنا رسالتك",
          "en": "Your message reached us"
        },
        "sentBody": {
          "ar": "شكراً لتواصلك. فريقنا بيرد عليك خلال ساعات العمل.",
          "en": "Thanks for getting in touch. Our team will reply during working hours."
        },
        "sendAnother": {
          "ar": "إرسال رسالة أخرى",
          "en": "Send another message"
        },
        "name": {
          "ar": "الاسم",
          "en": "Name"
        },
        "namePh": {
          "ar": "اسمك الكامل",
          "en": "Your full name"
        },
        "company": {
          "ar": "اسم الشركة",
          "en": "Company"
        },
        "companyPh": {
          "ar": "اختياري",
          "en": "Optional"
        },
        "email": {
          "ar": "البريد الإلكتروني",
          "en": "Email address"
        },
        "phone": {
          "ar": "رقم الجوال",
          "en": "Phone number"
        },
        "subject": {
          "ar": "الموضوع",
          "en": "Subject"
        },
        "message": {
          "ar": "رسالتك",
          "en": "Your message"
        },
        "sending": {
          "ar": "جارٍ الإرسال…",
          "en": "Sending…"
        },
        "send": {
          "ar": "أرسل الرسالة",
          "en": "Send message"
        },
        "consentBefore": {
          "ar": "بإرسالك النموذج توافق على",
          "en": "By submitting this form you agree to our"
        },
        "privacy": {
          "ar": "سياسة الخصوصية",
          "en": "Privacy Policy"
        },
        "consentAfter": {
          "ar": ".",
          "en": "."
        }
      }
    },
    "widget": {
      "copy": {
        "open": {
          "ar": "افتح محادثة مع المساعد",
          "en": "Open a chat with the assistant"
        },
        "close": {
          "ar": "إغلاق",
          "en": "Close"
        },
        "title": {
          "ar": "مساعد Qhub",
          "en": "Qhub assistant"
        },
        "status": {
          "ar": "يردّ خلال ثوانٍ",
          "en": "Replies in seconds"
        },
        "hello": {
          "ar": "أهلاً بك. اسألني عن الأسعار، أو ربط واتساب، أو التكامل مع متجرك، وأجيبك فوراً.",
          "en": "Hi. Ask me about pricing, connecting WhatsApp, or your store integration, and I'll answer right away."
        },
        "tryThis": {
          "ar": "جرّب تسأل:",
          "en": "Try asking:"
        },
        "placeholder": {
          "ar": "اكتب سؤالك…",
          "en": "Type your question…"
        },
        "send": {
          "ar": "إرسال",
          "en": "Send"
        },
        "leadIntro": {
          "ar": "تحبّ نتابع معك؟ اترك اسمك ووسيلة تواصل واحدة ويردّ عليك الفريق.",
          "en": "Want us to follow up? Leave your name and one way to reach you."
        },
        "name": {
          "ar": "الاسم",
          "en": "Name"
        },
        "namePh": {
          "ar": "اسمك",
          "en": "Your name"
        },
        "email": {
          "ar": "البريد الإلكتروني",
          "en": "Email"
        },
        "emailPh": {
          "ar": "name@company.com",
          "en": "name@company.com"
        },
        "or": {
          "ar": "أو",
          "en": "or"
        },
        "phone": {
          "ar": "رقم الجوال",
          "en": "Phone number"
        },
        "submit": {
          "ar": "أرسل بياناتي",
          "en": "Send my details"
        },
        "sending": {
          "ar": "جارٍ الإرسال…",
          "en": "Sending…"
        },
        "needName": {
          "ar": "اكتب اسمك من فضلك.",
          "en": "Please add your name."
        },
        "needContact": {
          "ar": "اترك بريداً أو رقم جوال؛ واحد منهما يكفي.",
          "en": "Leave an email or a phone number — either one is enough."
        },
        "thanks": {
          "ar": "وصلتنا بياناتك ✅ سيتواصل معك الفريق خلال ساعات العمل، والمحادثة محفوظة معها.",
          "en": "Got your details ✅ The team will reach out during working hours, and this conversation goes with them."
        },
        "talkToSales": {
          "ar": "تواصل مع فريق المبيعات",
          "en": "Talk to sales"
        },
        "note": {
          "ar": "هذا مساعد الموقع. داخل حسابك يتدرّب على قاعدة معرفة منتجاتك أنت.",
          "en": "This is the website assistant. Inside your account it trains on your own product knowledge base."
        }
      },
      "suggestions": {
        "ar": [
          "كم سعر الباقات؟",
          "كيف أربط واتساب؟",
          "هل يتكامل مع سلة؟",
          "هل يفهم اللهجات؟",
          "ما مدّة التجربة؟"
        ],
        "en": [
          "How much are the plans?",
          "How do I connect WhatsApp?",
          "Does it work with Shopify?",
          "Which dialects does it understand?",
          "How long is the trial?"
        ]
      },
      "fallback": {
        "ar": "سؤال وجيه. هذا عرض على الموقع بمعرفة عامة عن Qhub، أمّا المساعد داخل حسابك فيتدرّب على قاعدة معرفة منتجاتك أنت فيجيب بتفاصيل عملك بالضبط. اسألني عن الأسعار، أو ربط واتساب، أو التكامل مع متجرك، أو أوصّلك بفريق المبيعات؟",
        "en": "Good question. This demo runs on general Qhub knowledge, while the assistant inside your account trains on your own product knowledge base and answers your specifics exactly. Try asking about pricing, connecting WhatsApp, or your store integration — or shall I connect you with sales?"
      },
      "answers": [
        {
          "id": "greeting",
          "a": {
            "ar": "أهلاً وسهلاً، معك مساعد Qhub. اسألني عن الأسعار، أو ربط واتساب، أو التكامل مع متجرك، أو التجربة المجانية، وأجيبك فوراً.",
            "en": "Hello. This is the Qhub assistant. Ask me about pricing, connecting WhatsApp, your store integration, or the free trial — I'll answer right away."
          }
        },
        {
          "id": "thanks",
          "a": {
            "ar": "العفو. أنا جاهز لأي سؤال آخر عن المنصّة أو الباقات، ويمكنني توصيلك بموظف من فريق المبيعات.",
            "en": "You're welcome. Happy to answer anything else about the platform or the plans, and I can hand you to a sales agent whenever you like."
          }
        },
        {
          "id": "pricing",
          "a": {
            "ar": "الباقات: البداية 19$ شهرياً، الاحترافية 49$ (تشمل المساعد الذكي)، الأعمال 99$، والمؤسّسات بالتواصل. والفوترة السنوية توفّر 20% على كل باقة. كم موظفاً في فريق الدعم لديك؟ أرشّح لك الأنسب.",
            "en": "Plans: Starter $19/mo, Professional $49 (includes the AI assistant), Business $99, and Enterprise on request. Annual billing saves 20% on every plan. How many agents are on your support team? I'll suggest the right fit."
          }
        },
        {
          "id": "trial",
          "a": {
            "ar": "التجربة 7 أيام كاملة بلا بطاقة ائتمانية ✨ تسجّل، تربط قناة واحدة، وتصلك المحادثات في اليوم نفسه. ولو ما ناسبتك، ما في التزام ولا رسوم.",
            "en": "The trial is a full 7 days with no credit card ✨ Sign up, connect one channel, and conversations start arriving the same day. If it isn't a fit, there's no commitment and no charge."
          }
        },
        {
          "id": "whatsapp",
          "a": {
            "ar": "ربط واتساب Business يتم بمسح رمز QR من صفحة «الحسابات والربط»، دون برمجة، وينتهي في أقل من دقيقة. ويمكنك ربط أكثر من رقم على الحساب نفسه، ولكل رقم تقاريره.",
            "en": "You connect WhatsApp Business by scanning a QR code from the “Accounts & channels” page — no developer, under a minute. You can connect several numbers to one account, each with its own reports."
          }
        },
        {
          "id": "channels",
          "a": {
            "ar": "القنوات المدعومة: واتساب، ماسنجر، إنستغرام، تيليجرام، البريد الإلكتروني، ونافذة الدردشة المباشرة على موقعك. كلها تصل إلى صندوق وارد واحد بسجلّ عميل مشترك، فيرى الموظف كل تاريخ العميل مهما تنقّل بين القنوات.",
            "en": "Supported channels: WhatsApp, Messenger, Instagram, Telegram, email, and your site widget. They all land in one shared inbox with a single customer history — so an agent sees everything no matter which channel the customer used."
          }
        },
        {
          "id": "store",
          "a": {
            "ar": "التكامل جاهز مع سلة وزد وشوبيفاي وووكومرس. فور ربط المتجر يرى الموظف طلبات العميل وحالة الشحن بجانب المحادثة مباشرة، والمساعد يجاوب عن حالة الطلب بلا تدخّل.",
            "en": "Ready-made integrations with Salla, Zid, Shopify and WooCommerce. Once your store is connected, the agent sees the customer's orders and shipping status right next to the conversation, and the assistant answers order-status questions on its own."
          }
        },
        {
          "id": "ai",
          "a": {
            "ar": "المساعد يتدرّب على قاعدة معرفة أنت تبنيها: ملفات، وصفحات موقعك، وأسئلة شائعة، وكتالوج منتجاتك. فيجيب من محتواك أنت لا من تخمين، وإن ما وجد الجواب حوّل المحادثة لموظف مع ملخّص بدل ما يخترع إجابة.",
            "en": "The assistant trains on a knowledge base you build: files, your site pages, FAQs and your product catalogue. It answers from your content rather than guessing — and when it can't find an answer it hands the conversation to an agent with a summary instead of inventing one."
          }
        },
        {
          "id": "dialects",
          "a": {
            "ar": "المساعد يفهم الفصحى المبسّطة والخليجية والمصرية والشامية، ويجاوب بالإنجليزية كذلك. ونبرته قابلة للاختيار من الإعدادات: ودودة، أو رسمية، أو مختصرة.",
            "en": "The assistant understands simplified Modern Standard Arabic plus Gulf, Egyptian and Levantine dialects, and replies in English too. Its tone is selectable in settings: friendly, formal, or brief."
          }
        },
        {
          "id": "team",
          "a": {
            "ar": "تنشئ أقسام (مبيعات، دعم، إدارة)، وتحدّد صلاحيات كل موظف وساعات عمله وسقف محادثاته المتزامنة. والتوزيع يمشي تلقائياً على المتاح، ويرى المشرف من يعمل على ماذا لحظياً.",
            "en": "You create departments (sales, support, management) and set each agent's permissions, working hours and concurrent-conversation cap. Routing runs automatically to whoever is free, and a supervisor sees who is on what in real time."
          }
        },
        {
          "id": "reports",
          "a": {
            "ar": "التقارير تغطّي حجم المحادثات، ومتوسط زمن أول ردّ، ونسبة ما تولّاه المساعد مقابل ما حُوّل لموظف، وتقييم العملاء، وأداء كل موظف وكل قناة. وتُصدَّر PDF أو Excel، أو تصلك ملخّصاً دورياً على بريدك.",
            "en": "Reports cover conversation volume, average first-reply time, the share handled by the assistant versus handed to an agent, customer ratings, and per-agent and per-channel performance. Export to PDF or Excel, or get a scheduled summary by email."
          }
        },
        {
          "id": "handoff",
          "a": {
            "ar": "أي محادثة تتحوّل إلى موظف بشري بضغطة واحدة، أو تلقائياً حين يخرج السؤال عن قاعدة المعرفة، أو يطلب العميل موظفاً، أو تُرصد نبرة غاضبة. والموظف يستلم ملخّصاً بالمحادثة فلا يعيد السؤال على العميل.",
            "en": "Any conversation moves to a human with one click — or automatically when the question falls outside the knowledge base, the customer asks for a person, or an angry tone is detected. The agent receives a summary, so the customer never repeats themselves."
          }
        },
        {
          "id": "security",
          "a": {
            "ar": "البيانات مشفّرة أثناء النقل والتخزين، والوصول محكوم بصلاحيات وسجلّ تدقيق يبيّن من اطّلع على ماذا. والنسخ الاحتياطي يومي، وبياناتك تبقى ملكك، تُصدَّر أو تُحذف بطلبك في أي وقت.",
            "en": "Data is encrypted in transit and at rest, access is governed by roles with an audit log showing who saw what, and backups run daily. Your data stays yours — export or delete it on request at any time."
          }
        },
        {
          "id": "setup",
          "a": {
            "ar": "الإعداد دون برمجة: تسجيل، وربط القنوات، ورفع قاعدة المعرفة، ودعوة الفريق؛ وأغلب الحسابات تعمل في أقل من ساعة. وننقل لك المحادثات والمعرفة من نظامك الحالي إن وُجدت.",
            "en": "Setup needs no developer: sign up, connect channels, upload the knowledge base, invite the team — most accounts are live in under an hour. We'll also migrate conversations and knowledge from your current system if you have one."
          }
        },
        {
          "id": "mobile",
          "a": {
            "ar": "في تطبيق للآيفون والأندرويد بإشعارات فورية، فالموظف يردّ وهو خارج المكتب. واللوحة على المتصفّح تشتغل على أي جهاز بلا تثبيت.",
            "en": "There are iOS and Android apps with push notifications, so agents can reply away from their desk. The web dashboard also works on any device with nothing to install."
          }
        },
        {
          "id": "api",
          "a": {
            "ar": "في واجهة API وWebhooks لربط أنظمتك: CRM، أو ERP، أو نظامك الداخلي، إضافةً للتكاملات الجاهزة مع المتاجر. والتوثيق متاح لفريقك التقني من داخل الحساب.",
            "en": "There's a REST API and webhooks for wiring in your own systems — CRM, ERP, or something in-house — alongside the ready-made store integrations. Docs are available to your technical team inside the account."
          }
        },
        {
          "id": "campaigns",
          "a": {
            "ar": "الحملات تنطلق على واتساب والبريد من مكان واحد: تختار الشريحة، وقالباً معتمداً، وتجدول الإرسال، ثم ترى الوصول والفتح والردود في تقرير الحملة. والردود ترجع لصندوق الوارد نفسه.",
            "en": "Campaigns run on WhatsApp and email from one place: pick a segment, an approved template, schedule the send — then watch reach, opens and replies in the campaign report. Replies land back in the same shared inbox."
          }
        },
        {
          "id": "automation",
          "a": {
            "ar": "تضبط ردوداً تلقائية وساعات عمل وقواعد توجيه: خارج الدوام يردّ المساعد ويجمع الطلب، وداخل الدوام يوجّه المحادثة للقسم المناسب حسب الكلمة أو القناة أو لغة العميل.",
            "en": "You set auto-replies, working hours and routing rules: outside hours the assistant replies and captures the request; inside hours it routes the conversation to the right department by keyword, channel or customer language."
          }
        },
        {
          "id": "limits",
          "a": {
            "ar": "كل باقة لها سقف عملاء شهري ظاهر في صفحة الأسعار، والترقية فورية بلا انقطاع خدمة. وإن قاربت السقف يوصلك تنبيه قبل الوصول إليه لا بعده.",
            "en": "Each plan has a monthly customer cap shown on the pricing page, and upgrading is instant with no interruption. If you approach the cap you're warned before you hit it, not after."
          }
        },
        {
          "id": "cancel",
          "a": {
            "ar": "لا يوجد عقد ملزم؛ الاشتراك شهري أو سنوي وتلغيه من الحساب متى شئت، وتصدّر بياناتك قبل الإلغاء. والسنوي فيه استرداد تناسبي حسب المدّة المتبقّية.",
            "en": "There's no binding contract — the subscription is monthly or annual and you can cancel from your account at any time, exporting your data first. Annual plans are refunded pro-rata for the remaining term."
          }
        },
        {
          "id": "support",
          "a": {
            "ar": "فريق الدعم متاح عبر المحادثة والبريد، وباقات الأعمال والمؤسّسات لها مدير حساب مخصّص. وأقدر أرتّب لك عرضاً توضيحياً مباشراً مع فريق المبيعات. أي يوم يناسبك؟",
            "en": "Support is available over chat and email, and Business and Enterprise plans get a dedicated account manager. I can also arrange a live demo with the sales team — which day suits you?"
          }
        }
      ]
    },
    "legal": {
      "eyebrow": {
        "ar": "قانوني",
        "en": "Legal"
      },
      "toc": {
        "ar": "المحتويات",
        "en": "Contents"
      },
      "others": {
        "ar": "مستندات أخرى",
        "en": "Other documents"
      },
      "updated": {
        "ar": "آخر تحديث:",
        "en": "Last updated:"
      },
      "question": {
        "ar": "عندك سؤال عن هذا المستند؟",
        "en": "Have a question about this document?"
      },
      "cta": {
        "ar": "تواصل معنا",
        "en": "Contact us"
      },
      "tail": {
        "ar": "ونوضّح لك.",
        "en": "and we'll walk you through it."
      },
      "eyebrowIcon": {
        "type": "library",
        "set": "qhub",
        "name": "shield"
      }
    },
    "featuresTabs": {
      "tablist": {
        "ar": "مزايا المنتج",
        "en": "Product features"
      },
      "start": {
        "ar": "ابدأ مجاناً",
        "en": "Start free"
      },
      "demo": {
        "ar": "اطلب عرضاً توضيحياً",
        "en": "Request a demo"
      },
      "faqEyebrow": {
        "ar": "أسئلة شائعة",
        "en": "FAQ"
      },
      "faqTitle": {
        "ar": "أسئلة عن {0}",
        "en": "Questions about {0}"
      },
      "faqHighlight": {
        "ar": [
          "أسئلة"
        ],
        "en": [
          "Questions"
        ]
      },
      "restHighlight": {
        "ar": [
          "باقي"
        ],
        "en": [
          "other"
        ]
      },
      "liveEyebrow": {
        "ar": "عرض حيّ",
        "en": "Live demo"
      },
      "liveTitle": {
        "ar": "شاشة حقيقية من داخل Qhub",
        "en": "A real screen from inside Qhub"
      },
      "liveHighlight": {
        "ar": [
          "شاشة",
          "حقيقية"
        ],
        "en": [
          "real",
          "screen"
        ]
      },
      "liveLede": {
        "ar": "هذه الشاشة تعمل فعلاً، وقابلة للضغط تماماً كالشاشة داخل الحساب.",
        "en": "This screen actually works — clickable exactly like the one inside an account."
      }
    },
    "videoDialog": {
      "close": {
        "ar": "إغلاق",
        "en": "Close"
      },
      "unsupported": {
        "ar": "متصفّحك لا يشغّل هذا الفيديو.",
        "en": "Your browser cannot play this video."
      }
    },
    "themeToggle": {
      "toLight": {
        "ar": "التبديل للوضع الفاتح",
        "en": "Switch to light mode"
      },
      "toDark": {
        "ar": "التبديل للوضع الداكن",
        "en": "Switch to dark mode"
      }
    },
    "phoneField": {
      "country": {
        "ar": "دولة الرقم",
        "en": "Number's country"
      },
      "invalid": {
        "ar": "رقم غير صحيح لهذه الدولة",
        "en": "That is not a valid number for this country"
      }
    },
    "countries": {
      "OM": {
        "ar": "عُمان",
        "en": "Oman"
      },
      "SA": {
        "ar": "السعودية",
        "en": "Saudi Arabia"
      },
      "AE": {
        "ar": "الإمارات",
        "en": "UAE"
      },
      "KW": {
        "ar": "الكويت",
        "en": "Kuwait"
      },
      "QA": {
        "ar": "قطر",
        "en": "Qatar"
      },
      "BH": {
        "ar": "البحرين",
        "en": "Bahrain"
      },
      "EG": {
        "ar": "مصر",
        "en": "Egypt"
      },
      "JO": {
        "ar": "الأردن",
        "en": "Jordan"
      }
    }
  },
  "scenes": {
    "feature": {
      "rows": [
        {
          "n": {
            "ar": "نورة العامري",
            "en": "Noura Al-Amri"
          },
          "m": {
            "ar": "وصلني الطلب، شكراً لكم",
            "en": "The order arrived, thank you"
          }
        },
        {
          "n": {
            "ar": "متجر لمسة",
            "en": "Lamsa Store"
          },
          "m": {
            "ar": "كم سعر الباقة الجديدة؟",
            "en": "How much is the new plan?"
          }
        },
        {
          "n": {
            "ar": "خالد الحارثي",
            "en": "Khalid Al-Harthi"
          },
          "m": {
            "ar": "متى يفتح المحل اليوم؟",
            "en": "What time do you open today?"
          }
        }
      ],
      "filters": {
        "ar": [
          "الكل",
          "غير مقروءة",
          "متأخرة"
        ],
        "en": [
          "All",
          "Unread",
          "Overdue"
        ]
      },
      "search": {
        "ar": "ابحث في المحادثات…",
        "en": "Search conversations…"
      },
      "note": {
        "ar": "ملاحظة داخلية",
        "en": "Internal note"
      },
      "noteBody": {
        "ar": "العميل طلب استبدالاً سابقاً، فتعامل معه بمرونة.",
        "en": "This customer asked for an exchange before — be flexible."
      },
      "handoff": {
        "ar": "تحويل تلقائي",
        "en": "Auto-assigned"
      },
      "from": {
        "ar": "م",
        "en": "M"
      },
      "to": {
        "ar": "س",
        "en": "S"
      },
      "lost": {
        "ar": "رسالة بلا رد",
        "en": "No reply"
      },
      "oneList": {
        "ar": "صندوق الوارد الموحّد",
        "en": "Unified inbox"
      },
      "unified": {
        "ar": "خمس قنوات، مجرى واحد",
        "en": "Five channels, one stream"
      },
      "count": {
        "ar": "12",
        "en": "12"
      },
      "sources": {
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
      },
      "spark": {
        "ar": "قاعدة المعرفة",
        "en": "Knowledge base"
      },
      "reply": {
        "ar": "الردّ مبنيّ على قاعدة المعرفة",
        "en": "The answer comes from your own information"
      },
      "draft": {
        "ar": "الباقة الاحترافية 49$ شهرياً، وتشمل خمس قنوات وسبعة موظفين.",
        "en": "The Professional plan is $49 a month and covers five channels and seven agents."
      },
      "funnel": [
        {
          "l": {
            "ar": "أُرسلت",
            "en": "Sent"
          },
          "v": {
            "ar": "2,140",
            "en": "2,140"
          }
        },
        {
          "l": {
            "ar": "وصلت",
            "en": "Delivered"
          },
          "v": {
            "ar": "2,076",
            "en": "2,076"
          }
        },
        {
          "l": {
            "ar": "فُتحت",
            "en": "Opened"
          },
          "v": {
            "ar": "1,327",
            "en": "1,327"
          }
        },
        {
          "l": {
            "ar": "ردّوا",
            "en": "Replied"
          },
          "v": {
            "ar": "385",
            "en": "385"
          }
        }
      ],
      "campaign": {
        "ar": "حملة عرض الجمعة",
        "en": "Friday offer campaign"
      },
      "gates": {
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
      },
      "agents": [
        {
          "n": {
            "ar": "منال",
            "en": "Manal"
          },
          "load": {
            "ar": "3",
            "en": "3"
          }
        },
        {
          "n": {
            "ar": "سالم",
            "en": "Salem"
          },
          "load": {
            "ar": "7",
            "en": "7"
          }
        },
        {
          "n": {
            "ar": "نورة",
            "en": "Noura"
          },
          "load": {
            "ar": "2",
            "en": "2"
          }
        }
      ],
      "incoming": {
        "ar": "محادثة واردة",
        "en": "Incoming conversation"
      },
      "kpi": [
        {
          "l": {
            "ar": "متوسط أول رد",
            "en": "Avg. first reply"
          },
          "v": {
            "ar": "2.4",
            "en": "2.4"
          },
          "unit": {
            "ar": "د",
            "en": "m"
          }
        },
        {
          "l": {
            "ar": "نسبة الحل",
            "en": "Resolution rate"
          },
          "v": {
            "ar": "94",
            "en": "94"
          },
          "unit": {
            "ar": "٪",
            "en": "%"
          }
        }
      ],
      "drill": {
        "ar": "من الرقم إلى سببه",
        "en": "From the number to its cause"
      },
      "drillRows": [
        {
          "l": {
            "ar": "واتساب",
            "en": "WhatsApp"
          },
          "v": {
            "ar": "1.8",
            "en": "1.8"
          },
          "ch": "whatsapp"
        },
        {
          "l": {
            "ar": "إنستغرام",
            "en": "Instagram"
          },
          "v": {
            "ar": "2.6",
            "en": "2.6"
          },
          "ch": "instagram"
        },
        {
          "l": {
            "ar": "تيك توك",
            "en": "TikTok"
          },
          "v": {
            "ar": "4.1",
            "en": "4.1"
          },
          "ch": "tiktok"
        }
      ],
      "widgetStates": {
        "ar": [
          "زرّ",
          "ترحيب",
          "محادثة"
        ],
        "en": [
          "Button",
          "Greeting",
          "Chat"
        ]
      },
      "widgetAsk": {
        "ar": "كيف نساعدك؟",
        "en": "How can we help?"
      },
      "embed": {
        "ar": "سطر واحد في الموقع",
        "en": "One line on your site"
      },
      "order": {
        "ar": "طلب #4821",
        "en": "Order #4821"
      },
      "orderRows": [
        {
          "l": {
            "ar": "الحالة",
            "en": "Status"
          },
          "v": {
            "ar": "خرج للتوصيل",
            "en": "Out for delivery"
          }
        },
        {
          "l": {
            "ar": "القيمة",
            "en": "Value"
          },
          "v": {
            "ar": "240 ر.س",
            "en": "240 SAR"
          }
        }
      ],
      "stores": {
        "ar": [
          "سلة",
          "زد",
          "شوبيفاي"
        ],
        "en": [
          "Salla",
          "Zid",
          "Shopify"
        ]
      },
      "synced": {
        "ar": "مزامنة مستمرة",
        "en": "Continuously synced"
      },
      "rules": [
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
            "ar": "شكوى",
            "en": "A complaint"
          },
          "then": {
            "ar": "الدعم",
            "en": "Support"
          }
        },
        {
          "when": {
            "ar": "خارج الدوام",
            "en": "Outside hours"
          },
          "then": {
            "ar": "ردّ تلقائي",
            "en": "Auto-reply"
          }
        }
      ],
      "when": {
        "ar": "موعد الإرسال",
        "en": "Send time"
      },
      "slots": [
        {
          "d": {
            "ar": "الخميس",
            "en": "Thursday"
          },
          "t": {
            "ar": "10:00 ص",
            "en": "10:00 am"
          },
          "on": false
        },
        {
          "d": {
            "ar": "الجمعة",
            "en": "Friday"
          },
          "t": {
            "ar": "07:00 م",
            "en": "07:00 pm"
          },
          "on": true
        },
        {
          "d": {
            "ar": "السبت",
            "en": "Saturday"
          },
          "t": {
            "ar": "11:00 ص",
            "en": "11:00 am"
          },
          "on": false
        }
      ],
      "gradual": {
        "ar": "إرسال تدريجي يحمي الرقم",
        "en": "Gradual sending protects your number"
      },
      "site": {
        "ar": "متجرك.com",
        "en": "yourstore.com"
      },
      "siteNav": {
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
      "launcher": {
        "ar": "محتاج مساعدة؟",
        "en": "Need a hand?"
      }
    },
    "detail": {
      "dialects": [
        {
          "d": {
            "ar": "خليجي",
            "en": "Gulf"
          },
          "q": {
            "ar": "وش سعر الشحن؟",
            "en": "wesh si3r al-shahn?"
          }
        },
        {
          "d": {
            "ar": "مصري",
            "en": "Egyptian"
          },
          "q": {
            "ar": "بكام الشحن؟",
            "en": "bekam el-shahn?"
          }
        },
        {
          "d": {
            "ar": "شامي",
            "en": "Levantine"
          },
          "q": {
            "ar": "قدّيش التوصيل؟",
            "en": "addaysh el-tawseel?"
          }
        }
      ],
      "understood": {
        "ar": "سؤال واحد: كم تكلفة الشحن؟",
        "en": "One question: how much is shipping?"
      },
      "broadcast": {
        "ar": "حملة عرض الجمعة · ‎2,140 مستلماً",
        "en": "Friday offer campaign · 2,140 recipients"
      },
      "replies": [
        {
          "n": {
            "ar": "نورة العامري",
            "en": "Noura Al-Amri"
          },
          "m": {
            "ar": "أبغى أستفيد من العرض",
            "en": "I'd like to use the offer"
          }
        },
        {
          "n": {
            "ar": "خالد الحارثي",
            "en": "Khalid Al-Harthi"
          },
          "m": {
            "ar": "هل يشمل الشحن؟",
            "en": "Does it include shipping?"
          }
        }
      ],
      "landed": {
        "ar": "الردود تنزل في صندوق الوارد",
        "en": "Replies land in the shared inbox"
      },
      "roles": {
        "ar": [
          "مدير",
          "مشرف",
          "موظف"
        ],
        "en": [
          "Admin",
          "Lead",
          "Agent"
        ]
      },
      "caps": [
        {
          "l": {
            "ar": "يقرأ كل المحادثات",
            "en": "Reads every conversation"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "inbox"
          },
          "on": [
            true,
            true,
            false
          ]
        },
        {
          "l": {
            "ar": "يصدّر البيانات",
            "en": "Exports data"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "chart"
          },
          "on": [
            true,
            false,
            false
          ]
        },
        {
          "l": {
            "ar": "يحذف محادثة",
            "en": "Deletes a conversation"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "shield"
          },
          "on": [
            true,
            false,
            false
          ]
        }
      ],
      "offHours": {
        "ar": "خارج الدوام",
        "en": "Outside hours"
      },
      "closed": {
        "ar": "‎11:40 م — المكتب مغلق",
        "en": "11:40 pm — the office is closed"
      },
      "autoReply": {
        "ar": "نستلم رسالتك ونرد ‎9 ص",
        "en": "We have your message and reply at 9 am"
      },
      "queued": {
        "ar": "محفوظة في الطابور",
        "en": "Held in the queue"
      },
      "drillTop": {
        "l": {
          "ar": "متوسط أول ردّ",
          "en": "Avg. first reply"
        },
        "v": {
          "ar": "2.4 د",
          "en": "2.4 m"
        }
      },
      "drillRows": [
        {
          "l": {
            "ar": "واتساب",
            "en": "WhatsApp"
          },
          "v": {
            "ar": "1.8 د",
            "en": "1.8 m"
          },
          "pct": 44,
          "ch": "whatsapp"
        },
        {
          "l": {
            "ar": "إنستغرام",
            "en": "Instagram"
          },
          "v": {
            "ar": "2.6 د",
            "en": "2.6 m"
          },
          "pct": 63,
          "ch": "instagram"
        },
        {
          "l": {
            "ar": "تيك توك",
            "en": "TikTok"
          },
          "v": {
            "ar": "4.1 د",
            "en": "4.1 m"
          },
          "pct": 100,
          "ch": "tiktok"
        }
      ],
      "digest": {
        "ar": "التقرير الأسبوعي",
        "en": "Weekly report"
      },
      "digestTo": {
        "ar": "إلى بريد المدير",
        "en": "To the manager's inbox"
      },
      "digestRows": [
        {
          "l": {
            "ar": "المحادثات",
            "en": "Conversations"
          },
          "v": {
            "ar": "1,428",
            "en": "1,428"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "inbox"
          }
        },
        {
          "l": {
            "ar": "نسبة الحل",
            "en": "Resolution rate"
          },
          "v": {
            "ar": "96%",
            "en": "96%"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "check"
          }
        },
        {
          "l": {
            "ar": "أبطأ قناة",
            "en": "Slowest channel"
          },
          "v": {
            "ar": "تيك توك",
            "en": "TikTok"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "clock"
          }
        }
      ],
      "every": {
        "ar": "كل أحد ‎8:00 ص — بلا طلب",
        "en": "Every Sunday at 8:00 am — unasked"
      },
      "instant": {
        "ar": "ردّ خلال ثانيتين",
        "en": "Answered in two seconds"
      },
      "visitorAsk": {
        "ar": "كم سعر التوصيل للرياض؟",
        "en": "How much is delivery to Riyadh?"
      },
      "botReply": {
        "ar": "التوصيل للرياض ‎15 ر.س، ويصل خلال يومين.",
        "en": "Delivery to Riyadh is 15 SAR and arrives within two days."
      },
      "seconds": {
        "ar": "2.1 ثانية",
        "en": "2.1 seconds"
      },
      "matchPhone": {
        "ar": "‎+966 55 123 4567",
        "en": "+966 55 123 4567"
      },
      "matchName": {
        "ar": "نورة العامري",
        "en": "Noura Al-Amri"
      },
      "matched": {
        "ar": "طوبق مع حساب المتجر",
        "en": "Matched to the store account"
      },
      "profile": [
        {
          "l": {
            "ar": "الطلبات",
            "en": "Orders"
          },
          "v": {
            "ar": "7",
            "en": "7"
          }
        },
        {
          "l": {
            "ar": "آخر طلب",
            "en": "Last order"
          },
          "v": {
            "ar": "#4821",
            "en": "#4821"
          }
        },
        {
          "l": {
            "ar": "الإنفاق",
            "en": "Spend"
          },
          "v": {
            "ar": "3,420 ر.س",
            "en": "3,420 SAR"
          }
        }
      ],
      "hooks": [
        {
          "l": {
            "ar": "محادثة جديدة",
            "en": "New conversation"
          },
          "s": {
            "ar": "POST /webhook",
            "en": "POST /webhook"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "inbox"
          }
        },
        {
          "l": {
            "ar": "أُغلقت محادثة",
            "en": "Conversation closed"
          },
          "s": {
            "ar": "POST /webhook",
            "en": "POST /webhook"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "check"
          }
        },
        {
          "l": {
            "ar": "وسم أُضيف",
            "en": "Tag added"
          },
          "s": {
            "ar": "POST /webhook",
            "en": "POST /webhook"
          },
          "icon": {
            "type": "library",
            "set": "qhub",
            "name": "sparkles"
          }
        }
      ],
      "apiNote": {
        "ar": "واجهة مفتوحة تربطها بأي نظام لديك",
        "en": "An open API — wire it to any system you run"
      }
    },
    "compare": {
      "ai": {
        "canned": {
          "ar": "شكراً لتواصلك، سنعود إليك في أقرب وقت.",
          "en": "Thanks for reaching out, we'll get back to you shortly."
        },
        "ask": {
          "ar": "كم سعر الباقة الاحترافية؟",
          "en": "How much is the Professional plan?"
        },
        "answer": {
          "ar": "الاحترافية 49$ شهرياً، وتشمل المساعد وخمس قنوات.",
          "en": "Professional is $49/mo and includes the assistant and five channels."
        },
        "sources": {
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
        },
        "from": {
          "ar": "من قاعدة المعرفة · 1.8 ث",
          "en": "From the knowledge base · 1.8s"
        },
        "bad": {
          "ar": "الردّ نفسه لكل سؤال",
          "en": "One reply for every question"
        },
        "good": {
          "ar": "جواب يخصّ السؤال",
          "en": "An answer to the actual question"
        }
      },
      "camp": {
        "blast": {
          "ar": "نسخ ولصق على مئات الأرقام",
          "en": "Copy-pasted to hundreds of numbers"
        },
        "segment": {
          "ar": "سلّة متروكة · 640 عميلاً",
          "en": "Abandoned cart · 640 customers"
        },
        "funnel": [
          {
            "l": {
              "ar": "أُرسلت",
              "en": "Sent"
            },
            "v": {
              "ar": "640",
              "en": "640"
            }
          },
          {
            "l": {
              "ar": "وصلت",
              "en": "Delivered"
            },
            "v": {
              "ar": "628",
              "en": "628"
            }
          },
          {
            "l": {
              "ar": "فُتحت",
              "en": "Opened"
            },
            "v": {
              "ar": "401",
              "en": "401"
            }
          },
          {
            "l": {
              "ar": "ردّوا",
              "en": "Replied"
            },
            "v": {
              "ar": "112",
              "en": "112"
            }
          }
        ],
        "bad": {
          "ar": "الرقم محظور، ولا أحد يعرف من فتح",
          "en": "Number blocked, and nobody knows who opened"
        },
        "good": {
          "ar": "شريحة مستهدفة وأرقام لحظية",
          "en": "A targeted segment with live numbers"
        }
      },
      "team": {
        "agents": {
          "ar": [
            "سالم",
            "منال",
            "نورة"
          ],
          "en": [
            "Salem",
            "Manal",
            "Noura"
          ]
        },
        "loads": [
          9,
          0,
          4
        ],
        "balanced": [
          4,
          4,
          5
        ],
        "incoming": {
          "ar": "محادثة واردة",
          "en": "Incoming conversation"
        },
        "rule": {
          "ar": "قاعدة: للأقلّ حِملاً في المبيعات",
          "en": "Rule: to the least loaded in Sales"
        },
        "bad": {
          "ar": "المشرف يوزّع يدوياً",
          "en": "A supervisor assigning by hand"
        },
        "good": {
          "ar": "توزيع آلي بسقف لكل موظف",
          "en": "Automatic routing with a cap per agent"
        }
      },
      "stats": {
        "metric": {
          "ar": "متوسط أول ردّ",
          "en": "Avg. first reply"
        },
        "value": {
          "ar": "4.7",
          "en": "4.7"
        },
        "unit": {
          "ar": "د",
          "en": "m"
        },
        "why": {
          "ar": "لماذا ارتفع؟",
          "en": "Why did it rise?"
        },
        "rows": [
          {
            "l": {
              "ar": "واتساب · 3–5م",
              "en": "WhatsApp · 3–5pm"
            },
            "v": {
              "ar": "9.2 د",
              "en": "9.2m"
            }
          },
          {
            "l": {
              "ar": "إنستغرام",
              "en": "Instagram"
            },
            "v": {
              "ar": "3.1 د",
              "en": "3.1m"
            }
          }
        ],
        "bad": {
          "ar": "رقم بلا تفسير",
          "en": "A number with no explanation"
        },
        "good": {
          "ar": "نقرة على الرقم تكشف سببه",
          "en": "Click the number, see what caused it"
        }
      },
      "widget": {
        "form": {
          "ar": [
            "الاسم",
            "البريد",
            "رسالتك"
          ],
          "en": [
            "Name",
            "Email",
            "Your message"
          ]
        },
        "send": {
          "ar": "أرسل",
          "en": "Send"
        },
        "ask": {
          "ar": "عندكم شحن لصلالة؟",
          "en": "Do you ship to Salalah?"
        },
        "reply": {
          "ar": "نعم، خلال يومين.",
          "en": "Yes, within two days."
        },
        "page": {
          "ar": "من صفحة: /pricing",
          "en": "From page: /pricing"
        },
        "bad": {
          "ar": "نردّ خلال 48 ساعة",
          "en": "We reply within 48 hours"
        },
        "good": {
          "ar": "ردّ فوري مع سياق الصفحة",
          "en": "An instant reply, with page context"
        }
      },
      "integ": {
        "store": {
          "ar": "تطبيق واتساب",
          "en": "WhatsApp app"
        },
        "chat": {
          "ar": "تطبيق إنستغرام",
          "en": "Instagram app"
        },
        "order": {
          "ar": "محادثة واردة",
          "en": "Incoming conversation"
        },
        "status": {
          "ar": "وصلت من واتساب",
          "en": "Arrived from WhatsApp"
        },
        "match": {
          "ar": "أُسندت لمنال",
          "en": "Assigned to Manal"
        },
        "bad": {
          "ar": "تنقّل بين التطبيقات",
          "en": "Switching between apps"
        },
        "good": {
          "ar": "كل القنوات في صندوق واحد",
          "en": "Every channel in one inbox"
        }
      }
    },
    "homeSectors": {
      "order": {
        "ar": "طلب #142",
        "en": "Order #142"
      },
      "items": [
        {
          "ar": [
            "برجر دجاج ×2",
            "7.00"
          ],
          "en": [
            "Chicken burger ×2",
            "7.00"
          ]
        },
        {
          "ar": [
            "سلطة سيزر",
            "3.50"
          ],
          "en": [
            "Caesar salad",
            "3.50"
          ]
        },
        {
          "ar": [
            "عصير برتقال",
            "2.00"
          ],
          "en": [
            "Orange juice",
            "2.00"
          ]
        }
      ],
      "total": {
        "ar": "الإجمالي",
        "en": "Total"
      },
      "restaurant": {
        "ar": "مطعم الواحة",
        "en": "Al-Waha Restaurant"
      },
      "newOrder": {
        "ar": "طلب جديد",
        "en": "New order"
      },
      "askTitle": {
        "ar": "سؤال متكرّر",
        "en": "A repeat question"
      },
      "askWhen": {
        "ar": "وصل 11:40 مساءً",
        "en": "Arrived 11:40 pm"
      },
      "askAnswer": {
        "ar": "دوام العيادة من 9 صباحاً إلى 9 مساءً طوال أيام الأسبوع 🌷",
        "en": "The clinic is open 9 am to 9 pm, every day of the week 🌷"
      },
      "aiTag": {
        "ar": "ردّ المساعد",
        "en": "AI reply"
      },
      "clientName": {
        "ar": "عمر المالكي",
        "en": "Omar Al-Maliki"
      },
      "clientRole": {
        "ar": "استشارة عقارية",
        "en": "Property consultation"
      },
      "tags": {
        "ar": [
          "عميل محتمل",
          "عاجل"
        ],
        "en": [
          "Lead",
          "Urgent"
        ]
      },
      "confirmed": {
        "ar": "مؤكّد",
        "en": "Confirmed"
      },
      "ready": {
        "ar": "طلبك جاهز للاستلام بعد 15 دقيقة ✅",
        "en": "Your order is ready for pickup in 15 minutes ✅"
      },
      "clientInitials": {
        "ar": "ع م",
        "en": "OM"
      },
      "clientMsg": {
        "ar": "أبغى أعرف عمولتكم على بيع فيلا",
        "en": "What's your commission on selling a villa?"
      },
      "agentInitial": {
        "ar": "ن",
        "en": "N"
      },
      "autoAssigned": {
        "ar": "أُسند تلقائياً",
        "en": "Auto-assigned"
      },
      "agentName": {
        "ar": "نورة · المبيعات",
        "en": "Noura · Sales"
      },
      "creatorItems": [
        {
          "k": {
            "ar": "instagram",
            "en": "instagram"
          },
          "n": {
            "ar": "سؤال من متابع",
            "en": "A follower question"
          }
        },
        {
          "k": {
            "ar": "telegram",
            "en": "telegram"
          },
          "n": {
            "ar": "طلب تعاون",
            "en": "A collaboration request"
          }
        },
        {
          "k": {
            "ar": "tiktok",
            "en": "tiktok"
          },
          "n": {
            "ar": "استفسار عن الأسعار",
            "en": "A question about pricing"
          }
        }
      ],
      "creatorInbox": {
        "ar": "صندوق واحد",
        "en": "One inbox"
      },
      "beautyMenu": {
        "ar": "قائمة الخدمات",
        "en": "Service list"
      },
      "beautyItems": {
        "ar": [
          "قصّ وتصفيف",
          "عناية بالبشرة",
          "مناكير"
        ],
        "en": [
          "Cut & styling",
          "Facial",
          "Manicure"
        ]
      },
      "beautySent": {
        "ar": "تُرسل بردّ جاهز",
        "en": "Sent as a saved reply"
      },
      "realtyUnit": {
        "ar": "وحدة A-12",
        "en": "Unit A-12"
      },
      "realtyMeta": {
        "ar": "3 غرف · 120م²",
        "en": "3 rooms · 120 m²"
      },
      "realtyTag": {
        "ar": "مهتم",
        "en": "Interested"
      },
      "realtyAgent": {
        "ar": "أُسندت إلى منال",
        "en": "Assigned to Manal"
      }
    },
    "solutions": {
      "ecomAsk": {
        "ar": "وين طلبي؟",
        "en": "Where is my order?"
      },
      "ecomOrder": {
        "ar": "طلب #4821",
        "en": "Order #4821"
      },
      "ecomRows": [
        {
          "k": {
            "ar": "الحالة",
            "en": "Status"
          },
          "v": {
            "ar": "خرج للتوصيل",
            "en": "Out for delivery"
          }
        },
        {
          "k": {
            "ar": "الوصول",
            "en": "Arrives"
          },
          "v": {
            "ar": "خلال يومين",
            "en": "Within two days"
          }
        }
      ],
      "ecomAuto": {
        "ar": "أُرسلت بردّ جاهز فيه رقم الطلب",
        "en": "Sent from a saved reply with the order number"
      },
      "creatorTag": {
        "ar": "تعاون تجاري",
        "en": "Brand deal"
      },
      "creatorInbox": {
        "ar": "صندوق واحد",
        "en": "One inbox"
      },
      "creatorMsgs": {
        "ar": [
          "طلب تعاون",
          "سؤال عن الأسعار",
          "رسالة من متابع"
        ],
        "en": [
          "A collaboration request",
          "A question about pricing",
          "A message from a follower"
        ]
      },
      "clinicTitle": {
        "ar": "طلب مراجع جديد",
        "en": "New patient enquiry"
      },
      "clinicWhen": {
        "ar": "سؤال عن خدمات العيادة",
        "en": "Asking about your services"
      },
      "clinicConfirm": {
        "ar": "ردّ جاهز",
        "en": "Saved reply"
      },
      "clinicMove": {
        "ar": "إسناد إلى قسم",
        "en": "Assign to a department"
      },
      "clinicSent": {
        "ar": "تُوزَّع على القسم المناسب",
        "en": "Routed to the right department"
      },
      "realtyStages": {
        "ar": [
          "مهتم",
          "عاين",
          "تفاوض"
        ],
        "en": [
          "Interested",
          "Viewed",
          "Negotiating"
        ]
      },
      "realtyUnits": [
        {
          "u": {
            "ar": "وحدة A-12",
            "en": "Unit A-12"
          },
          "agent": {
            "ar": "منال",
            "en": "Manal"
          },
          "stage": 2
        },
        {
          "u": {
            "ar": "وحدة B-04",
            "en": "Unit B-04"
          },
          "agent": {
            "ar": "سالم",
            "en": "Salem"
          },
          "stage": 1
        },
        {
          "u": {
            "ar": "فيلا C-31",
            "en": "Villa C-31"
          },
          "agent": {
            "ar": "نورة",
            "en": "Noura"
          },
          "stage": 0
        }
      ],
      "svcHours": {
        "ar": "‎24/7 بلا انتظار",
        "en": "24/7, no waiting"
      },
      "svcAr": {
        "ar": "كم تكلفة الاستشارة الأولى؟",
        "en": "كم تكلفة الاستشارة الأولى؟"
      },
      "svcEn": {
        "ar": "Do you work with clients abroad?",
        "en": "Do you work with clients abroad?"
      },
      "svcAt": {
        "ar": [
          "‎02:14 ص",
          "‎03:47 ص"
        ],
        "en": [
          "02:14 am",
          "03:47 am"
        ]
      },
      "beautyMenu": {
        "ar": "قائمة الخدمات",
        "en": "Service menu"
      },
      "beautyItems": [
        {
          "s": {
            "ar": "قصّ وتصفيف",
            "en": "Cut & styling"
          },
          "p": {
            "ar": "120 ر.س",
            "en": "120 SAR"
          }
        },
        {
          "s": {
            "ar": "عناية بالبشرة",
            "en": "Facial"
          },
          "p": {
            "ar": "260 ر.س",
            "en": "260 SAR"
          }
        },
        {
          "s": {
            "ar": "مناكير",
            "en": "Manicure"
          },
          "p": {
            "ar": "90 ر.س",
            "en": "90 SAR"
          }
        }
      ],
      "beautyBooked": {
        "ar": "أُرسلت بردّ جاهز داخل المحادثة",
        "en": "Sent as a saved reply in the chat"
      }
    }
  },
  "demos": {
    "frame": {
      "ar": "مباشر",
      "en": "Live"
    },
    "inbox": {
      "title": {
        "ar": "صندوق وارد Qhub",
        "en": "The Qhub inbox"
      },
      "chip": {
        "ar": "{0} محادثة واردة من 5 قنوات",
        "en": "{0} conversations from 5 channels"
      },
      "hint": {
        "ar": "اضغط أي محادثة لتفتح تفاصيلها؛ الرسائل أعلاه تصل من واتساب وإنستغرام والبريد وتيليجرام ونافذة الدردشة المباشرة على الموقع.",
        "en": "Tap any conversation to open it — these messages arrive from WhatsApp, Instagram, email, Telegram and the site widget."
      },
      "tabs": [
        {
          "id": "all",
          "label": {
            "ar": "الكل",
            "en": "All"
          }
        },
        {
          "id": "new",
          "label": {
            "ar": "جديدة",
            "en": "New"
          }
        },
        {
          "id": "active",
          "label": {
            "ar": "قيد المعالجة",
            "en": "In progress"
          }
        }
      ],
      "states": {
        "new": {
          "ar": "جديدة",
          "en": "New"
        },
        "active": {
          "ar": "قيد المعالجة",
          "en": "In progress"
        },
        "closed": {
          "ar": "مغلقة",
          "en": "Closed"
        },
        "ai": {
          "ar": "ردّ المساعد",
          "en": "AI replied"
        }
      },
      "assigned": {
        "ar": "مُسندة",
        "en": "Assigned"
      },
      "autoReply": {
        "ar": "ردّ آلي",
        "en": "Auto reply"
      },
      "agent": {
        "ar": "سالم الرواحي",
        "en": "Salem Al-Rawahi"
      },
      "agentInitial": {
        "ar": "س",
        "en": "S"
      },
      "aiName": {
        "ar": "المساعد الذكي",
        "en": "AI assistant"
      },
      "placeholder": {
        "ar": "اكتب ردّك هنا…",
        "en": "Write your reply…"
      },
      "back": {
        "ar": "رجوع للقائمة",
        "en": "Back to list"
      },
      "empty": {
        "ar": "لا محادثات في هذه الحالة",
        "en": "No conversations in this state"
      },
      "convs": [
        {
          "name": {
            "ar": "منى الزدجالية",
            "en": "Mona Al-Zadjali"
          },
          "msg": {
            "ar": "أريد عرض الفيلا مع معاينة هذا الأسبوع",
            "en": "I'd like to view the villa this week"
          },
          "time": {
            "ar": "الآن",
            "en": "Now"
          },
          "dept": {
            "ar": "الإدارة",
            "en": "Management"
          },
          "thread": {
            "ar": [
              "مساء الخير، رأيت إعلان فيلا الموج على إنستغرام",
              "أريد عرض الفيلا مع معاينة هذا الأسبوع"
            ],
            "en": [
              "Good evening — I saw the Al-Mouj villa listing on Instagram",
              "I'd like to view the villa this week"
            ]
          }
        },
        {
          "name": {
            "ar": "سارة المعمري",
            "en": "Sara Al-Maamari"
          },
          "msg": {
            "ar": "كيف يمكنني ربط حساب الواتساب؟",
            "en": "How do I connect a WhatsApp account?"
          },
          "time": {
            "ar": "الآن",
            "en": "Now"
          },
          "dept": {
            "ar": "خدمة العملاء",
            "en": "Customer service"
          },
          "thread": {
            "ar": [
              "كيف يمكنني ربط حساب الواتساب؟",
              "من صفحة «الحسابات والربط» تختارين WhatsApp Business ثم «إدارة» وتمسحين رمز QR. الربط ينتهي خلال أقل من دقيقة 👍"
            ],
            "en": [
              "How do I connect a WhatsApp account?",
              "On the “Accounts & channels” page pick WhatsApp Business, then “Manage”, and scan the QR code. It takes under a minute 👍"
            ]
          }
        },
        {
          "name": {
            "ar": "خالد اللوجستية",
            "en": "Khalid Logistics"
          },
          "msg": {
            "ar": "طلب عرض سعر لعقد سنوي",
            "en": "Requesting a quote for an annual contract"
          },
          "time": {
            "ar": "قبل دقيقتين",
            "en": "2m ago"
          },
          "dept": {
            "ar": "المبيعات",
            "en": "Sales"
          },
          "thread": {
            "ar": [
              "السلام عليكم، نحتاج عرض سعر لعقد سنوي لـ 25 موظفاً.",
              "وعليكم السلام أستاذ خالد، جهّزت عرضاً مبدئياً وأرسلته على بريدك. أراجعه معك اليوم؟"
            ],
            "en": [
              "Hello — we need a quote for an annual contract covering 25 agents.",
              "Hello Khalid, I've put together an initial quote and sent it to your email. Shall we go through it today?"
            ]
          }
        },
        {
          "name": {
            "ar": "بدر السيابي",
            "en": "Badr Al-Siyabi"
          },
          "msg": {
            "ar": "أبحث عن تويوتا لاند كروزر",
            "en": "Looking for a Toyota Land Cruiser"
          },
          "time": {
            "ar": "قبل 5 دقائق",
            "en": "5m ago"
          },
          "dept": {
            "ar": "المبيعات",
            "en": "Sales"
          },
          "thread": {
            "ar": [
              "أبحث عن تويوتا لاند كروزر موديل 2024، متوفّرة؟"
            ],
            "en": [
              "Looking for a 2024 Toyota Land Cruiser — do you have one?"
            ]
          }
        },
        {
          "name": {
            "ar": "ريم اللواتي",
            "en": "Reem Al-Lawati"
          },
          "msg": {
            "ar": "نعم، هذا السعر مناسب",
            "en": "Yes, that price works"
          },
          "time": {
            "ar": "قبل 8 دقائق",
            "en": "8m ago"
          },
          "dept": {
            "ar": "المبيعات",
            "en": "Sales"
          },
          "thread": {
            "ar": [
              "الباقة الاحترافية 49$ شهرياً وتشمل المساعد الذكي وثلاث قنوات.",
              "نعم، هذا السعر مناسب",
              "ممتاز! أرسلت رابط الاشتراك على بريدك. أهلاً بك معنا 🎉"
            ],
            "en": [
              "The Professional plan is $49 a month and includes the AI assistant and three channels.",
              "Yes, that price works",
              "Great! I've sent the signup link to your email. Welcome aboard 🎉"
            ]
          }
        }
      ],
      "incoming": [
        {
          "name": {
            "ar": "هدى الزدجالية",
            "en": "Huda Al-Zadjali"
          },
          "msg": {
            "ar": "هل التوصيل متاح اليوم؟",
            "en": "Is delivery available today?"
          },
          "dept": {
            "ar": "المبيعات",
            "en": "Sales"
          },
          "ch": "whatsapp",
          "thread": {
            "ar": [
              "هل التوصيل متاح اليوم؟"
            ],
            "en": [
              "Is delivery available today?"
            ]
          }
        },
        {
          "name": {
            "ar": "متجر أصالة",
            "en": "Asala Store"
          },
          "msg": {
            "ar": "أريد ربط حسابي على إنستغرام",
            "en": "I want to connect my Instagram"
          },
          "dept": {
            "ar": "الدعم",
            "en": "Support"
          },
          "ch": "instagram",
          "thread": {
            "ar": [
              "أريد ربط حسابي على إنستغرام بالمنصّة، كيف أبدأ؟"
            ],
            "en": [
              "I want to connect my Instagram account — where do I start?"
            ]
          }
        },
        {
          "name": {
            "ar": "سالم الحجري",
            "en": "Salem Al-Hajri"
          },
          "msg": {
            "ar": "فاتورة الشهر الماضي",
            "en": "Last month's invoice"
          },
          "dept": {
            "ar": "المحاسبة",
            "en": "Accounts"
          },
          "ch": "email",
          "thread": {
            "ar": [
              "ممكن نسخة من فاتورة الشهر الماضي؟"
            ],
            "en": [
              "Could I get a copy of last month's invoice?"
            ]
          }
        },
        {
          "name": {
            "ar": "نورة البلوشية",
            "en": "Noura Al-Balushi"
          },
          "msg": {
            "ar": "متى يفتح الفرع؟",
            "en": "When does the branch open?"
          },
          "dept": {
            "ar": "الدعم",
            "en": "Support"
          },
          "ch": "telegram",
          "thread": {
            "ar": [
              "متى يفتح فرع الخوض اليوم؟"
            ],
            "en": [
              "What time does the Al-Khoud branch open today?"
            ]
          }
        }
      ],
      "follow": [
        {
          "ask": {
            "ar": "وهل في خصم على الطلب الثاني؟",
            "en": "Is there a discount on a second order?"
          },
          "reply": {
            "ar": "نعم، خصم ‎10% على الطلب الثاني خلال الشهر نفسه.",
            "en": "Yes, 10% off a second order within the same month 🌿"
          }
        },
        {
          "ask": {
            "ar": "ممكن الدفع عند الاستلام؟",
            "en": "Can I pay on delivery?"
          },
          "reply": {
            "ar": "متاح داخل مسقط، ولباقي المحافظات الدفع مسبق.",
            "en": "Available inside Muscat; other governorates are prepaid."
          }
        },
        {
          "ask": {
            "ar": "كم يوم يستغرق الشحن؟",
            "en": "How long does shipping take?"
          },
          "reply": {
            "ar": "من يومين إلى أربعة أيام عمل حسب المحافظة.",
            "en": "Two to four working days depending on the governorate."
          }
        }
      ],
      "followMail": [
        {
          "ask": {
            "ar": "وهل يمكن إرسالها بصيغة PDF؟",
            "en": "Could you send it as a PDF?"
          },
          "reply": {
            "ar": "أرسلنا الفاتورة PDF على بريدك الآن.",
            "en": "The invoice has been emailed to you as a PDF ✅"
          }
        },
        {
          "ask": {
            "ar": "أحتاج نسخة باسم الشركة وسجلّها التجاري.",
            "en": "I need it issued to the company with its CR number."
          },
          "reply": {
            "ar": "حدّثنا بيانات الفوترة وأعدنا إصدارها باسم الشركة.",
            "en": "We updated the billing details and re-issued it to the company."
          }
        }
      ]
    },
    "ai": {
      "title": {
        "ar": "محادثة واتساب حقيقية",
        "en": "A real WhatsApp conversation"
      },
      "hint": {
        "ar": "هذا عرض توضيحي على الموقع. داخل حسابك يتدرّب المساعد على قاعدة معرفة منتجاتك أنت.",
        "en": "This is a demo on the website. Inside your account the assistant trains on your own product knowledge base."
      },
      "replay": {
        "ar": "أعد العرض",
        "en": "Replay"
      },
      "steps": {
        "ar": [
          "1 · العميل يسأل",
          "2 · المساعد يردّ فوراً",
          "3 · تحويل تلقائي بملخّص",
          "4 · الموظف يكمّل"
        ],
        "en": [
          "1 · Customer asks",
          "2 · Instant AI reply",
          "3 · Automatic handoff",
          "4 · Agent finishes"
        ]
      },
      "lines": {
        "ar": [
          "السلام عليكم، هل العرض ما زال متاحاً؟",
          "وعليكم السلام ورحمة الله. العرض ما زال سارياً حتى نهاية الشهر: خصم 20% على كل باقات الاشتراك السنوي. هل أرسل لك التفاصيل؟",
          "عندي فرعان ولكل فرع رقم واتساب مختلف، وأريد تقارير منفصلة لكل فرع مع فوترة واحدة. هل هذا ممكن؟",
          "أهلاً أستاذ سالم، معك ريم من فريق المبيعات. نعم ممكن تماماً: تربط رقمين كحسابين منفصلين، فيصير لكل حساب تقاريره المستقلة، وتبقى الفوترة على اشتراك واحد. أرتّب لك عرضاً سريعاً اليوم؟"
        ],
        "en": [
          "Hello — is the offer still available?",
          "Hello. The offer runs until the end of the month: 20% off every annual plan. Shall I send you the details?",
          "I have two branches, each with its own WhatsApp number, and I want separate reports per branch but a single invoice. Is that possible?",
          "Hi Salem, this is Reem from sales. Yes, absolutely: you connect the two numbers as separate accounts, each with its own reports, while billing stays on one subscription. Shall I set up a quick call today?"
        ]
      },
      "handoffTitle": {
        "ar": "تحويل تلقائي لموظف",
        "en": "Automatic handoff to an agent"
      },
      "handoffBody": {
        "ar": "حالة تحتاج مراجعة بشرية: سؤال خارج قاعدة المعرفة (فوترة موحّدة مع فصل التقارير). حُوّلت المحادثة لقسم المبيعات مع ملخّص.",
        "en": "A case needing human review — the question falls outside the knowledge base (unified billing with separated reporting). The conversation moved to sales with a summary."
      },
      "summaryTitle": {
        "ar": "ملخّص المحادثة للموظف",
        "en": "Conversation summary for the agent"
      },
      "summary": {
        "ar": [
          "العميل مهتم بالعرض السنوي (خصم 20%).",
          "لديه فرعان برقمَي واتساب مختلفين.",
          "يطلب تقارير منفصلة لكل فرع مع فوترة موحّدة."
        ],
        "en": [
          "Customer is interested in the annual offer (20% off).",
          "Has two branches on two different WhatsApp numbers.",
          "Wants separate reports per branch with unified billing."
        ]
      },
      "placeholder": {
        "ar": "جرّب بنفسك: اكتب سؤالاً كأنك عميل…",
        "en": "Try it — write a question as if you were a customer…"
      },
      "send": {
        "ar": "إرسال",
        "en": "Send"
      },
      "aiMeta": {
        "ar": "المساعد الذكي · ردّ خلال 1.8 ث",
        "en": "AI assistant · replied in 1.8s"
      },
      "agentMeta": {
        "ar": "ريم اللواتي · مبيعات",
        "en": "Reem Al-Lawati · Sales"
      },
      "customerMeta": {
        "ar": "سالم — واتساب",
        "en": "Salem — WhatsApp"
      },
      "agentInitial": {
        "ar": "ر",
        "en": "R"
      },
      "customerInitial": {
        "ar": "س",
        "en": "S"
      },
      "tryThis": {
        "ar": "جرّب تسأل:",
        "en": "Try asking:"
      }
    },
    "campaign": {
      "title": {
        "ar": "إرسال حملة واتساب",
        "en": "Sending a WhatsApp campaign"
      },
      "chip": {
        "ar": "قوالب معتمدة",
        "en": "Approved templates"
      },
      "hint": {
        "ar": "في حسابك تجدول الإرسال، وتستهدف حسب الوسوم، وتتابع تقرير الحملة لحظة بلحظة.",
        "en": "In your account you schedule the send, target by tags, and follow the campaign report as it happens."
      },
      "stepOne": {
        "ar": "١ · اختر قالباً",
        "en": "1 · Pick a template"
      },
      "stepTwo": {
        "ar": "٢ · عايِن وأرسل",
        "en": "2 · Preview and send"
      },
      "approved": {
        "ar": "قالب معتمد",
        "en": "Approved template"
      },
      "audience": {
        "ar": "الجمهور",
        "en": "Audience"
      },
      "recipients": {
        "ar": "عدد المستلمين",
        "en": "Recipients"
      },
      "channel": {
        "ar": "القناة",
        "en": "Channel"
      },
      "send": {
        "ar": "أرسل الحملة الآن",
        "en": "Send the campaign"
      },
      "sending": {
        "ar": "{0} / {1} مُرسلة",
        "en": "{0} / {1} sent"
      },
      "done": {
        "ar": "تم إرسال {0} رسالة",
        "en": "{0} messages sent"
      },
      "again": {
        "ar": "جرّب حملة أخرى",
        "en": "Try another campaign"
      },
      "stats": {
        "ar": [
          "الوصول",
          "نسبة الفتح",
          "نسبة النقر",
          "ردود واردة"
        ],
        "en": [
          "Reach",
          "Open rate",
          "Click rate",
          "Replies"
        ]
      },
      "tpls": [
        {
          "name": {
            "ar": "عرض ترويجي",
            "en": "Promotional offer"
          },
          "tag": {
            "ar": "تسويق",
            "en": "Marketing"
          },
          "body": {
            "ar": "أهلاً {{الاسم}} 👋\nخصم 20% على كل الباقات حتى نهاية الشهر.\nاستخدم كود *QHUB20* عند الاشتراك.",
            "en": "Hi {{name}} 👋\n20% off every plan until the end of the month.\nUse code *QHUB20* at checkout."
          },
          "audience": {
            "ar": "كل العملاء",
            "en": "All customers"
          }
        },
        {
          "name": {
            "ar": "متابعة سلة متروكة",
            "en": "Abandoned cart"
          },
          "tag": {
            "ar": "متابعة",
            "en": "Follow-up"
          },
          "body": {
            "ar": "مرحباً {{الاسم}} 🛒\nلاحظنا أن طلبك لم يكتمل. نحجز لك المنتجات 24 ساعة إضافية.",
            "en": "Hello {{name}} 🛒\nWe noticed your order wasn't completed. We'll hold the items for another 24 hours."
          },
          "audience": {
            "ar": "عملاء لديهم سلة متروكة",
            "en": "Customers with an abandoned cart"
          }
        },
        {
          "name": {
            "ar": "ترحيب بعميل جديد",
            "en": "New customer welcome"
          },
          "tag": {
            "ar": "ترحيب",
            "en": "Welcome"
          },
          "body": {
            "ar": "أهلاً بك في {{الشركة}} 🎉\nحسابك جاهز. لأي استفسار راسلنا هنا ويصلك الردّ خلال دقائق.",
            "en": "Welcome to {{company}} 🎉\nYour account is ready. Message us here any time and we'll reply within minutes."
          },
          "audience": {
            "ar": "عملاء جدد هذا الأسبوع",
            "en": "New customers this week"
          }
        },
        {
          "name": {
            "ar": "تذكير بالدفع",
            "en": "Payment reminder"
          },
          "tag": {
            "ar": "دفع",
            "en": "Billing"
          },
          "body": {
            "ar": "تذكير ودّي {{الاسم}} 💳\nفاتورتك بقيمة {{المبلغ}} تستحق بعد ثلاثة أيام، ويمكن دفعها من هنا مباشرة.",
            "en": "A friendly reminder {{name}} 💳\nYour invoice for {{amount}} is due in three days, and you can pay it right here."
          },
          "audience": {
            "ar": "اشتراكات تستحق قريباً",
            "en": "Subscriptions due soon"
          }
        }
      ]
    },
    "routing": {
      "title": {
        "ar": "التوزيع التلقائي وهو يشتغل",
        "en": "Automatic routing at work"
      },
      "hint": {
        "ar": "القواعد المحدَّدة مسبقاً تقرأ الرسالة وتوجّهها إلى القسم والموظف الصحيح، بلا تدخّل يدوي.",
        "en": "Rules set once read the message and send it to the right department and agent — with no manual step."
      },
      "run": {
        "ar": "شغّل التوزيع",
        "en": "Run the routing"
      },
      "again": {
        "ar": "أعد التشغيل",
        "en": "Run it again"
      },
      "incoming": {
        "ar": "محادثة واردة من واتساب · قسم المبيعات",
        "en": "Incoming WhatsApp conversation · Sales"
      },
      "arrived": {
        "ar": "وصلت محادثة جديدة من واتساب — قسم المبيعات",
        "en": "A new WhatsApp conversation arrived — Sales"
      },
      "names": {
        "ar": [
          "عبدالله الهنائي",
          "سالم الحارثي",
          "ريم اللواتي",
          "لطيفة الحبسي"
        ],
        "en": [
          "Abdullah Al-Hinai",
          "Salem Al-Harthy",
          "Reem Al-Lawati",
          "Latifa Al-Habsi"
        ]
      },
      "depts": {
        "sales": {
          "ar": "مبيعات",
          "en": "Sales"
        },
        "support": {
          "ar": "خدمة العملاء",
          "en": "Customer service"
        }
      },
      "statuses": {
        "online": {
          "ar": "متاح",
          "en": "Available"
        },
        "busy": {
          "ar": "مشغول",
          "en": "At capacity"
        },
        "offline": {
          "ar": "خارج الدوام",
          "en": "Off shift"
        }
      },
      "skipDept": {
        "ar": "من قسم {0}، والمحادثة للمبيعات",
        "en": "is in {0}, and this conversation is for Sales"
      },
      "skipOffline": {
        "ar": "خارج ساعات العمل",
        "en": "is outside working hours"
      },
      "skipBusy": {
        "ar": "بلغ سقف المحادثات المتزامنة ({0})",
        "en": "has hit the concurrent cap ({0})"
      },
      "assigned": {
        "ar": "أُسندت إلى {0} — متاح وتحت السقف ({1})",
        "en": "Assigned to {0} — available and under the cap ({1})"
      },
      "conversations": {
        "ar": "محادثة",
        "en": "conversations"
      }
    },
    "reports": {
      "title": {
        "ar": "لوحة تقارير مصغّرة",
        "en": "A miniature reports dashboard"
      },
      "hint": {
        "ar": "بدّل بين اليوم والأسبوع والشهر، فتتحدّث كل الأرقام والرسوم. وفي حسابك تُصدَّر PDF أو Excel.",
        "en": "Switch between today, the week and the month — every number and bar updates. In your account you export to PDF or Excel."
      },
      "periods": {
        "today": {
          "ar": "اليوم",
          "en": "Today"
        },
        "week": {
          "ar": "الأسبوع",
          "en": "This week"
        },
        "month": {
          "ar": "الشهر",
          "en": "This month"
        }
      },
      "kpis": [
        {
          "label": {
            "ar": "محادثات جديدة",
            "en": "New conversations"
          },
          "unit": {
            "ar": "",
            "en": ""
          },
          "color": {
            "ar": "#2563EB",
            "en": "#2563EB"
          }
        },
        {
          "label": {
            "ar": "متوسط وقت الرد (د)",
            "en": "Avg. reply time (m)"
          },
          "unit": {
            "ar": "",
            "en": ""
          },
          "color": {
            "ar": "#F59E0B",
            "en": "#F59E0B"
          }
        },
        {
          "label": {
            "ar": "نسبة ردود المساعد",
            "en": "Handled by AI"
          },
          "unit": {
            "ar": "%",
            "en": "%"
          },
          "color": {
            "ar": "#8B5CF6",
            "en": "#8B5CF6"
          }
        },
        {
          "label": {
            "ar": "تقييم العملاء",
            "en": "Customer rating"
          },
          "unit": {
            "ar": " / 5",
            "en": " / 5"
          },
          "color": {
            "ar": "#10B981",
            "en": "#10B981"
          }
        }
      ],
      "volume": {
        "ar": "حجم المحادثات",
        "en": "Conversation volume"
      },
      "whoReplied": {
        "ar": "من ردّ؟",
        "en": "Who replied?"
      },
      "byAi": {
        "ar": "تولّاها المساعد الذكي",
        "en": "handled by the assistant"
      },
      "toAgent": {
        "ar": "حُوّلت لموظف بشري",
        "en": "handed to a human agent"
      },
      "labels": {
        "today": {
          "ar": [
            "9ص",
            "11ص",
            "1م",
            "3م",
            "5م",
            "7م",
            "9م"
          ],
          "en": [
            "9am",
            "11am",
            "1pm",
            "3pm",
            "5pm",
            "7pm",
            "9pm"
          ]
        },
        "week": {
          "ar": [
            "أحد",
            "إثنين",
            "ثلاثاء",
            "أربعاء",
            "خميس",
            "جمعة",
            "سبت"
          ],
          "en": [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
          ]
        },
        "month": {
          "ar": [
            "أ1",
            "أ2",
            "أ3",
            "أ4",
            "أ5",
            "أ6",
            "أ7"
          ],
          "en": [
            "W1",
            "W2",
            "W3",
            "W4",
            "W5",
            "W6",
            "W7"
          ]
        }
      }
    },
    "widget": {
      "title": {
        "ar": "خصّص نافذة الدردشة وشاهدها تتغيّر",
        "en": "Customise the widget and watch it change"
      },
      "chip": {
        "ar": "تحرير مباشر",
        "en": "Live editing"
      },
      "hint": {
        "ar": "غيّر اللون والاسم ورسالة الترحيب، فتتحدّث نافذة الدردشة على اليسار فوراً؛ وهو ما يراه زائر موقعك بالضبط.",
        "en": "Change the colour, the name and the greeting — the widget updates instantly, and this is exactly what a visitor sees."
      },
      "colorLabel": {
        "ar": "لون النافذة",
        "en": "Widget colour"
      },
      "nameLabel": {
        "ar": "اسم النشاط",
        "en": "Business name"
      },
      "welcomeLabel": {
        "ar": "رسالة الترحيب",
        "en": "Greeting message"
      },
      "defaultName": {
        "ar": "متجر نزوى",
        "en": "Nizwa Store"
      },
      "defaultWelcome": {
        "ar": "أهلاً بك 👋 كيف يمكننا مساعدتك اليوم؟",
        "en": "Hi 👋 How can we help you today?"
      },
      "open": {
        "ar": "افتح المحادثة",
        "en": "Open the chat"
      },
      "close": {
        "ar": "إغلاق",
        "en": "Close"
      },
      "placeholder": {
        "ar": "اكتب رسالتك…",
        "en": "Write your message…"
      },
      "send": {
        "ar": "إرسال",
        "en": "Send"
      },
      "aiName": {
        "ar": "المساعد الذكي",
        "en": "AI assistant"
      },
      "visitorInitial": {
        "ar": "أ",
        "en": "V"
      }
    },
    "integrations": {
      "title": {
        "ar": "التكاملات وخطوات ربطها",
        "en": "Integrations and how they connect"
      },
      "chip": {
        "ar": "{0} تكاملاً جاهزاً",
        "en": "{0} ready integrations"
      },
      "hint": {
        "ar": "اضغط أي منصّة ليفتح لوحها بخطوات الربط وما تحصل عليه بعده.",
        "en": "Tap any platform to open its panel with the connection steps and what you get afterwards."
      },
      "filters": [
        {
          "id": "all",
          "label": {
            "ar": "الكل",
            "en": "All"
          }
        },
        {
          "id": "channel",
          "label": {
            "ar": "قنوات",
            "en": "Channels"
          }
        },
        {
          "id": "store",
          "label": {
            "ar": "متاجر",
            "en": "Stores"
          }
        },
        {
          "id": "mail",
          "label": {
            "ar": "بريد",
            "en": "Email"
          }
        }
      ],
      "types": {
        "channel": {
          "ar": "قناة تواصل",
          "en": "Messaging channel"
        },
        "store": {
          "ar": "متجر إلكتروني",
          "en": "Online store"
        },
        "mail": {
          "ar": "بريد",
          "en": "Email"
        }
      },
      "stepsTitle": {
        "ar": "خطوات الربط",
        "en": "Connection steps"
      },
      "factsTitle": {
        "ar": "ماذا تحصل عليه",
        "en": "What you get"
      },
      "close": {
        "ar": "إغلاق",
        "en": "Close"
      },
      "items": {
        "whatsapp": {
          "name": {
            "ar": "WhatsApp Business",
            "en": "WhatsApp Business"
          },
          "desc": {
            "ar": "القناة الأكثر استخداماً في المنطقة. تصل رسائل العملاء إلى صندوق Qhub ويُردّ عليها منه، وتُرسَل الحملات بقوالب معتمدة.",
            "en": "The most used channel in the region. Customer messages arrive in the Qhub inbox and are answered from it, and campaigns go out on approved templates."
          },
          "steps": {
            "ar": [
              "افتح «الحسابات والربط» من لوحة التحكّم واختر WhatsApp Business.",
              "امسح رمز QR من تطبيق واتساب على جوال الشركة، أو أدخل بيانات Cloud API.",
              "اختر القسم الافتراضي الذي تدخله محادثات هذه القناة.",
              "فعّل المساعد الذكي على القناة إن رغبت، ثم احفظ."
            ],
            "en": [
              "Open “Accounts & channels” in the dashboard and pick WhatsApp Business.",
              "Scan the QR code from WhatsApp on the company phone, or enter Cloud API details.",
              "Choose the default department this channel's conversations land in.",
              "Enable the AI assistant on the channel if you want — then save."
            ]
          },
          "facts": {
            "ar": [
              "أكثر من رقم على الحساب نفسه",
              "قوالب معتمدة للحملات",
              "إرسال واستقبال الصور والصوت والملفات"
            ],
            "en": [
              "Several numbers on one account",
              "Approved campaign templates",
              "Send and receive images, audio and files"
            ]
          }
        },
        "instagram": {
          "name": {
            "ar": "Instagram Direct",
            "en": "Instagram Direct"
          },
          "desc": {
            "ar": "رسائل حساب الأعمال على إنستغرام تُدار مع بقية القنوات، بالإسناد نفسه والتقارير نفسها.",
            "en": "Business-account DMs are managed alongside every other channel, with the same routing and the same reports."
          },
          "steps": {
            "ar": [
              "اربط صفحة فيسبوك المرتبطة بحساب إنستغرام للأعمال.",
              "امنح Qhub صلاحية إدارة الرسائل عبر نافذة Meta.",
              "اختر حساب إنستغرام من القائمة واحفظ الربط."
            ],
            "en": [
              "Connect the Facebook page linked to the Instagram business account.",
              "Grant Qhub message-management permission through the Meta dialog.",
              "Pick the Instagram account from the list and save."
            ]
          },
          "facts": {
            "ar": [
              "ردود على القصص والمنشورات",
              "سجلّ عميل موحّد عبر القنوات",
              "دعم الردود السريعة"
            ],
            "en": [
              "Replies to stories and posts",
              "One customer history across channels",
              "Quick replies supported"
            ]
          }
        },
        "messenger": {
          "name": {
            "ar": "Facebook Messenger",
            "en": "Facebook Messenger"
          },
          "desc": {
            "ar": "رسائل صفحات فيسبوك تصل مباشرة إلى صندوق الوارد الموحّد.",
            "en": "Page messages arrive straight in the shared inbox."
          },
          "steps": {
            "ar": [
              "اضغط «ربط» واختر الصفحة من حسابك على Meta.",
              "وافق على صلاحيات الرسائل.",
              "حدّد القسم وساعات العمل للقناة."
            ],
            "en": [
              "Click “Connect” and pick the page from your Meta account.",
              "Approve the messaging permissions.",
              "Set the department and working hours for the channel."
            ]
          },
          "facts": {
            "ar": [
              "ربط أكثر من صفحة",
              "ردود آلية خارج الدوام",
              "إسناد حسب القسم"
            ],
            "en": [
              "Connect several pages",
              "Automatic after-hours replies",
              "Routing by department"
            ]
          }
        },
        "telegram": {
          "name": {
            "ar": "Telegram",
            "en": "Telegram"
          },
          "desc": {
            "ar": "بوت تيليجرام يستقبل رسائل عملائك ويوصلها إلى الصندوق نفسه.",
            "en": "A Telegram bot receives your customers' messages and delivers them to the same inbox."
          },
          "steps": {
            "ar": [
              "أنشئ بوتاً عبر BotFather واحصل على التوكن.",
              "الصق التوكن في Qhub.",
              "اختر القسم واحفظ."
            ],
            "en": [
              "Create a bot through BotFather and copy the token.",
              "Paste the token into Qhub.",
              "Pick the department and save."
            ]
          },
          "facts": {
            "ar": [
              "ربط بلا حدود للقنوات",
              "دعم الملفات والوسائط",
              "ردود سريعة جاهزة"
            ],
            "en": [
              "Unlimited channel connections",
              "Files and media supported",
              "Ready quick replies"
            ]
          }
        },
        "tiktok": {
          "name": {
            "ar": "TikTok",
            "en": "TikTok"
          },
          "desc": {
            "ar": "الرسائل المباشرة على تيك توك تصل إلى الصندوق مع بقية القنوات.",
            "en": "Direct messages on TikTok arrive in the inbox with every other channel."
          },
          "steps": {
            "ar": [
              "اربط حساب تيك توك عبر نافذة الصلاحيات.",
              "اختر القسم الافتراضي.",
              "احفظ الربط."
            ],
            "en": [
              "Connect the TikTok account through the permissions dialog.",
              "Pick the default department.",
              "Save the connection."
            ]
          },
          "facts": {
            "ar": [
              "رسائل مباشرة موحّدة",
              "سجلّ عميل مشترك",
              "تقارير بالقناة"
            ],
            "en": [
              "Unified direct messages",
              "Shared customer history",
              "Per-channel reporting"
            ]
          }
        },
        "widget": {
          "name": {
            "ar": "نافذة الدردشة المباشرة",
            "en": "Chat widget"
          },
          "desc": {
            "ar": "زرّ محادثة على موقعك بسطر واحد، ورسائله تصل الصندوق نفسه.",
            "en": "A chat button on your site from a single line, with its messages landing in the same inbox."
          },
          "steps": {
            "ar": [
              "انسخ سطر التركيب من إعدادات نافذة الدردشة.",
              "ألصقه قبل إغلاق وسم body في موقعك.",
              "اضبط اللون والترحيب وقواعد الظهور."
            ],
            "en": [
              "Copy the install line from the widget settings.",
              "Paste it before the closing body tag on your site.",
              "Set the colour, greeting and display rules."
            ]
          },
          "facts": {
            "ar": [
              "تخصيص كامل للشكل",
              "ردّ آلي خارج الدوام",
              "يعمل على أي منصّة تقبل HTML"
            ],
            "en": [
              "Fully customisable look",
              "Automatic after-hours reply",
              "Works on any platform that allows HTML"
            ]
          }
        },
        "gmail": {
          "name": {
            "ar": "Gmail",
            "en": "Gmail"
          },
          "desc": {
            "ar": "بريد الدعم على Gmail أو Google Workspace يتحوّل إلى محادثات داخل الصندوق، بالإسناد والحالة نفسها.",
            "en": "Support mail on Gmail or Google Workspace becomes conversations inside the inbox, with the same routing and status."
          },
          "steps": {
            "ar": [
              "افتح «الحسابات والربط» واختر Gmail.",
              "سجّل الدخول بحساب جوجل ووافق على صلاحية القراءة والإرسال.",
              "اختر القسم الذي تدخله رسائل هذا العنوان واحفظ."
            ],
            "en": [
              "Open “Accounts & channels” and pick Gmail.",
              "Sign in with Google and approve read and send access.",
              "Choose the department this address routes to, and save."
            ]
          },
          "facts": {
            "ar": [
              "بلا كلمة مرور — تفويض من جوجل",
              "مرفقات كاملة",
              "الردّ يخرج من عنوانك نفسه"
            ],
            "en": [
              "No password — Google authorisation",
              "Full attachments",
              "Replies leave from your own address"
            ]
          }
        },
        "outlook": {
          "name": {
            "ar": "أوتلوك",
            "en": "Outlook"
          },
          "desc": {
            "ar": "حساب Outlook أو Microsoft 365 يُربط بتفويض واحد، وتصل رسائله محادثاتٍ مرتّبة.",
            "en": "An Outlook or Microsoft 365 account connects with a single authorisation, and its mail arrives as tidy conversations."
          },
          "steps": {
            "ar": [
              "افتح «الحسابات والربط» واختر Outlook.",
              "سجّل الدخول بحساب مايكروسوفت ووافق على الصلاحيات.",
              "اختر القسم واحفظ."
            ],
            "en": [
              "Open “Accounts & channels” and pick Outlook.",
              "Sign in with Microsoft and approve the permissions.",
              "Choose the department and save."
            ]
          },
          "facts": {
            "ar": [
              "يدعم Microsoft 365",
              "مزامنة المجلّدات",
              "قوالب ردود محفوظة"
            ],
            "en": [
              "Microsoft 365 supported",
              "Folder sync",
              "Saved reply templates"
            ]
          }
        },
        "smtp": {
          "name": {
            "ar": "SMTP",
            "en": "SMTP"
          },
          "desc": {
            "ar": "أي مزوّد بريد آخر: تدخل بيانات خادمه فيُستقبَل البريد ويُرسَل منه.",
            "en": "Any other mail provider — enter its server details and mail is received and sent through it."
          },
          "steps": {
            "ar": [
              "جهّز بيانات خادمي SMTP وIMAP من مزوّدك.",
              "أدخل المضيف والمنفذ واسم المستخدم وكلمة المرور في Qhub.",
              "أرسل رسالة اختبار، ثم اختر القسم واحفظ."
            ],
            "en": [
              "Get the SMTP and IMAP server details from your provider.",
              "Enter host, port, username and password in Qhub.",
              "Send a test message, then choose the department and save."
            ]
          },
          "facts": {
            "ar": [
              "يعمل مع أي مزوّد",
              "تشفير TLS",
              "اختبار الاتصال قبل الحفظ"
            ],
            "en": [
              "Works with any provider",
              "TLS encryption",
              "Connection tested before saving"
            ]
          }
        },
        "salla": {
          "name": {
            "ar": "سلة",
            "en": "Salla"
          },
          "desc": {
            "ar": "بيانات الطلبات والعملاء من متجرك على سلة تظهر بجانب المحادثة مباشرة.",
            "en": "Order and customer data from your Salla store appears right beside the conversation."
          },
          "steps": {
            "ar": [
              "ثبّت تطبيق Qhub من متجر تطبيقات سلة.",
              "وافق على صلاحيات القراءة.",
              "اختر المتجر واحفظ."
            ],
            "en": [
              "Install the Qhub app from the Salla app store.",
              "Approve the read permissions.",
              "Pick the store and save."
            ]
          },
          "facts": {
            "ar": [
              "الطلب وحالته داخل المحادثة",
              "مطابقة العميل برقمه",
              "ردود آلية بحالة الشحن"
            ],
            "en": [
              "Order and status inside the chat",
              "Customer matched by number",
              "Automatic shipping-status replies"
            ]
          }
        },
        "zid": {
          "name": {
            "ar": "زد",
            "en": "Zid"
          },
          "desc": {
            "ar": "ربط مباشر مع متجر زد لعرض الطلبات والسلّات داخل المحادثة.",
            "en": "A direct connection to your Zid store showing orders and carts inside the conversation."
          },
          "steps": {
            "ar": [
              "ثبّت تطبيق Qhub من سوق تطبيقات زد.",
              "وافق على الصلاحيات.",
              "اختر المتجر واحفظ."
            ],
            "en": [
              "Install the Qhub app from the Zid marketplace.",
              "Approve the permissions.",
              "Pick the store and save."
            ]
          },
          "facts": {
            "ar": [
              "صلاحية قراءة فقط",
              "بيانات الطلب لحظية",
              "متابعة السلّات المتروكة"
            ],
            "en": [
              "Read-only access",
              "Live order data",
              "Abandoned-cart follow-up"
            ]
          }
        },
        "shopify": {
          "name": {
            "ar": "Shopify",
            "en": "Shopify"
          },
          "desc": {
            "ar": "متجر Shopify يتصل بـ Qhub فتظهر الطلبات والشحن جنب كل محادثة.",
            "en": "A Shopify store connects to Qhub so orders and shipping show next to every conversation."
          },
          "steps": {
            "ar": [
              "ثبّت تطبيق Qhub من Shopify App Store.",
              "وافق على الصلاحيات.",
              "اختر المتجر واحفظ."
            ],
            "en": [
              "Install the Qhub app from the Shopify App Store.",
              "Approve the permissions.",
              "Pick the store and save."
            ]
          },
          "facts": {
            "ar": [
              "طلبات وشحن داخل المحادثة",
              "مطابقة تلقائية للعميل",
              "بيئة تجريبية قبل التفعيل"
            ],
            "en": [
              "Orders and shipping in the chat",
              "Automatic customer matching",
              "Sandbox before going live"
            ]
          }
        },
        "woo": {
          "name": {
            "ar": "WooCommerce",
            "en": "WooCommerce"
          },
          "desc": {
            "ar": "إضافة ووردبريس تربط متجر WooCommerce بصندوق Qhub.",
            "en": "A WordPress plugin connects your WooCommerce store to the Qhub inbox."
          },
          "steps": {
            "ar": [
              "نزّل إضافة Qhub لووردبريس.",
              "الصق مفتاح الـAPI من لوحتك.",
              "اختر الأحداث التي تريد إشعاراً عنها."
            ],
            "en": [
              "Download the Qhub plugin for WordPress.",
              "Paste the API key from your dashboard.",
              "Choose the events you want notifications for."
            ]
          },
          "facts": {
            "ar": [
              "إشعارات بالطلبات الجديدة",
              "بيانات العميل داخل المحادثة",
              "تحكّم كامل بالأحداث"
            ],
            "en": [
              "New-order notifications",
              "Customer data inside the chat",
              "Full control over events"
            ]
          }
        }
      }
    }
  }
};
