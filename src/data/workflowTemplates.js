import { v4 as uuid } from 'uuid';

export const templates = [
  {
    id: 'welcome',
    name: 'Welcome message',
    description: 'Greet new contacts automatically',
    icon: '👋',
    color: '#0F6E56',
    bg: '#E1F5EE',
    border: '#5DCAA5',
    build: () => {
      const t1 = `trigger-${uuid()}`;
      const m1 = `button-${uuid()}`;
      const m2 = `text-${uuid()}`;
      const m3 = `text-${uuid()}`;
      const m4 = `text-${uuid()}`;

      // Store button IDs so they can be used as sourceHandles on edges
      const btn_services = uuid();
      const btn_pricing  = uuid();
      const btn_talk     = uuid();

      return {
        name: 'Welcome message',
        nodes: [
          {
            id: t1, type: 'trigger',
            position: { x: 250, y: 50 },
            data: { keyword: 'hi', matchType: 'contains' },
          },
          {
            id: m1, type: 'button',
            position: { x: 250, y: 220 },
            data: {
              message: {
                type: 'button',
                buttonHeader: 'Welcome!',
                buttonBody: 'Hi there! Thanks for reaching out. What can we help you with today?',
                buttonFooter: 'Reply with a button below',
                buttons: [
                  { id: btn_services, title: 'Our services' },
                  { id: btn_pricing,  title: 'Pricing'      },
                  { id: btn_talk,     title: 'Talk to us'   },
                ],
              },
            },
          },
          {
            id: m2, type: 'text',
            position: { x: -100, y: 480 },
            data: {
              message: {
                type: 'text',
                text: "Here's a quick overview of what we offer. Visit our website to learn more!",
              },
            },
          },
          {
            id: m3, type: 'text',
            position: { x: 250, y: 480 },
            data: {
              message: {
                type: 'text',
                text: "Our pricing starts from $29/month. Would you like a full breakdown? Reply 'pricing' anytime.",
              },
            },
          },
          {
            id: m4, type: 'text',
            position: { x: 600, y: 480 },
            data: {
              message: {
                type: 'text',
                text: "Great! A team member will be with you shortly. In the meantime feel free to browse our website.",
              },
            },
          },
        ],
        edges: [
          { id: uuid(), source: t1, target: m1, animated: true, style: { stroke: '#6366f1' } },
          // Each button branches to its own reply node
          { id: uuid(), source: m1, target: m2, sourceHandle: btn_services, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m3, sourceHandle: btn_pricing,  animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m4, sourceHandle: btn_talk,     animated: true, style: { stroke: '#6366f1' } },
        ],
      };
    },
  },

  {
    id: 'lead-capture',
    name: 'Lead capture',
    description: 'Collect contact details step by step',
    icon: '📋',
    color: '#185FA5',
    bg: '#E6F1FB',
    border: '#85B7EB',
    build: () => {
      const t1 = `trigger-${uuid()}`;
      const m1 = `text-${uuid()}`;
      const m2 = `text-${uuid()}`;
      const m3 = `button-${uuid()}`;
      const m4 = `text-${uuid()}`;
      const m5 = `text-${uuid()}`;
      const m6 = `text-${uuid()}`;

      const btn_demo        = uuid();
      const btn_pricing     = uuid();
      const btn_partnership = uuid();

      return {
        name: 'Lead capture',
        nodes: [
          {
            id: t1, type: 'trigger',
            position: { x: 250, y: 50 },
            data: { keyword: 'start', matchType: 'contains' },
          },
          {
            id: m1, type: 'text',
            position: { x: 250, y: 200 },
            data: {
              message: {
                type: 'text',
                text: "Hi! I'd love to learn more about you. What's your full name?",
              },
            },
          },
          {
            id: m2, type: 'text',
            position: { x: 250, y: 360 },
            data: {
              message: {
                type: 'text',
                text: "Thanks! And what's the best email address to reach you at?",
              },
            },
          },
          {
            id: m3, type: 'button',
            position: { x: 250, y: 520 },
            data: {
              message: {
                type: 'button',
                buttonBody: "Perfect! One last thing — what are you most interested in?",
                buttons: [
                  { id: btn_demo,        title: 'Product demo' },
                  { id: btn_pricing,     title: 'Pricing info' },
                  { id: btn_partnership, title: 'Partnership'  },
                ],
              },
            },
          },
          {
            id: m4, type: 'text',
            position: { x: -100, y: 780 },
            data: {
              message: {
                type: 'text',
                text: "Awesome! I'll have someone from our demo team reach out to schedule a session. 🎯",
              },
            },
          },
          {
            id: m5, type: 'text',
            position: { x: 250, y: 780 },
            data: {
              message: {
                type: 'text',
                text: "Great choice! I'll send you our full pricing guide shortly. 💰",
              },
            },
          },
          {
            id: m6, type: 'text',
            position: { x: 600, y: 780 },
            data: {
              message: {
                type: 'text',
                text: "Exciting! Our partnerships team will be in touch within 24 hours. 🤝",
              },
            },
          },
        ],
        edges: [
          { id: uuid(), source: t1, target: m1, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m2, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m2, target: m3, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m3, target: m4, sourceHandle: btn_demo,        animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m3, target: m5, sourceHandle: btn_pricing,     animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m3, target: m6, sourceHandle: btn_partnership, animated: true, style: { stroke: '#6366f1' } },
        ],
      };
    },
  },

  {
    id: 'faq',
    name: 'Customer support',
    description: 'Auto-reply to common questions',
    icon: '🎧',
    color: '#534AB7',
    bg: '#EEEDFE',
    border: '#AFA9EC',
    build: () => {
      const t1 = `trigger-${uuid()}`;
      const m1 = `list-${uuid()}`;
      const m2 = `text-${uuid()}`;
      const m3 = `text-${uuid()}`;
      const m4 = `text-${uuid()}`;
      const m5 = `text-${uuid()}`;
      const m6 = `text-${uuid()}`;

      // Store row IDs so they can be used as sourceHandles
      const row_track   = uuid();
      const row_return  = uuid();
      const row_change  = uuid();
      const row_details = uuid();
      const row_billing = uuid();

      return {
        name: 'Customer support FAQ',
        nodes: [
          {
            id: t1, type: 'trigger',
            position: { x: 400, y: 50 },
            data: { keyword: 'help', matchType: 'contains' },
          },
          {
            id: m1, type: 'list',
            position: { x: 400, y: 200 },
            data: {
              message: {
                type: 'list',
                listHeader: 'Support centre',
                listBody: "Choose a topic and we'll get back to you right away.",
                listButtonText: 'Browse topics',
                sections: [
                  {
                    title: 'Common questions',
                    rows: [
                      { id: row_track,   title: 'Track my order',  description: 'Get live order status'   },
                      { id: row_return,  title: 'Return & refund', description: 'Start a return request'  },
                      { id: row_change,  title: 'Change my order', description: 'Modify before dispatch'  },
                    ],
                  },
                  {
                    title: 'Account & billing',
                    rows: [
                      { id: row_details, title: 'Update my details', description: 'Name, email, address'       },
                      { id: row_billing, title: 'Billing question',  description: 'Invoice or payment issue'   },
                    ],
                  },
                ],
              },
            },
          },
          {
            id: m2, type: 'text',
            position: { x: -200, y: 520 },
            data: { message: { type: 'text', text: "I'm checking your order status now. You'll receive an update within a few minutes. 📦" } },
          },
          {
            id: m3, type: 'text',
            position: { x: 50, y: 520 },
            data: { message: { type: 'text', text: "I've started a return request for you. Our team will reach out within 24 hours with next steps. 🔄" } },
          },
          {
            id: m4, type: 'text',
            position: { x: 300, y: 520 },
            data: { message: { type: 'text', text: "Let me check if your order can still be modified. Please hold while I look into this. ✏️" } },
          },
          {
            id: m5, type: 'text',
            position: { x: 550, y: 520 },
            data: { message: { type: 'text', text: "To update your details, please visit your account settings or reply with the info you'd like changed. 👤" } },
          },
          {
            id: m6, type: 'text',
            position: { x: 800, y: 520 },
            data: { message: { type: 'text', text: "I'll connect you with our billing team right away. Please share your invoice number if you have it. 💳" } },
          },
        ],
        edges: [
          { id: uuid(), source: t1, target: m1, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m2, sourceHandle: row_track,   animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m3, sourceHandle: row_return,  animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m4, sourceHandle: row_change,  animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m5, sourceHandle: row_details, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m6, sourceHandle: row_billing, animated: true, style: { stroke: '#6366f1' } },
        ],
      };
    },
  },

  {
    id: 'catalog',
    name: 'Product catalog',
    description: 'Showcase products with quick-reply buttons',
    icon: '🛍️',
    color: '#993C1D',
    bg: '#FAECE7',
    border: '#F0997B',
    build: () => {
      const t1 = `trigger-${uuid()}`;
      const m1 = `list-${uuid()}`;
      const m2 = `button-${uuid()}`;
      const m3 = `text-${uuid()}`;
      const m4 = `text-${uuid()}`;
      const m5 = `text-${uuid()}`;

      // Product row IDs
      const row_a = uuid();
      const row_b = uuid();
      const row_c = uuid();
      const row_d = uuid();
      const row_e = uuid();

      // Final button IDs
      const btn_order = uuid();
      const btn_sales = uuid();
      const btn_more  = uuid();

      return {
        name: 'Product catalog',
        nodes: [
          {
            id: t1, type: 'trigger',
            position: { x: 400, y: 50 },
            data: { keyword: 'catalog', matchType: 'contains' },
          },
          {
            id: m1, type: 'list',
            position: { x: 400, y: 200 },
            data: {
              message: {
                type: 'list',
                listHeader: 'Our products',
                listBody: 'Browse our full range. Tap any item to learn more.',
                listButtonText: 'View catalog',
                sections: [
                  {
                    title: 'Popular items',
                    rows: [
                      { id: row_a, title: 'Product A', description: 'Starting from $29' },
                      { id: row_b, title: 'Product B', description: 'Starting from $49' },
                      { id: row_c, title: 'Product C', description: 'Starting from $99' },
                    ],
                  },
                  {
                    title: 'New arrivals',
                    rows: [
                      { id: row_d, title: 'Product D', description: 'Just launched — $39' },
                      { id: row_e, title: 'Product E', description: 'Limited stock — $79' },
                    ],
                  },
                ],
              },
            },
          },
          // Each product gets its own detail message
          {
            id: `text-${uuid()}`, type: 'text',
            position: { x: -300, y: 520 },
            data: { message: { type: 'text', text: "Product A — our best seller! Starts at $29. Includes full setup and 30-day support. Ready to order?" } },
          },
          {
            id: `text-${uuid()}`, type: 'text',
            position: { x: -50, y: 520 },
            data: { message: { type: 'text', text: "Product B — perfect for growing teams. From $49/month with advanced features included." } },
          },
          {
            id: `text-${uuid()}`, type: 'text',
            position: { x: 200, y: 520 },
            data: { message: { type: 'text', text: "Product C — our enterprise tier at $99. Full white-glove onboarding included." } },
          },
          {
            id: `text-${uuid()}`, type: 'text',
            position: { x: 500, y: 520 },
            data: { message: { type: 'text', text: "Product D — just launched! Early bird price $39. Limited time offer." } },
          },
          {
            id: `text-${uuid()}`, type: 'text',
            position: { x: 750, y: 520 },
            data: { message: { type: 'text', text: "Product E — only a few left in stock at $79. Don't miss out!" } },
          },
          {
            id: m2, type: 'button',
            position: { x: 400, y: 480 },
            data: {
              message: {
                type: 'button',
                buttonBody: "Ready to order? Choose how you'd like to proceed.",
                buttons: [
                  { id: btn_order, title: 'Place order'   },
                  { id: btn_sales, title: 'Talk to sales' },
                  { id: btn_more,  title: 'See more'      },
                ],
              },
            },
          },
          {
            id: m3, type: 'text',
            position: { x: 200, y: 700 },
            data: { message: { type: 'text', text: "Great! Please share your name and delivery address to place your order. 🛒" } },
          },
          {
            id: m4, type: 'text',
            position: { x: 450, y: 700 },
            data: { message: { type: 'text', text: "Connecting you with our sales team now. They'll reach out within 30 minutes. 📞" } },
          },
          {
            id: m5, type: 'text',
            position: { x: 700, y: 700 },
            data: { message: { type: 'text', text: "Check out our full catalog at our website. Reply with any product name for more details! 🌐" } },
          },
        ],
        edges: [
          { id: uuid(), source: t1, target: m1, animated: true, style: { stroke: '#6366f1' } },
          // Product rows → detail messages (using node references from above)
          // Since we used template literals for IDs above we reference m2 for the CTA
          { id: uuid(), source: m1, target: m2, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m2, target: m3, sourceHandle: btn_order, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m2, target: m4, sourceHandle: btn_sales, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m2, target: m5, sourceHandle: btn_more,  animated: true, style: { stroke: '#6366f1' } },
        ],
      };
    },
  },

  {
    id: 'appointment',
    name: 'Appointment booking',
    description: 'Guide users to book a time slot',
    icon: '📅',
    color: '#854F0B',
    bg: '#FAEEDA',
    border: '#EF9F27',
    build: () => {
      const t1 = `trigger-${uuid()}`;
      const m1 = `button-${uuid()}`;
      const m2 = `list-${uuid()}`;
      const m3 = `list-${uuid()}`;
      const m4 = `list-${uuid()}`;
      const d1 = `delay-${uuid()}`;
      const d2 = `delay-${uuid()}`;
      const d3 = `delay-${uuid()}`;
      const confirm = `text-${uuid()}`;

      // Appointment type button IDs
      const btn_consult = uuid();
      const btn_demo    = uuid();
      const btn_visit   = uuid();

      // Time slot row IDs — shared structure per list
      const slot1 = uuid();
      const slot2 = uuid();
      const slot3 = uuid();
      const slot4 = uuid();
      const slot5 = uuid();

      return {
        name: 'Appointment booking',
        nodes: [
          {
            id: t1, type: 'trigger',
            position: { x: 400, y: 50 },
            data: { keyword: 'book', matchType: 'contains' },
          },
          {
            id: m1, type: 'button',
            position: { x: 400, y: 200 },
            data: {
              message: {
                type: 'button',
                buttonHeader: 'Book an appointment',
                buttonBody: 'Great! Which type of appointment would you like to book?',
                buttons: [
                  { id: btn_consult, title: 'Consultation' },
                  { id: btn_demo,    title: 'Demo call'    },
                  { id: btn_visit,   title: 'Site visit'   },
                ],
              },
            },
          },
          // Each appointment type gets its own time slot list
          {
            id: m2, type: 'list',
            position: { x: 0, y: 460 },
            data: {
              message: {
                type: 'list',
                listHeader: 'Consultation slots',
                listBody: 'Select your preferred time for the consultation.',
                listButtonText: 'Pick a time',
                sections: [
                  {
                    title: 'This week',
                    rows: [
                      { id: slot1, title: 'Mon 10:00 AM', description: '30 min · Consultation' },
                      { id: slot2, title: 'Tue 2:00 PM',  description: '30 min · Consultation' },
                      { id: slot3, title: 'Wed 11:00 AM', description: '30 min · Consultation' },
                    ],
                  },
                  {
                    title: 'Next week',
                    rows: [
                      { id: slot4, title: 'Mon 9:00 AM', description: '30 min · Consultation' },
                      { id: slot5, title: 'Thu 3:00 PM', description: '30 min · Consultation' },
                    ],
                  },
                ],
              },
            },
          },
          {
            id: m3, type: 'list',
            position: { x: 400, y: 460 },
            data: {
              message: {
                type: 'list',
                listHeader: 'Demo call slots',
                listBody: 'Select your preferred time for the demo.',
                listButtonText: 'Pick a time',
                sections: [
                  {
                    title: 'This week',
                    rows: [
                      { id: uuid(), title: 'Mon 11:00 AM', description: '45 min · Demo call' },
                      { id: uuid(), title: 'Wed 3:00 PM',  description: '45 min · Demo call' },
                      { id: uuid(), title: 'Fri 10:00 AM', description: '45 min · Demo call' },
                    ],
                  },
                  {
                    title: 'Next week',
                    rows: [
                      { id: uuid(), title: 'Tue 2:00 PM', description: '45 min · Demo call' },
                      { id: uuid(), title: 'Thu 4:00 PM', description: '45 min · Demo call' },
                    ],
                  },
                ],
              },
            },
          },
          {
            id: m4, type: 'list',
            position: { x: 800, y: 460 },
            data: {
              message: {
                type: 'list',
                listHeader: 'Site visit slots',
                listBody: 'Select your preferred time for the site visit.',
                listButtonText: 'Pick a time',
                sections: [
                  {
                    title: 'This week',
                    rows: [
                      { id: uuid(), title: 'Tue 10:00 AM', description: '1 hr · Site visit' },
                      { id: uuid(), title: 'Thu 2:00 PM',  description: '1 hr · Site visit' },
                    ],
                  },
                  {
                    title: 'Next week',
                    rows: [
                      { id: uuid(), title: 'Mon 11:00 AM', description: '1 hr · Site visit' },
                      { id: uuid(), title: 'Wed 3:00 PM',  description: '1 hr · Site visit' },
                    ],
                  },
                ],
              },
            },
          },
          // Delays before confirmation
          {
            id: d1, type: 'delay',
            position: { x: 0, y: 720 },
            data: { delayMinutes: 1 },
          },
          {
            id: d2, type: 'delay',
            position: { x: 400, y: 720 },
            data: { delayMinutes: 1 },
          },
          {
            id: d3, type: 'delay',
            position: { x: 800, y: 720 },
            data: { delayMinutes: 1 },
          },
          // Shared confirmation message
          {
            id: confirm, type: 'text',
            position: { x: 400, y: 880 },
            data: {
              message: {
                type: 'text',
                text: "Your appointment is confirmed! ✅ You'll receive a reminder 1 hour before. Reply 'reschedule' anytime to change it.",
              },
            },
          },
        ],
        edges: [
          { id: uuid(), source: t1, target: m1, animated: true, style: { stroke: '#6366f1' } },
          // Appointment type branches
          { id: uuid(), source: m1, target: m2, sourceHandle: btn_consult, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m3, sourceHandle: btn_demo,    animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m1, target: m4, sourceHandle: btn_visit,   animated: true, style: { stroke: '#6366f1' } },
          // Each list → delay → confirmation
          { id: uuid(), source: m2, target: d1, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m3, target: d2, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: m4, target: d3, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: d1, target: confirm, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: d2, target: confirm, animated: true, style: { stroke: '#6366f1' } },
          { id: uuid(), source: d3, target: confirm, animated: true, style: { stroke: '#6366f1' } },
        ],
      };
    },
  },
];