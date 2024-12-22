import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const CategoryTree = ({
  categories,
  selectedCategories,
  onSelectionChange,
}: CategoryTreeProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onSelectionChange(newSelection);
  };

  const renderCategory = (category: Category) => (
    <AccordionItem value={category.id} key={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={category.id}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={() => handleCategoryToggle(category.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor={category.id}
            className="text-sm font-medium leading-none"
            onClick={(e) => e.stopPropagation()}
          >
            {category.name}
          </label>
        </div>
      </AccordionTrigger>
      {category.children && (
        <AccordionContent>
          <div className="ml-4">
            <Accordion type="multiple" className="w-full">
              {category.children.map(renderCategory)}
            </Accordion>
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  );

  const filterCategories = (categories: Category[], query: string): Category[] => {
    return categories
      .map((category) => ({
        ...category,
        children: category.children
          ? filterCategories(category.children, query)
          : undefined,
      }))
      .filter(
        (category) =>
          category.name.toLowerCase().includes(query.toLowerCase()) ||
          (category.children && category.children.length > 0)
      );
  };

  const filteredCategories = filterCategories(categories, searchQuery);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[300px]">
        <Accordion type="multiple" className="w-full">
          {filteredCategories.map(renderCategory)}
        </Accordion>
      </ScrollArea>
    </div>
  );
};