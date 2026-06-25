-- ============================================================
-- Verdict · Seed inicial · 20 dilemas de prueba
-- Distribución: 8 quick, 8 context, 4 justification
-- Categorías: ethics, relationships, money, loyalty, society
-- ============================================================

insert into dilemmas (type, question, option_a, option_b, category, status, published_at) values

-- QUICK (8)
('quick', 'You find a wallet with $500 cash and ID. Do you return it?',
 'Return everything', 'Keep the cash', 'ethics', 'active', now()),

('quick', 'Your best friend asks if their partner is cheating. You saw something suspicious. Do you tell them?',
 'Tell the truth', 'Stay out of it', 'loyalty', 'active', now()),

('quick', 'You get charged twice by mistake and the company doesn''t notice. Do you report it?',
 'Report it', 'Keep the extra', 'ethics', 'active', now()),

('quick', 'A stranger drops $100 on the street and doesn''t notice. Do you return it?',
 'Return it', 'Keep it', 'ethics', 'active', now()),

('quick', 'Your coworker takes credit for your idea in front of your boss. Do you speak up?',
 'Speak up immediately', 'Let it go', 'loyalty', 'active', now()),

('quick', 'You find out your friend lied on their resume to get a job. Do you say anything?',
 'Confront them', 'None of my business', 'ethics', 'active', now()),

('quick', 'You can save one person you know or five strangers. Who do you save?',
 'Save the one I know', 'Save the five strangers', 'relationships', 'active', now()),

('quick', 'Your elderly neighbor needs help but it will make you late for an important meeting. Do you help?',
 'Help the neighbor', 'Prioritize the meeting', 'society', 'active', now()),

-- CONTEXT (8)
('context', 'Would you take a higher-paying job that requires moving away from family?',
 'Take the job', 'Stay close to family',
 'money', 'active', now()),

('context', 'Your company is about to lay off your team. You can save your job by taking a leadership role that requires firing others. Do you take it?',
 'Take the role', 'Refuse and face layoff',
 'loyalty', 'active', now()),

('context', 'A close friend asks you to lie to their partner about their whereabouts. Do you cover for them?',
 'Cover for them', 'Refuse to lie',
 'loyalty', 'active', now()),

('context', 'You witness a minor hit-and-run. The driver is a single parent struggling financially. Do you report them?',
 'Report to police', 'Let it go',
 'ethics', 'active', now()),

('context', 'Your partner wants to move to another country for their dream job. You would have to leave yours. Do you go?',
 'Go with them', 'Ask them to stay',
 'relationships', 'active', now()),

('context', 'You can guarantee your child gets into a top school by making a large donation. Is it fair?',
 'It''s fair — using resources available', 'It''s unfair — breaks meritocracy',
 'society', 'active', now()),

('context', 'A friend confesses they cheated on an important exam. Would you report them?',
 'Report them', 'Keep the secret',
 'ethics', 'active', now()),

('context', 'You inherit $50,000. Do you invest it for your future or use it to help family members in need?',
 'Invest for my future', 'Help family first',
 'money', 'active', now()),

-- JUSTIFICATION (4)
('justification', 'Is it ever acceptable to lie to protect someone you love?',
 'Yes, love justifies it', 'No, honesty always wins',
 'relationships', 'active', now()),

('justification', 'Should wealth be inherited or should everyone start equal?',
 'Inheritance is a right', 'Everyone should start equal',
 'society', 'active', now()),

('justification', 'You can save a drowning stranger but risk your own life. Are you morally obligated to try?',
 'Yes, it''s your duty', 'No, self-preservation comes first',
 'ethics', 'active', now()),

('justification', 'Is breaking the law ever morally justified?',
 'Yes, in extreme cases', 'No, laws must be respected',
 'society', 'active', now());
