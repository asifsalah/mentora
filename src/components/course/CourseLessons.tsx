import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseLessonsProps {
  courseId: string;
}

export const CourseLessons = ({ courseId }: CourseLessonsProps) => {
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      console.log("Fetching lessons for course:", courseId);
      
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          materials:lesson_materials(count),
          quizzes:quizzes(count),
          child_lessons:lessons!parent_lesson_id(
            *,
            materials:lesson_materials(count),
            quizzes:quizzes(count)
          )
        `)
        .eq("course_id", courseId)
        .is("parent_lesson_id", null)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error);
        throw error;
      }
      
      console.log("Fetched lessons:", data);
      return data || [];
    },
  });

  const { data: lessonDetails = {} } = useQuery({
    queryKey: ["lesson-details", courseId],
    queryFn: async () => {
      console.log("Fetching lesson details for course:", courseId);
      
      const { data: lessonIds } = await supabase
        .from("lessons")
        .select("lesson_id")
        .eq("course_id", courseId);

      if (!lessonIds?.length) return {};

      const { data, error } = await supabase
        .from("lessons")
        .select(`
          lesson_id,
          materials:lesson_materials(*),
          quizzes:quizzes(*)
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching lesson details:", error);
        throw error;
      }
      
      console.log("Fetched lesson details:", data);
      return data.reduce((acc: any, lesson) => {
        acc[lesson.lesson_id] = {
          materials: lesson.materials,
          quizzes: lesson.quizzes,
        };
        return acc;
      }, {});
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading lessons: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!lessons.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No lessons found for this course.
        </AlertDescription>
      </Alert>
    );
  }

  const renderLesson = (lesson: any) => (
    <AccordionItem key={lesson.lesson_id} value={lesson.lesson_id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-4">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span>{lesson.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {lesson.materials.count > 0 && (
              <Badge variant="outline">
                {lesson.materials.count} Material{lesson.materials.count !== 1 ? 's' : ''}
              </Badge>
            )}
            {lesson.quizzes.count > 0 && (
              <Badge variant="outline">
                {lesson.quizzes.count} Quiz{lesson.quizzes.count !== 1 ? 'zes' : ''}
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-4">
          {lesson.description && (
            <p className="text-muted-foreground">{lesson.description}</p>
          )}
          
          {lessonDetails[lesson.lesson_id]?.materials?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Materials</h4>
              <div className="space-y-2">
                {lessonDetails[lesson.lesson_id].materials.map((material: any) => (
                  <Button
                    key={material.material_id}
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" />
                      {material.file_name}
                      <Download className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {lessonDetails[lesson.lesson_id]?.quizzes?.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Quizzes</h4>
              <div className="space-y-2">
                {lessonDetails[lesson.lesson_id].quizzes.map((quiz: any) => (
                  <Button
                    key={quiz.quiz_id}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    {quiz.title}
                    <Badge variant="secondary" className="ml-auto">
                      {quiz.status}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {lesson.child_lessons?.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Sub-lessons</h4>
              <Accordion type="single" collapsible className="w-full">
                {lesson.child_lessons.map((childLesson: any) => renderLesson(childLesson))}
              </Accordion>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Content</h2>
      <Accordion type="single" collapsible className="w-full">
        {lessons.map(renderLesson)}
      </Accordion>
    </div>
  );
};