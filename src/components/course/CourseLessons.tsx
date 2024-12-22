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

interface CourseLessonsProps {
  courseId: string;
}

export const CourseLessons = ({ courseId }: CourseLessonsProps) => {
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          *,
          materials:lesson_materials(count),
          quizzes:quizzes(count)
        `)
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: lessonDetails = {} } = useQuery({
    queryKey: ["lesson-details", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select(`
          lesson_id,
          materials:lesson_materials(*),
          quizzes:quizzes(*)
        `)
        .eq("course_id", courseId);

      if (error) throw error;
      
      return data.reduce((acc: any, lesson) => {
        acc[lesson.lesson_id] = {
          materials: lesson.materials,
          quizzes: lesson.quizzes,
        };
        return acc;
      }, {});
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Course Content</h2>
      <Accordion type="single" collapsible className="w-full">
        {lessons.map((lesson: any) => (
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
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};