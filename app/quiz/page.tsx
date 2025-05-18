import { QuizSection } from "@/components/QuizSection";

export default function QuizPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">AI Knowledge Quiz</h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <QuizSection />
      </main>
    </div>
  );
} 