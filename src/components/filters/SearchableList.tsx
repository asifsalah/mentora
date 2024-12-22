import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface SearchableListProps {
  items: { id: string; name: string }[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
}

export const SearchableList = ({
  items,
  selectedItems,
  onSelectionChange,
  placeholder = "Search...",
}: SearchableListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemToggle = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => handleItemToggle(item.id)}
              />
              <label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};