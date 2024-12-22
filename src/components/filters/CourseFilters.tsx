import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryTree } from "./CategoryTree";
import { SearchableList } from "./SearchableList";
import { PriceRangeFilter } from "./PriceRangeFilter";

interface Instructor {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface CourseFiltersProps {
  categories: Category[];
  instructors: Instructor[];
  tags: Tag[];
  onFiltersChange: (filters: {
    categories: string[];
    instructors: string[];
    tags: string[];
    priceRange: { min: number; max: number };
  }) => void;
}

export const CourseFilters = ({
  categories,
  instructors,
  tags,
  onFiltersChange,
}: CourseFiltersProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const updateFilters = ({
    categories = selectedCategories,
    instructors = selectedInstructors,
    tags = selectedTags,
    price = priceRange,
  }) => {
    onFiltersChange({
      categories,
      instructors,
      tags,
      priceRange: price,
    });
  };

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <CategoryTree
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectionChange={(categories) => {
              setSelectedCategories(categories);
              updateFilters({ categories });
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tags">
        <AccordionTrigger>Tags</AccordionTrigger>
        <AccordionContent>
          <SearchableList
            items={tags}
            selectedItems={selectedTags}
            onSelectionChange={(tags) => {
              setSelectedTags(tags);
              updateFilters({ tags });
            }}
            placeholder="Search tags..."
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger>Price Range</AccordionTrigger>
        <AccordionContent>
          <PriceRangeFilter
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
            onPriceChange={(min, max) => {
              setPriceRange({ min, max });
              updateFilters({ price: { min, max } });
            }}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="instructors">
        <AccordionTrigger>Instructors</AccordionTrigger>
        <AccordionContent>
          <SearchableList
            items={instructors}
            selectedItems={selectedInstructors}
            onSelectionChange={(instructors) => {
              setSelectedInstructors(instructors);
              updateFilters({ instructors });
            }}
            placeholder="Search instructors..."
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};