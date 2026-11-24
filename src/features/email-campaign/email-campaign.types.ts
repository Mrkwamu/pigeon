export interface CreateEmailCampaignInput {
  smtpAccountId: number;
  usernames: string[];
  subject: string;
  text: string;
}
