import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Download } from "lucide-react";

interface LessonListProps {
  lessons: any[];
  lessonDetails: Record<string, any>;
  onSelectLesson: (lesson: any) => void;
  selectedLessonId?: string;
}

const LessonList = ({ lessons, lessonDetails, onSelectLesson, selectedLessonId }: LessonListProps) => {
  const renderLesson = (lesson: any) => (
    <AccordionItem key={lesson.lesson_id} value={lesson.lesson_id}>
      <AccordionTrigger 
        className={`hover:no-underline ${selectedLessonId === lesson.lesson_id ? 'bg-accent/10' : ''}`}
      >
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
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelectLesson(lesson)}
          >
            <Video className="mr-2 h-4 w-4" />
            Watch Video
          </Button>
          
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

export default LessonList;