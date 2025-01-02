import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { QuizResultView } from "@/components/quiz/QuizResultView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const QuizResultsPage = () => {
  const { attemptId } = useParams();

  const { data: attempt, isLoading, error } = useQuery({
    queryKey: ["quiz-attempt", attemptId],
    queryFn: async () => {
      console.log("Fetching quiz attempt:", attemptId);
      
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quiz:quizzes(
            *,
            course:courses(title),
            lesson:lessons(title)
          ),
          answers:quiz_answers(
            *,
            question:quiz_questions(
              *,
              options:quiz_options(*)
            )
          )
        `)
        .eq("attempt_id", attemptId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!attemptId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading quiz results: {error.message}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!attempt) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Quiz attempt not found</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{attempt.quiz.title} - Results</h1>
          <div className="text-sm text-muted-foreground mt-2">
            {attempt.quiz.course && (
              <span>Course: {attempt.quiz.course.title}</span>
            )}
            {attempt.quiz.lesson && (
              <>
                <span className="mx-2">•</span>
                <span>Lesson: {attempt.quiz.lesson.title}</span>
              </>
            )}
          </div>
        </div>
        <QuizResultView attempt={attempt} />
      </div>
    </Layout>
  );
};

export default QuizResultsPage;