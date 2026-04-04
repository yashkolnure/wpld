import { v4 as uuid } from 'uuid';

export const templates = [
  {
  id: 'welcome_pro',
  name: 'Welcome message',
  description: 'A sophisticated greeting with delays and multi-step branching.',
  icon: '👋',
  color: '#0F6E56',
  bg: '#E1F5EE',
  border: '#5DCAA5',
  build: () => {
    // 1. Generate Unique Node IDs
    const triggerId = `trigger-${uuid()}`;
    const delayId = `delay-${uuid()}`;
    const welcomeMsgId = `button-${uuid()}`;
    
    // Branch 1: Services
    const svcTextId = `text-${uuid()}`;
    const svcListId = `list-${uuid()}`;
    
    // Branch 2: Pricing
    const prcTextId = `text-${uuid()}`;
    const prcMediaId = `media-${uuid()}`;
    
    // Branch 3: Talk to us
    const talkTextId = `text-${uuid()}`;
    const talkEndId = `text-${uuid()}`;

    // 2. Define Unique Button/Handle IDs
    const btn_services = uuid();
    const btn_pricing = uuid();
    const btn_talk = uuid();

    return {
      name: 'Welcome message',
      nodes: [
        // --- START ---
        {
          id: triggerId, type: 'trigger',
          position: { x: 400, y: 0 },
          data: { keyword: 'hi, hello, start, hey', matchType: 'contains' },
        },
        // Humanizing Delay
        {
          id: delayId, type: 'delay',
          position: { x: 400, y: 150 },
          data: { delayMinutes: 0.1 }, // 6 second delay
        },
        // Main Menu
        {
          id: welcomeMsgId, type: 'button',
          position: { x: 400, y: 300 },
          data: {
            message: {
              type: 'button',
              buttonHeader: 'Welcome!',
              buttonBody: 'Hi there! I am your automated assistant. What can we help you with today?',
              buttonFooter: 'Choose an option below:',
              buttons: [
                { id: btn_services, title: 'Our services' },
                { id: btn_pricing,  title: 'Pricing info' },
                { id: btn_talk,     title: 'Talk to us' },
              ],
            },
          },
        },

        // --- BRANCH 1: SERVICES ---
        {
          id: svcTextId, type: 'text',
          position: { x: 50, y: 550 },
          data: { message: { type: 'text', text: "We offer a wide range of solutions tailored to your business." } },
        },
        {
          id: svcListId, type: 'list',
          position: { x: 50, y: 700 },
          data: {
            message: {
              type: 'list',
              listHeader: 'Our Services',
              listBody: 'Select a category to see more details.',
              listButtonText: 'View Services',
              sections: [
                {
                  title: 'Core Services',
                  rows: [
                    { id: uuid(), title: 'Web Development', description: 'Custom apps and sites' },
                    { id: uuid(), title: 'AI Integration', description: 'Chatbots and automation' },
                  ]
                }
              ]
            }
          }
        },

        // --- BRANCH 2: PRICING ---
        {
          id: prcTextId, type: 'text',
          position: { x: 400, y: 550 },
          data: { message: { type: 'text', text: "Our plans are flexible. Here is a quick look at our standard pricing tiers:" } },
        },
        {
          id: prcMediaId, type: 'media',
          position: { x: 400, y: 700 },
          data: {
            message: {
              type: 'media',
              mediaType: 'image',
              mediaUrl: 'https://placehold.co/600x400/png?text=Pricing+Chart', // Placeholder
              mediaCaption: 'Standard Pricing Tiers 2024'
            }
          }
        },

        // --- BRANCH 3: TALK TO US ---
        {
          id: talkTextId, type: 'text',
          position: { x: 750, y: 550 },
          data: { message: { type: 'text', text: "I'll notify our team right away. While you wait, could you tell us your name?" } },
        },
        {
          id: talkEndId, type: 'text',
          position: { x: 750, y: 700 },
          data: { message: { type: 'text', text: "Thanks! Someone will be with you shortly. 🕒" } },
        },
      ],
      edges: [
        // Entry Path
        { id: uuid(), source: triggerId, target: delayId, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: delayId, target: welcomeMsgId, animated: true, style: { stroke: '#6366f1' } },

        // Branching Paths (Using Button IDs as sourceHandles)
        { 
          id: uuid(), source: welcomeMsgId, target: svcTextId, 
          sourceHandle: btn_services, animated: true, style: { stroke: '#6366f1' } 
        },
        { id: uuid(), source: svcTextId, target: svcListId, animated: true, style: { stroke: '#6366f1' } },

        { 
          id: uuid(), source: welcomeMsgId, target: prcTextId, 
          sourceHandle: btn_pricing, animated: true, style: { stroke: '#6366f1' } 
        },
        { id: uuid(), source: prcTextId, target: prcMediaId, animated: true, style: { stroke: '#6366f1' } },

        { 
          id: uuid(), source: welcomeMsgId, target: talkTextId, 
          sourceHandle: btn_talk, animated: true, style: { stroke: '#6366f1' } 
        },
        { id: uuid(), source: talkTextId, target: talkEndId, animated: true, style: { stroke: '#6366f1' } },
      ],
    };
  },
},

  {
  id: 'lead-capture-pro',
  name: 'Lead capture',
  description: 'A multi-step conversational flow to collect names, emails, and interests.',
  icon: '📋',
  color: '#185FA5',
  bg: '#E6F1FB',
  border: '#85B7EB',
  build: () => {
    // 1. Generate Unique Node IDs
    const t1 = `trigger-${uuid()}`;
    const d1 = `delay-${uuid()}`;
    const m_welcome = `media-${uuid()}`; // Welcome Image
    const m_name = `text-${uuid()}`;    // Ask Name
    const d2 = `delay-${uuid()}`;
    const m_email = `text-${uuid()}`;   // Ask Email
    const d3 = `delay-${uuid()}`;
    const m_interest = `button-${uuid()}`; // Ask Interest (Branch)
    
    const m_demo = `text-${uuid()}`;
    const m_price = `text-${uuid()}`;
    const m_partner = `text-${uuid()}`;

    // 2. Define Unique Button IDs
    const btn_demo = uuid();
    const btn_pricing = uuid();
    const btn_partnership = uuid();

    return {
      name: 'Lead capture',
      nodes: [
        {
          id: t1, type: 'trigger',
          position: { x: 250, y: 0 },
          data: { keyword: 'start, register, join, hi', matchType: 'contains' },
        },
        // Delay before the welcome image
        {
          id: d1, type: 'delay',
          position: { x: 250, y: 150 },
          data: { delayMinutes: 0.05 }, // 3s
        },
        // Brand/Welcome Media
        {
          id: m_welcome, type: 'media',
          position: { x: 250, y: 300 },
          data: {
            message: {
              type: 'media',
              mediaType: 'image',
              mediaUrl: 'https://placehold.co/800x400/png?text=Welcome+to+Our+Brand',
              mediaCaption: "Hi! We're excited to have you here. Let's get started! 🚀"
            }
          }
        },
        // Question 1: Name
        {
          id: m_name, type: 'text',
          position: { x: 250, y: 550 },
          data: {
            message: {
              type: 'text',
              text: "First things first, what is your full name?",
            },
          },
        },
        {
          id: d2, type: 'delay',
          position: { x: 250, y: 700 },
          data: { delayMinutes: 0.1 }, // 6s
        },
        // Question 2: Email
        {
          id: m_email, type: 'text',
          position: { x: 250, y: 850 },
          data: {
            message: {
              type: 'text',
              text: "Nice to meet you! And what's your best email address? (We'll send your access details there).",
            },
          },
        },
        {
          id: d3, type: 'delay',
          position: { x: 250, y: 1000 },
          data: { delayMinutes: 0.1 }, 
        },
        // Question 3: Interest (The Branch)
        {
          id: m_interest, type: 'button',
          position: { x: 250, y: 1150 },
          data: {
            message: {
              type: 'button',
              buttonHeader: 'One last step!',
              buttonBody: "Thanks! What are you most interested in exploring today?",
              buttonFooter: "Choose one:",
              buttons: [
                { id: btn_demo,        title: 'Product demo' },
                { id: btn_pricing,     title: 'Pricing info' },
                { id: btn_partnership, title: 'Partnership'  },
              ],
            },
          },
        },
        // Outcome Nodes
        {
          id: m_demo, type: 'text',
          position: { x: -150, y: 1450 },
          data: { message: { type: 'text', text: "Great choice! 🎯 I've notified the team. Expect a demo link in your email shortly." } },
        },
        {
          id: m_price, type: 'text',
          position: { x: 250, y: 1450 },
          data: { message: { type: 'text', text: "I've sent our 2024 Pricing PDF to your email. Check your inbox! 💰" } },
        },
        {
          id: m_partner, type: 'text',
          position: { x: 650, y: 1450 },
          data: { message: { type: 'text', text: "We love new partners! 🤝 Our manager will reach out personally within 24 hours." } },
        },
      ],
      edges: [
        { id: uuid(), source: t1, target: d1, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: d1, target: m_welcome, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: m_welcome, target: m_name, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: m_name, target: d2, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: d2, target: m_email, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: m_email, target: d3, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: d3, target: m_interest, animated: true, style: { stroke: '#6366f1' } },
        
        // Branching logic using sourceHandle
        { id: uuid(), source: m_interest, target: m_demo, sourceHandle: btn_demo, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: m_interest, target: m_price, sourceHandle: btn_pricing, animated: true, style: { stroke: '#6366f1' } },
        { id: uuid(), source: m_interest, target: m_partner, sourceHandle: btn_partnership, animated: true, style: { stroke: '#6366f1' } },
      ],
    };
  },
},
 {
  id: 'faq-pro',
  name: 'Customer support',
  description: 'A comprehensive FAQ list that simulates real-time data lookups using delays.',
  icon: '🎧',
  color: '#534AB7',
  bg: '#EEEDFE',
  border: '#AFA9EC',
  build: () => {
    // 1. Generate Unique Node IDs
    const t1 = `trigger-${uuid()}`;
    const d_initial = `delay-${uuid()}`;
    const m_list = `list-${uuid()}`;
    
    // Response nodes
    const m_track = `text-${uuid()}`;
    const m_return = `text-${uuid()}`;
    const m_change = `text-${uuid()}`;
    const m_details = `text-${uuid()}`;
    const m_billing = `text-${uuid()}`;
    
    // Processing delays (to simulate "checking systems")
    const d_lookup = `delay-${uuid()}`;
    const d_billing_lookup = `delay-${uuid()}`;

    // 2. Define Unique Row IDs for the List
    const row_track   = uuid();
    const row_return  = uuid();
    const row_change  = uuid();
    const row_details = uuid();
    const row_billing = uuid();

    return {
      name: 'Customer support',
      nodes: [
        {
          id: t1, type: 'trigger',
          position: { x: 400, y: 0 },
          data: { keyword: 'help, support, problem, assistant', matchType: 'contains' },
        },
        // Initial delay before showing the menu
        {
          id: d_initial, type: 'delay',
          position: { x: 400, y: 150 },
          data: { delayMinutes: 0.05 }, // 3s
        },
        // The Main FAQ List
        {
          id: m_list, type: 'list',
          position: { x: 400, y: 300 },
          data: {
            message: {
              type: 'list',
              listHeader: 'Support Center',
              listBody: "Hi! I'm your digital assistant. How can I help you today?",
              listButtonText: 'Select a Topic',
              sections: [
                {
                  title: 'Orders & Shipping',
                  rows: [
                    { id: row_track,   title: 'Track my order',  description: 'Live status of your package' },
                    { id: row_return,  title: 'Return & refund', description: 'Start a return request' },
                    { id: row_change,  title: 'Change order',   description: 'Modify items or address' },
                  ],
                },
                {
                  title: 'Account & Billing',
                  rows: [
                    { id: row_details, title: 'Update profile',  description: 'Email, phone, or address' },
                    { id: row_billing, title: 'Billing issue',  description: 'Invoice or payment help' },
                  ],
                },
              ],
            },
          },
        },
        // Intermediate "Lookup" Delay for Order Tracking
        {
          id: d_lookup, type: 'delay',
          position: { x: -100, y: 550 },
          data: { delayMinutes: 0.15 }, // 9s (Simulates checking a shipping API)
        },
        {
          id: m_track, type: 'text',
          position: { x: -100, y: 700 },
          data: { message: { type: 'text', text: "🔍 I've checked our system. Your order is currently with the courier and is expected to arrive within 2 business days." } },
        },
        {
          id: m_return, type: 'text',
          position: { x: 150, y: 550 },
          data: { message: { type: 'text', text: "🔄 No problem. To start a return, please ensure you have your order # ready. Our team will message you here within 1 hour with the shipping label." } },
        },
        {
          id: m_change, type: 'text',
          position: { x: 400, y: 550 },
          data: { message: { type: 'text', text: "✏️ I've notified the warehouse to hold your order. Please type the changes you'd like to make below." } },
        },
        {
          id: m_details, type: 'text',
          position: { x: 650, y: 550 },
          data: { message: { type: 'text', text: "👤 You can update your profile directly in our app, or stay on the line and I can assist you manually. What needs changing?" } },
        },
        // Billing Lookup Delay
        {
          id: d_billing_lookup, type: 'delay',
          position: { x: 900, y: 550 },
          data: { delayMinutes: 0.1 }, // 6s
        },
        {
          id: m_billing, type: 'text',
          position: { x: 900, y: 700 },
          data: { message: { type: 'text', text: "💳 I'm connecting you with our billing specialist. Please share your invoice number while I pull up your account records." } },
        },
      ],
      edges: [
        { id: uuid(), source: t1, target: d_initial, animated: true },
        { id: uuid(), source: d_initial, target: m_list, animated: true },
        
        // Branching from List Rows
        { id: uuid(), source: m_list, target: d_lookup, sourceHandle: row_track, animated: true },
        { id: uuid(), source: d_lookup, target: m_track, animated: true },
        
        { id: uuid(), source: m_list, target: m_return, sourceHandle: row_return, animated: true },
        { id: uuid(), source: m_list, target: m_change, sourceHandle: row_change, animated: true },
        { id: uuid(), source: m_list, target: m_details, sourceHandle: row_details, animated: true },
        
        { id: uuid(), source: m_list, target: d_billing_lookup, sourceHandle: row_billing, animated: true },
        { id: uuid(), source: d_billing_lookup, target: m_billing, animated: true },
      ],
    };
  },
},

 {
  id: 'catalog-pro',
  name: 'Product catalog',
  description: 'Showcase multiple products that all lead to a central call-to-action.',
  icon: '🛍️',
  color: '#993C1D',
  bg: '#FAECE7',
  border: '#F0997B',
  build: () => {
    // 1. Core Node IDs
    const t1 = `trigger-${uuid()}`;
    const d_initial = `delay-${uuid()}`;
    const m_list = `list-${uuid()}`;
    const m_cta = `button-${uuid()}`;
    
    // Product Detail Node IDs (Defined here so we can reference them in edges)
    const pA_text = `text-${uuid()}`;
    const pB_text = `text-${uuid()}`;
    const pC_text = `text-${uuid()}`;
    const pD_text = `text-${uuid()}`;
    const pE_text = `text-${uuid()}`;

    // Final Action Node IDs
    const m_order = `text-${uuid()}`;
    const m_sales = `text-${uuid()}`;
    const m_more  = `text-${uuid()}`;

    // 2. Handle IDs (Handles for branching)
    const row_a = uuid();
    const row_b = uuid();
    const row_c = uuid();
    const row_d = uuid();
    const row_e = uuid();

    const btn_order = uuid();
    const btn_sales = uuid();
    const btn_more  = uuid();

    return {
      name: 'Product catalog ',
      nodes: [
        {
          id: t1, type: 'trigger',
          position: { x: 400, y: 0 },
          data: { keyword: 'catalog, shop, price, products', matchType: 'contains' },
        },
        {
          id: d_initial, type: 'delay',
          position: { x: 400, y: 120 },
          data: { delayMinutes: 0.05 },
        },
        // --- THE MASTER LIST ---
        {
          id: m_list, type: 'list',
          position: { x: 400, y: 250 },
          data: {
            message: {
              type: 'list',
              listHeader: 'Our Products',
              listBody: 'Browse our full range. Tap any item to see specifications and pricing.',
              listButtonText: 'View Catalog',
              sections: [
                {
                  title: 'Best Sellers',
                  rows: [
                    { id: row_a, title: 'Product A', description: 'Our flagship model - $29' },
                    { id: row_b, title: 'Product B', description: 'Professional tier - $49' },
                    { id: row_c, title: 'Product C', description: 'Enterprise solution - $99' },
                  ],
                },
                {
                  title: 'New Arrivals',
                  rows: [
                    { id: row_d, title: 'Product D', description: 'Compact & Portable - $39' },
                    { id: row_e, title: 'Product E', description: 'Limited Edition - $79' },
                  ],
                },
              ],
            },
          },
        },

        // --- PRODUCT DETAILS (The Middle Layer) ---
        {
          id: pA_text, type: 'text',
          position: { x: -200, y: 550 },
          data: { message: { type: 'text', text: "✨ *Product A* is our #1 choice for beginners. Includes 24/7 support and 1-year warranty." } },
        },
        {
          id: pB_text, type: 'text',
          position: { x: 100, y: 550 },
          data: { message: { type: 'text', text: "🚀 *Product B* offers high-speed processing and advanced analytics for growing teams." } },
        },
        {
          id: pC_text, type: 'text',
          position: { x: 400, y: 550 },
          data: { message: { type: 'text', text: "🏢 *Product C* provides full enterprise-grade security and unlimited user seats." } },
        },
        {
          id: pD_text, type: 'text',
          position: { x: 700, y: 550 },
          data: { message: { type: 'text', text: "🆕 *Product D* is newly launched! It's the most efficient model in its class." } },
        },
        {
          id: pE_text, type: 'text',
          position: { x: 1000, y: 550 },
          data: { message: { type: 'text', text: "💎 *Product E* features a premium build and exclusive access to our partner network." } },
        },

        // --- SHARED CALL TO ACTION (The Funnel) ---
        {
          id: m_cta, type: 'button',
          position: { x: 400, y: 750 },
          data: {
            message: {
              type: 'button',
              buttonBody: "Would you like to move forward with one of these options?",
              buttons: [
                { id: btn_order, title: '🛒 Place Order' },
                { id: btn_sales, title: '📞 Talk to Sales' },
                { id: btn_more,  title: '🌐 Learn More' },
              ],
            },
          },
        },

        // --- FINAL OUTCOMES ---
        {
          id: m_order, type: 'text',
          position: { x: 150, y: 950 },
          data: { message: { type: 'text', text: "Perfect! Please type your *Full Name* and *Delivery Address* below to start the checkout." } },
        },
        {
          id: m_sales, type: 'text',
          position: { x: 400, y: 950 },
          data: { message: { type: 'text', text: "Connecting you with an expert... 🎧 In the meantime, please briefly describe your use case." } },
        },
        {
          id: m_more, type: 'text',
          position: { x: 650, y: 950 },
          data: { message: { type: 'text', text: "You can view the full technical documentation at: `https://example.com/docs`" } },
        },
      ],
      edges: [
        { id: uuid(), source: t1, target: d_initial, animated: true },
        { id: uuid(), source: d_initial, target: m_list, animated: true },

        // List Rows to specific Details
        { id: uuid(), source: m_list, target: pA_text, sourceHandle: row_a, animated: true },
        { id: uuid(), source: m_list, target: pB_text, sourceHandle: row_b, animated: true },
        { id: uuid(), source: m_list, target: pC_text, sourceHandle: row_c, animated: true },
        { id: uuid(), source: m_list, target: pD_text, sourceHandle: row_d, animated: true },
        { id: uuid(), source: m_list, target: pE_text, sourceHandle: row_e, animated: true },

        // ALL details point to the same CTA Button node
        { id: uuid(), source: pA_text, target: m_cta, animated: true },
        { id: uuid(), source: pB_text, target: m_cta, animated: true },
        { id: uuid(), source: pC_text, target: m_cta, animated: true },
        { id: uuid(), source: pD_text, target: m_cta, animated: true },
        { id: uuid(), source: pE_text, target: m_cta, animated: true },

        // CTA Button to Final Outcomes
        { id: uuid(), source: m_cta, target: m_order, sourceHandle: btn_order, animated: true },
        { id: uuid(), source: m_cta, target: m_sales, sourceHandle: btn_sales, animated: true },
        { id: uuid(), source: m_cta, target: m_more,  sourceHandle: btn_more,  animated: true },
      ],
    };
  },
},
 {
  id: 'appointment-pro',
  name: 'Appointment booking',
  description: 'A multi-branch booking system that guides users through categories and time slots.',
  icon: '📅',
  color: '#854F0B',
  bg: '#FAEEDA',
  border: '#EF9F27',
  build: () => {
    // 1. Core Node IDs
    const t1 = `trigger-${uuid()}`;
    const m_choice = `button-${uuid()}`;
    
    // Branch Lists
    const m_list_consult = `list-${uuid()}`;
    const m_list_demo    = `list-${uuid()}`;
    const m_list_visit   = `list-${uuid()}`;

    // Processing Delays
    const d_proc_consult = `delay-${uuid()}`;
    const d_proc_demo    = `delay-${uuid()}`;
    const d_proc_visit   = `delay-${uuid()}`;

    const m_confirm = `text-${uuid()}`;

    // 2. Interactive IDs (Buttons & Handles)
    const btn_consult = uuid();
    const btn_demo    = uuid();
    const btn_visit   = uuid();

    // Shared row IDs (You can also generate unique ones per list if branching further)
    const row_slot = uuid(); 

    return {
      name: 'Appointment booking (Pro)',
      nodes: [
        {
          id: t1, type: 'trigger',
          position: { x: 400, y: 0 },
          data: { keyword: 'book, appointment, schedule, slot', matchType: 'contains' },
        },
        // The Entry Choice
        {
          id: m_choice, type: 'button',
          position: { x: 400, y: 180 },
          data: {
            message: {
              type: 'button',
              buttonHeader: 'Schedule a Session',
              buttonBody: 'We would love to connect! What type of appointment are you looking for?',
              buttonFooter: 'Choose a category:',
              buttons: [
                { id: btn_consult, title: 'Consultation' },
                { id: btn_demo,    title: 'Product Demo' },
                { id: btn_visit,   title: 'Site Visit'   },
              ],
            },
          },
        },

        // --- BRANCH A: CONSULTATION ---
        {
          id: m_list_consult, type: 'list',
          position: { x: 0, y: 450 },
          data: {
            message: {
              type: 'list',
              listHeader: 'Consultation Slots',
              listBody: 'Available 30-minute sessions for expert consultation.',
              listButtonText: 'Select Time',
              sections: [
                {
                  title: 'Available Today',
                  rows: [
                    { id: uuid(), title: '10:00 AM', description: 'Expert: Sarah J.' },
                    { id: uuid(), title: '02:00 PM', description: 'Expert: Mike R.' },
                  ],
                },
              ],
            },
          },
        },

        // --- BRANCH B: DEMO ---
        {
          id: m_list_demo, type: 'list',
          position: { x: 400, y: 450 },
          data: {
            message: {
              type: 'list',
              listHeader: 'Demo Sessions',
              listBody: 'Pick a 45-minute slot for a full product walkthrough.',
              listButtonText: 'Select Time',
              sections: [
                {
                  title: 'Morning Slots',
                  rows: [
                    { id: uuid(), title: '09:00 AM', description: 'Live Environment' },
                    { id: uuid(), title: '11:00 AM', description: 'Q&A Included' },
                  ],
                },
              ],
            },
          },
        },

        // --- BRANCH C: SITE VISIT ---
        {
          id: m_list_visit, type: 'list',
          position: { x: 800, y: 450 },
          data: {
            message: {
              type: 'list',
              listHeader: 'On-Site Visits',
              listBody: 'Our team will visit your location. 1-hour duration.',
              listButtonText: 'Select Time',
              sections: [
                {
                  title: 'Field Team Alpha',
                  rows: [
                    { id: uuid(), title: 'Tue 10:00 AM', description: 'Location Audit' },
                    { id: uuid(), title: 'Thu 03:00 PM', description: 'Implementation' },
                  ],
                },
              ],
            },
          },
        },

        // --- THE "BOOKING" DELAYS ---
        {
          id: d_proc_consult, type: 'delay',
          position: { x: 0, y: 700 },
          data: { delayMinutes: 0.1 }, // 6s simulation
        },
        {
          id: d_proc_demo, type: 'delay',
          position: { x: 400, y: 700 },
          data: { delayMinutes: 0.1 },
        },
        {
          id: d_proc_visit, type: 'delay',
          position: { x: 800, y: 700 },
          data: { delayMinutes: 0.1 },
        },

        // --- FINAL CONFIRMATION (Diamond Closure) ---
        {
          id: m_confirm, type: 'text',
          position: { x: 400, y: 850 },
          data: { 
            message: { 
              type: 'text', 
              text: "Confirmed! ✅ Your slot is locked in. You'll receive a calendar invite at your registered email address shortly." 
            } 
          },
        },
      ],
      edges: [
        { id: uuid(), source: t1, target: m_choice, animated: true },

        // Branching from Buttons
        { id: uuid(), source: m_choice, target: m_list_consult, sourceHandle: btn_consult, animated: true },
        { id: uuid(), source: m_choice, target: m_list_demo,    sourceHandle: btn_demo,    animated: true },
        { id: uuid(), source: m_choice, target: m_list_visit,   sourceHandle: btn_visit,   animated: true },

        // Lists to Delays (Moving regardless of which row is picked)
        { id: uuid(), source: m_list_consult, target: d_proc_consult, animated: true },
        { id: uuid(), source: m_list_demo,    target: d_proc_demo,    animated: true },
        { id: uuid(), source: m_list_visit,   target: d_proc_visit,   animated: true },

        // All paths lead to the same Confirmation
        { id: uuid(), source: d_proc_consult, target: m_confirm, animated: true },
        { id: uuid(), source: d_proc_demo,    target: m_confirm, animated: true },
        { id: uuid(), source: d_proc_visit,   target: m_confirm, animated: true },
      ],
    };
  },
}
];