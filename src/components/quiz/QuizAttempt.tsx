import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface QuizAttemptProps {
  quiz: any;
}

export const QuizAttempt = ({ quiz }: QuizAttemptProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ["quiz-questions", quiz.quiz_id],
    queryFn: async () => {
      console.log("Fetching quiz questions:", quiz.quiz_id);
      
      const { data, error } = await supabase
        .from("quiz_questions")
        .select(`
          *,
          options:quiz_options(*)
        `)
        .eq("quiz_id", quiz.quiz_id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: canAttempt } = useQuery({
    queryKey: ["can-attempt-quiz", quiz.quiz_id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "can_attempt_quiz",
        { quiz_id: quiz.quiz_id }
      );

      if (error) throw error;
      return data;
    },
  });

  const submitAttempt = useMutation({
    mutationFn: async () => {
      // Create attempt
      const { data: attempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: quiz.quiz_id,
          attempt_number: 1, // TODO: Get actual attempt number
        })
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Submit answers
      const answersToSubmit = Object.entries(answers).map(([questionId, selectedOptions]) => ({
        attempt_id: attempt.attempt_id,
        question_id: questionId,
        selected_options: selectedOptions,
      }));

      const { error: answersError } = await supabase
        .from("quiz_answers")
        .insert(answersToSubmit);

      if (answersError) throw answersError;

      return attempt;
    },
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({ queryKey: ["can-attempt-quiz"] });
      navigate(`/quiz-results/${attempt.attempt_id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
      });
    },
  });

  if (!canAttempt) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You cannot attempt this quiz at this time. This could be because:
          <ul className="list-disc list-inside mt-2">
            <li>You have reached the maximum number of attempts</li>
            <li>You haven't completed the required lesson/course</li>
            <li>The quiz is not available yet</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading questions: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const handleOptionSelect = (questionId: string, optionId: string, multiple: boolean) => {
    setAnswers(prev => {
      if (multiple) {
        const current = prev[questionId] || [];
        const updated = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: [optionId] };
    });
  };

  const handleSubmit = () => {
    // Validate all questions are answered
    const unansweredQuestions = questions.filter(
      q => !answers[q.question_id] || answers[q.question_id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    submitAttempt.mutate();
  };

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <Card key={question.question_id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="font-medium">
                {index + 1}. {question.question_text}
                {question.is_multiple_correct && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Select all that apply)
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {question.is_multiple_correct ? (
                  question.options.map(option => (
                    <div key={option.option_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.option_id}
                        checked={(answers[question.question_id] || []).includes(option.option_id)}
                        onCheckedChange={(checked) => {
                          handleOptionSelect(
                            question.question_id,
                            option.option_id,
                            true
                          );
                        }}
                      />
                      <Label htmlFor={option.option_id}>{option.option_text}</Label>
                    </div>
                  ))
                ) : (
                  <RadioGroup
                    value={answers[question.question_id]?.[0]}
                    onValueChange={(value) => {
                      handleOptionSelect(question.question_id, value, false);
                    }}
                  >
                    {question.options.map(option => (
                      <div key={option.option_id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.option_id}
                          id={option.option_id}
                        />
                        <Label htmlFor={option.option_id}>{option.option_text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={submitAttempt.isPending}
        >
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};