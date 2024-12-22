import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Star } from "lucide-react";

interface CourseCardProps {
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
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-primary/90">{category}</Badge>
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
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
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-bold">${price}</span>
        <Button onClick={onEnroll}>Enroll Now</Button>
      </CardFooter>
    </Card>
  );
};