import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Play } from "lucide-react";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";

interface CourseHeaderProps {
  course: any;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  const [showVideo, setShowVideo] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", course.category_ids],
    queryFn: async () => {
      if (!course.category_ids?.length) return [];
      
      const { data, error } = await supabase
        .from("course_categories")
        .select("category_name")
        .in("id", course.category_ids);

      if (error) throw error;
      return data;
    },
    enabled: !!course.category_ids?.length,
  });

  const { data: isEnrolled = false } = useQuery({
    queryKey: ["enrollment", course.course_id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("course_enrollments")
        .select("enrollment_id")
        .eq("course_id", course.course_id)
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{course.status}</Badge>
            {categories.map((category: any) => (
              <Badge key={category.id} variant="secondary">
                {category.category_name}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.short_description}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-end">
            {course.regular_price && course.sale_price && (
              <span className="text-sm line-through text-muted-foreground">
                ${course.regular_price}
              </span>
            )}
            <span className="text-2xl font-bold">
              ${course.sale_price || course.regular_price}
            </span>
          </div>
          {isEnrolled ? (
            <Button size="lg" asChild>
              <Link to={`/course/${course.course_id}/lessons`}>Continue</Link>
            </Button>
          ) : (
            <Button size="lg">Enroll Now</Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        {showVideo && course.promo_video_url ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={course.promo_video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </AspectRatio>
        ) : (
          <div className="relative">
            <AspectRatio ratio={16 / 9}>
              <img
                src={course.feature_image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            {course.promo_video_url && (
              <Button
                size="lg"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                onClick={() => setShowVideo(true)}
              >
                <Play className="mr-2 h-4 w-4" /> Watch Preview
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};