'use client';

import { useId } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Slider, SliderThumb } from '@/components/ui/slider';
import { useSliderInput } from '@/hooks/use-slider-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Percent } from 'lucide-react';

const items = [
  { id: 1, price: 20 },
  { id: 2, price: 35 },
  { id: 3, price: 40 },
  { id: 4, price: 50 },
  { id: 5, price: 100 },
];

const FormSchema = z.object({
  range: z
    .array(z.number())
    .length(2, 'You must select both minimum and maximum values.')
    .refine(([min, max]) => max > min, {
      message: 'Maximum value must be greater than the minimum value.',
    })
});

export default function DiscountRangeForm() {
  const id = useId();
  const minValue = Math.min(...items.map((item) => item.price));
  const maxValue = Math.max(...items.map((item) => item.price));

  const { sliderValues, setSliderValues, setInputValues, inputValues, handleSliderChange, handleInputChange, validateAndUpdateValue } =
    useSliderInput({
      minValue,
      maxValue,
      initialValue: [minValue, maxValue],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { range: [minValue, maxValue] },
  });

  const handleSliderChangeWithValidation = (values: [number, number]) => {
    handleSliderChange(values);
    form.setValue('range', values);
    form.trigger('range');
  };

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        {/* Slider and Inputs */}
        <FormField control={form.control} name="range"
          render={() => (
            <FormItem>  
              <Slider value={sliderValues} onValueChange={handleSliderChangeWithValidation} min={minValue} max={maxValue} step={10}>
                <SliderThumb />
                <SliderThumb />
              </Slider>

              <div className="flex items-center justify-between mt-4 gap-4">
                <div>
                  <Label htmlFor={`${id}-min`} className='mb-2'>Min Price</Label>
                  <InputGroup>
                    <InputGroupInput id={`${id}-min`} type="number" value={inputValues[0]} onChange={(e) => handleInputChange(e, 0)} onBlur={() => validateAndUpdateValue(inputValues[0], 0)} placeholder="0.00" />
                    <InputGroupAddon align="inline-end">
                      <Percent />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div>
                  <Label htmlFor={`${id}-max`} className='mb-2'>Max Price</Label>
                  <InputGroup>
                    <InputGroupInput id={`${id}-max`} type="number" value={inputValues[1]} onChange={(e) => handleInputChange(e, 1)} onBlur={() => validateAndUpdateValue(inputValues[1], 1)} placeholder="0.00" />
                    <InputGroupAddon align="inline-end">
                      <Percent />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit and Reset */}
        {/* <div className="flex justify-end gap-2">
          <Button type="reset" variant="outline" onClick={() => { form.reset();setSliderValues([minValue, maxValue]); setInputValues([minValue, maxValue]); }}>
            Reset
          </Button>
          <Button type="button">Submit</Button>
        </div> */}
      </form>
    </Form>
  );
}
