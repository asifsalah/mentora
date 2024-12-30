import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface CourseCardProps {
  courseId: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  rating: number;
  imageUrl: string;
  price: number;
  onEnroll: () => void;
}

export const CourseCard = ({
  courseId,
  title,
  description,
  category,
  duration,
  lessons,
  rating,
  imageUrl,
  price,
  onEnroll,
}: CourseCardProps) => {
  const { data: categoryName = category } = useQuery({
    queryKey: ["category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_categories")
        .select("category_name")
        .eq("id", category)
        .single();

      if (error) {
        console.error("Error fetching category:", error);
        return category;
      }

      return data.category_name;
    },
    enabled: !!category,
  });

  const { data: isEnrolled = false } = useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("course_enrollments")
        .select("enrollment_id")
        .eq("course_id", courseId)
        .eq("student_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) {
        console.error("Error checking enrollment:", error);
        return false;
      }

      return !!data;
    },
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-primary/90">{categoryName}</Badge>
      </div>
      <CardHeader className="flex-none">
        <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-none border-t pt-4">
        <div className="w-full grid grid-cols-[auto_1fr] gap-4 items-center">
          <span className="text-2xl font-bold">${price}</span>
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link to={`/course/${courseId}`}>View Details</Link>
            </Button>
            {isEnrolled ? (
              <Button 
                asChild
                className="bg-[#1a1d24] hover:bg-[#2a2d34]"
              >
                <Link to={`/course/${courseId}/lessons`}>Continue</Link>
              </Button>
            ) : (
              <Button 
                onClick={onEnroll} 
                className="bg-[#1a1d24] hover:bg-[#2a2d34]"
              >
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};