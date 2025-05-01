export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category:
    | 'greeting'
    | 'inquiry'
    | 'confirmation'
    | 'rejection'
    | 'arrangement'
    | 'other';
  forRole?: 'host' | 'helper' | 'both';
}

export const messageTemplates: MessageTemplate[] = [
  // Greeting templates
  {
    id: 'greeting-1',
    title: 'Initial greeting',
    content:
      "Hello! I saw your profile and I'm interested in connecting with you. Looking forward to your response!",
    category: 'greeting',
    forRole: 'both',
  },
  {
    id: 'greeting-2',
    title: 'Host welcome',
    content:
      "Welcome! Thank you for your interest in my listing. I'd be happy to answer any questions you might have about the accommodation or work requirements.",
    category: 'greeting',
    forRole: 'host',
  },
  {
    id: 'greeting-3',
    title: 'Helper introduction',
    content:
      "Hi there! I'm interested in your listing and would love to learn more about the opportunity. I have experience in similar work and I think we could be a good match.",
    category: 'greeting',
    forRole: 'helper',
  },

  // Inquiry templates
  {
    id: 'inquiry-1',
    title: 'Accommodation details',
    content:
      "Could you please provide more details about the accommodation? I'd like to know more about the room, facilities, and what's included.",
    category: 'inquiry',
    forRole: 'helper',
  },
  {
    id: 'inquiry-2',
    title: 'Work requirements',
    content:
      "I'd like to understand more about the work requirements. How many hours per week would you expect, and what specific tasks would be involved?",
    category: 'inquiry',
    forRole: 'helper',
  },
  {
    id: 'inquiry-3',
    title: 'Helper experience',
    content:
      'Could you tell me more about your experience with the skills required for this position? Have you done similar work before?',
    category: 'inquiry',
    forRole: 'host',
  },
  {
    id: 'inquiry-4',
    title: 'Availability',
    content:
      "I wanted to check if you're available during the following dates: [insert dates]. Would that timeframe work for you?",
    category: 'inquiry',
    forRole: 'both',
  },

  // Confirmation templates
  {
    id: 'confirmation-1',
    title: 'Booking confirmation',
    content:
      "Great news! I'd like to confirm your stay from [start date] to [end date]. Please let me know if this works for you, and we can discuss next steps.",
    category: 'confirmation',
    forRole: 'host',
  },
  {
    id: 'confirmation-2',
    title: 'Accept booking',
    content:
      "Thank you for confirming! I'm excited to accept this opportunity and looking forward to staying with you from [start date] to [end date].",
    category: 'confirmation',
    forRole: 'helper',
  },

  // Rejection templates
  {
    id: 'rejection-1',
    title: 'Polite decline (Host)',
    content:
      "Thank you for your interest in my listing. After careful consideration, I've decided to go with another helper whose skills better match my current needs. I wish you all the best in finding a suitable placement.",
    category: 'rejection',
    forRole: 'host',
  },
  {
    id: 'rejection-2',
    title: 'Polite decline (Helper)',
    content:
      "Thank you for considering my application. After reviewing the details, I've decided to pursue other opportunities that better align with my travel plans. I appreciate your time and wish you success in finding a suitable helper.",
    category: 'rejection',
    forRole: 'helper',
  },

  // Arrangement templates
  {
    id: 'arrangement-1',
    title: 'Arrival details',
    content:
      "I wanted to confirm the arrival details. I'll be arriving on [date] at approximately [time]. Please let me know if there are any specific directions or instructions I should be aware of.",
    category: 'arrangement',
    forRole: 'helper',
  },
  {
    id: 'arrangement-2',
    title: 'Welcome instructions',
    content:
      'Looking forward to your arrival on [date]! Here are some instructions to help you find the place: [insert directions]. My phone number is [phone number] in case you need to reach me.',
    category: 'arrangement',
    forRole: 'host',
  },

  // Other templates
  {
    id: 'other-1',
    title: 'Thank you',
    content:
      'Thank you for the wonderful experience! I really enjoyed my time and appreciate your hospitality.',
    category: 'other',
    forRole: 'helper',
  },
  {
    id: 'other-2',
    title: 'Feedback request',
    content:
      'I hope you enjoyed your stay! I would appreciate if you could leave a review about your experience. Thank you!',
    category: 'other',
    forRole: 'host',
  },
];

export const getTemplatesByCategory = (
  category: MessageTemplate['category'],
  role?: 'host' | 'helper' | 'both'
) => {
  return messageTemplates.filter(
    (template) =>
      template.category === category &&
      (!role || template.forRole === role || template.forRole === 'both')
  );
};

export const getTemplateById = (id: string) => {
  return messageTemplates.find((template) => template.id === id);
};

export const getAllTemplates = (role?: 'host' | 'helper' | 'both') => {
  return role
    ? messageTemplates.filter(
        (template) => template.forRole === role || template.forRole === 'both'
      )
    : messageTemplates;
};
