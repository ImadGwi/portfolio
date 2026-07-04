// src/components/main/CommentsAndMessage.jsx
import CommentsSection from './CommentsSection';
import MessageForm from './MessageForm';

export default function CommentsAndMessage() {
  return (
    <section className="relative z-10 px-6 py-16 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2">
          <CommentsSection />
        </div>
        <div className="lg:col-span-1">
          <MessageForm />
        </div>
      </div>
    </section>
  );
}