import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const PriceRangeFilter = ({
  minPrice,
  maxPrice,
  onPriceChange,
}: PriceRangeFilterProps) => {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const handleSliderChange = (value: number[]) => {
    setMin(value[0]);
    setMax(value[1]);
    onPriceChange(value[0], value[1]);
  };

  const handleInputChange = (type: "min" | "max", value: string) => {
    const numValue = Number(value);
    if (type === "min") {
      if (numValue <= max) {
        setMin(numValue);
        onPriceChange(numValue, max);
      }
    } else {
      if (numValue >= min) {
        setMax(numValue);
        onPriceChange(min, numValue);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="min-price">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            value={min}
            onChange={(e) => handleInputChange("min", e.target.value)}
            min={0}
            max={max}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="max-price">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            value={max}
            onChange={(e) => handleInputChange("max", e.target.value)}
            min={min}
          />
        </div>
      </div>
      <Slider
        min={0}
        max={1000}
        step={10}
        value={[min, max]}
        onValueChange={handleSliderChange}
        className="mt-6"
      />
    </div>
  );
};