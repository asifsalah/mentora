import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizResultViewProps {
  attempt: any;
}

export const QuizResultView = ({ attempt }: QuizResultViewProps) => {
  const totalQuestions = attempt.answers.length;
  const correctAnswers = attempt.answers.filter((a: any) => a.is_correct).length;
  const score = (correctAnswers / totalQuestions) * 100;
  const passed = score >= attempt.quiz.passing_score;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold">{score.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div>
                <Badge variant={passed ? "success" : "destructive"}>
                  {passed ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
              <div className="text-2xl font-bold">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Attempt</div>
              <div className="text-2xl font-bold">#{attempt.attempt_number}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {attempt.answers.map((answer: any, index: number) => (
          <Card key={answer.answer_id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {index + 1}. {answer.question.question_text}
                    </div>
                    {answer.question.is_multiple_correct && (
                      <div className="text-sm text-muted-foreground">
                        Multiple correct answers
                      </div>
                    )}
                  </div>
                  {answer.is_correct ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-2">
                  {answer.question.options.map((option: any) => {
                    const isSelected = answer.selected_options.includes(option.option_id);
                    const isCorrect = option.is_correct;

                    let textColor = "text-muted-foreground";
                    if (isSelected && isCorrect) textColor = "text-green-600";
                    else if (isSelected && !isCorrect) textColor = "text-red-600";
                    else if (!isSelected && isCorrect) textColor = "text-green-600";

                    return (
                      <div
                        key={option.option_id}
                        className={`flex items-center space-x-2 ${textColor}`}
                      >
                        <div className="flex-1">{option.option_text}</div>
                        {isSelected && (
                          <div className="text-sm">Your answer</div>
                        )}
                        {isCorrect && (
                          <div className="text-sm">Correct answer</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {answer.question.explanation && !answer.is_correct && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <strong>Explanation:</strong> {answer.question.explanation}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};