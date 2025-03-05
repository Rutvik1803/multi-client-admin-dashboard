import { FeedbackTable } from '@/components/feedback/feedback-table';
import { GenerateFeedbackLinkButton } from '@/components/feedback/generate-feedback-link-button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Feedback | Admin Dashboard',
  description: 'Manage and view customer feedback',
};

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Feedback</h1>
        <GenerateFeedbackLinkButton />
      </div>
      <FeedbackTable />
    </div>
  );
}
