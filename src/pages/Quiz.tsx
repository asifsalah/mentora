import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { QuizAttempt } from "@/components/quiz/QuizAttempt";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const QuizPage = () => {
  const { quizId } = useParams();

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      console.log("Fetching quiz:", quizId);
      
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          course:courses(title),
          lesson:lessons(title)
        `)
        .eq("quiz_id", quizId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!quizId,
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
            Error loading quiz: {error.message}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Quiz not found</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-muted-foreground mt-2">{quiz.description}</p>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            {quiz.course && <span>Course: {quiz.course.title}</span>}
            {quiz.lesson && (
              <>
                <span className="mx-2">•</span>
                <span>Lesson: {quiz.lesson.title}</span>
              </>
            )}
          </div>
        </div>
        <QuizAttempt quiz={quiz} />
      </div>
    </Layout>
  );
};

export default QuizPage;