import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface UserProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const Address = ({ onNextStep, onPrevStep }: UserProps) => {
    const handleNextStep = () => {
        onNextStep?.();
    };

    const handlePrevStep = () => {
        onPrevStep?.();
    };

    return (
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Address Information</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    We need your address to deliver your order.
                </p>
            </div>
        
            <FieldSet>
                {/* Address */}
                <Field>
                    <FieldLabel htmlFor="street">Address 1</FieldLabel>
                    <Input id="street" type="text" placeholder="123 Main St" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="street">Address 2</FieldLabel>
                    <Input id="street" type="text" placeholder="123 Main St" />
                </Field>

                {/* City */}
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input id="city" type="text" placeholder="New York" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                        <Input id="zip" type="text" placeholder="90502" />
                    </Field>
                </div>
            </FieldSet>
        
            {/* Button */}
            <Field>
                <div className="flex flex-row justify-between">
                    <Button variant="outline" type="button" onClick={handlePrevStep}>Back</Button>
                    <Button type="button" onClick={handleNextStep}>Skip</Button>
                </div>
            </Field>
        </FieldGroup>
    )
}

export default Address
