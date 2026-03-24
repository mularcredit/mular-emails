export const mockLogs = [
  { id: '1', recipient: 'john.doe@acme.com', subject: 'Q1 Partnership Proposal', status: 'Delivered', method: 'Brevo', time: '2026-03-24 03:45', messageId: 'msg_a1b2c3d4' },
  { id: '2', recipient: 'sarah.miller@techcorp.io', subject: 'Invoice #1042 - March Services', status: 'Opened', method: 'Brevo', time: '2026-03-24 02:30', messageId: 'msg_e5f6g7h8' },
  { id: '3', recipient: 'marketing@globalreach.com', subject: 'Newsletter: Spring Edition', status: 'Clicked', method: 'SMTP', time: '2026-03-23 18:15', messageId: 'msg_i9j0k1l2' },
  { id: '4', recipient: 'support@cloudbase.net', subject: 'Onboarding Guide - Get Started', status: 'Failed', method: 'SMTP', time: '2026-03-23 15:00', messageId: 'msg_m3n4o5p6' },
  { id: '5', recipient: 'ceo@venture.co', subject: 'Executive Summary - March 2026', status: 'Sent', method: 'Brevo', time: '2026-03-23 12:00', messageId: 'msg_q7r8s9t0' },
  { id: '6', recipient: 'billing@startupx.io', subject: 'Payment Reminder - Due Soon', status: 'Deferred', method: 'Brevo', time: '2026-03-23 09:30', messageId: 'msg_u1v2w3x4' },
  { id: '7', recipient: 'hr@enterprise.com', subject: 'Job Offer - Senior Engineer', status: 'Delivered', method: 'SMTP', time: '2026-03-22 17:45', messageId: 'msg_y5z6a7b8' },
  { id: '8', recipient: 'info@agency.design', subject: 'Project Kickoff - Mular Rebrand', status: 'Opened', method: 'Brevo', time: '2026-03-22 14:00', messageId: 'msg_c9d0e1f2' },
  { id: '9', recipient: 'team@devhouse.io', subject: 'API Integration Docs', status: 'Sent', method: 'SMTP', time: '2026-03-22 11:00', messageId: 'msg_g3h4i5j6' },
  { id: '10', recipient: 'finance@corp.net', subject: 'Annual Report Attached', status: 'Delivered', method: 'Brevo', time: '2026-03-21 16:30', messageId: 'msg_k7l8m9n0' },
  { id: '11', recipient: 'ops@retailco.com', subject: 'Order Confirmation #9812', status: 'Clicked', method: 'Brevo', time: '2026-03-21 13:00', messageId: 'msg_o1p2q3r4' },
  { id: '12', recipient: 'dev@saasplatform.io', subject: 'Security Alert - Action Required', status: 'Failed', method: 'SMTP', time: '2026-03-21 10:00', messageId: 'msg_s5t6u7v8' },
  { id: '13', recipient: 'noreply@partnerco.com', subject: 'Contract Renewal Notice', status: 'Sent', method: 'Brevo', time: '2026-03-20 15:30', messageId: 'msg_w9x0y1z2' },
  { id: '14', recipient: 'events@conference.org', subject: 'Speaking Opportunity - EduTech 2026', status: 'Delivered', method: 'Brevo', time: '2026-03-20 12:00', messageId: 'msg_a3b4c5d6' },
  { id: '15', recipient: 'pr@mediabrand.com', subject: 'Press Kit and Assets', status: 'Opened', method: 'SMTP', time: '2026-03-19 10:30', messageId: 'msg_e7f8g9h0' },
];

export const mockTemplates = [
  { id: '1', name: 'Cold Outreach', category: 'Sales', subject: 'Quick question about {{company}}', body: '<p>Hi {{first_name}},</p><p>I came across {{company}} and was impressed by your work in {{industry}}. I would love to explore how we can help your team.</p>', updatedAt: '2026-03-20' },
  { id: '2', name: 'Invoice Reminder', category: 'Finance', subject: 'Invoice #{{invoice_number}} - Payment Due', body: '<p>Dear {{name}},</p><p>This is a friendly reminder that Invoice #{{invoice_number}} for <strong>{{amount}}</strong> is due on {{due_date}}.</p>', updatedAt: '2026-03-18' },
  { id: '3', name: 'Onboarding Welcome', category: 'Product', subject: 'Welcome to {{product_name}}, {{first_name}}!', body: '<p>Hi {{first_name}},</p><p>Welcome aboard! We are thrilled to have you with us. Here is everything you need to get started with {{product_name}}.</p>', updatedAt: '2026-03-15' },
  { id: '4', name: 'Monthly Newsletter', category: 'Marketing', subject: '{{month}} Newsletter', body: '<p>Hello {{first_name}},</p><p>Here is what happened at {{company}} this {{month}}. We have some exciting updates to share with you.</p>', updatedAt: '2026-03-10' },
  { id: '5', name: 'Meeting Request', category: 'Sales', subject: 'Quick sync - {{duration}} mins?', body: '<p>Hi {{first_name}},</p><p>Would you have {{duration}} minutes this week for a quick call? I would love to discuss {{topic}} with you.</p>', updatedAt: '2026-03-08' },
  { id: '6', name: 'Partnership Proposal', category: 'Business', subject: 'Partnership Opportunity - {{company}}', body: '<p>Dear {{name}},</p><p>We believe a partnership between {{our_company}} and {{company}} could create significant value for both our teams.</p>', updatedAt: '2026-03-05' },
  { id: '7', name: 'Follow-up', category: 'Sales', subject: 'Following up on my previous email', body: '<p>Hi {{first_name}},</p><p>I wanted to follow up on my email from {{previous_date}}. Have you had a chance to review it?</p>', updatedAt: '2026-03-01' },
  { id: '8', name: 'Product Announcement', category: 'Marketing', subject: 'Introducing {{feature_name}}', body: '<p>Hi {{first_name}},</p><p>We are excited to announce <strong>{{feature_name}}</strong> - our newest feature designed to {{benefit}}.</p>', updatedAt: '2026-02-28' },
];

export const mockContacts = [
  { id: '1', name: 'John Doe', email: 'john.doe@acme.com', company: 'Acme Corp', tags: ['Client', 'VIP'], addedAt: '2026-02-01' },
  { id: '2', name: 'Sarah Miller', email: 'sarah.miller@techcorp.io', company: 'TechCorp', tags: ['Lead'], addedAt: '2026-02-05' },
  { id: '3', name: 'Marcus Webb', email: 'marcus@globalreach.com', company: 'GlobalReach', tags: ['Partner', 'Client'], addedAt: '2026-02-10' },
  { id: '4', name: 'Priya Sharma', email: 'priya.sharma@cloudbase.net', company: 'CloudBase', tags: ['Lead'], addedAt: '2026-02-12' },
  { id: '5', name: 'David Chen', email: 'dchen@venture.co', company: 'Venture Co', tags: ['Investor'], addedAt: '2026-02-15' },
  { id: '6', name: 'Emma Wilson', email: 'emma@startupx.io', company: 'StartupX', tags: ['Client'], addedAt: '2026-02-18' },
  { id: '7', name: 'Lucas Fernandez', email: 'lucas.fernandez@enterprise.com', company: 'Enterprise Inc', tags: ['Partner'], addedAt: '2026-02-20' },
  { id: '8', name: 'Aisha Okonkwo', email: 'aisha@agency.design', company: 'Agency Design', tags: ['Vendor'], addedAt: '2026-02-22' },
  { id: '9', name: 'Tom Bradley', email: 'tbradley@devhouse.io', company: 'DevHouse', tags: ['Lead', 'Tech'], addedAt: '2026-02-25' },
  { id: '10', name: 'Nina Petrov', email: 'nina@corp.net', company: 'Corp Network', tags: ['Client', 'Finance'], addedAt: '2026-03-01' },
  { id: '11', name: 'Robert Kim', email: 'rkim@retailco.com', company: 'RetailCo', tags: ['Client'], addedAt: '2026-03-05' },
  { id: '12', name: 'Claire Dupont', email: 'claire@saasplatform.io', company: 'SaaS Platform', tags: ['Partner', 'VIP'], addedAt: '2026-03-08' },
];

export const mockAnalytics = {
  summary: {
    totalSent: 1284,
    delivered: 1198,
    failed: 42,
    openRate: 38.4,
    clickRate: 12.7,
    bounceRate: 3.3,
  },
  dailySent: [
    { date: 'Mar 1', sent: 34, delivered: 31, failed: 3 },
    { date: 'Mar 3', sent: 52, delivered: 49, failed: 3 },
    { date: 'Mar 5', sent: 41, delivered: 38, failed: 3 },
    { date: 'Mar 7', sent: 68, delivered: 65, failed: 3 },
    { date: 'Mar 9', sent: 45, delivered: 43, failed: 2 },
    { date: 'Mar 11', sent: 73, delivered: 70, failed: 3 },
    { date: 'Mar 13', sent: 59, delivered: 56, failed: 3 },
    { date: 'Mar 15', sent: 88, delivered: 84, failed: 4 },
    { date: 'Mar 17', sent: 62, delivered: 60, failed: 2 },
    { date: 'Mar 19', sent: 94, delivered: 90, failed: 4 },
    { date: 'Mar 21', sent: 71, delivered: 68, failed: 3 },
    { date: 'Mar 23', sent: 97, delivered: 94, failed: 3 },
  ],
  methodSplit: [
    { name: 'Brevo API', value: 68 },
    { name: 'SMTP', value: 32 },
  ],
  statusBreakdown: [
    { name: 'Delivered', value: 1198 },
    { name: 'Opened', value: 493 },
    { name: 'Clicked', value: 163 },
    { name: 'Failed', value: 42 },
    { name: 'Deferred', value: 44 },
  ],
};
