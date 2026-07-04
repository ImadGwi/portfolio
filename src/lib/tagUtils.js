/**
 * Automatically categorizes a message based on keywords in the subject and body.
 * //### This is the auto-tagging logic that helps organize the inbox.
 */
export function autoTagMessage(subject = '', body = '') {
  const text = `${subject} ${body}`.toLowerCase();

  const keywords = {
    job: ['hire', 'position', 'recruitment', 'role', 'career', 'opportunity', 'offer', 'employment'],
    freelance: ['project', 'contract', 'gig', 'consulting', 'freelance', 'collaboration', 'budget'],
    spam: ['win', 'money', 'prize', 'crypto', 'bitcoin', 'investment', 'offer', 'gift', 'casino'],
    question: ['how', 'why', 'help', 'question', 'inquiring', 'ask', 'clarification'],
  };

  for (const [tag, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return tag;
    }
  }

  return 'other';
}
