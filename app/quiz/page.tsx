import { QuizSection } from "@/components/QuizSection";

export default function QuizPage() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-4 overflow-y-auto">
        <QuizSection />
      </main>
    </div>
  );
} 