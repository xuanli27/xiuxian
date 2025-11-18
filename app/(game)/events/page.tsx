import { PageHeader } from '@/components/ui/PageHeader';
import { EventDisplay } from './_components/EventDisplay';

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="奇遇"
        subtitle="在摸鱼修仙的路上，每个选择都可能带来意想不到的机缘或挑战。"
      />

      <div className="mt-8">
        <EventDisplay />
      </div>
    </>
  );
}