import React from 'react'
import { CreditCard, Landmark } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from "@/components/ui/input"
import { Checkbox } from '../ui/checkbox'


interface UserProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

const PaymentInfo = ({ onNextStep, onPrevStep }: UserProps) => {
    const handleNextStep = () => {
        onNextStep?.();
    };

    const handlePrevStep = () => {
        onPrevStep?.();
    };

    return (
        <>
            <Accordion type="single" variant="outline" className="w-full" defaultValue='payment-1'>
                <AccordionItem value="payment-1">
                    <AccordionTrigger className='text-xl font-semibold'>
                        <div className='flex flex-row gap-2'>
                            Card or Debit Card <CreditCard className="size-6 mt-[1.5px]" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form>
                            <FieldGroup className='px-1 py-1'>
                                {/* Username */}
                                <FieldSet>
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-name-43j"> Name on Card </FieldLabel>
                                        <Input id="checkout-7j9-card-name-43j" placeholder="John Doe" required />
                                    </Field>
                                    {/* Email */}
                                    <Field>
                                        <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                            Card Number
                                        </FieldLabel>
                                        <Input id="checkout-7j9-card-number-uw1" placeholder="1234 5678 9012 3456" required />
                                        <FieldDescription>
                                        Enter your 16-digit card number
                                        </FieldDescription>
                                    </Field>
                                    {/* Password */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="checkout-exp-month-ts6"> Month </FieldLabel>
                                            <Select defaultValue="">
                                                <SelectTrigger id="checkout-exp-month-ts6">
                                                <SelectValue placeholder="MM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                <SelectItem value="01">01</SelectItem>
                                                <SelectItem value="02">02</SelectItem>
                                                <SelectItem value="03">03</SelectItem>
                                                <SelectItem value="04">04</SelectItem>
                                                <SelectItem value="05">05</SelectItem>
                                                <SelectItem value="06">06</SelectItem>
                                                <SelectItem value="07">07</SelectItem>
                                                <SelectItem value="08">08</SelectItem>
                                                <SelectItem value="09">09</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="11">11</SelectItem>
                                                <SelectItem value="12">12</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-exp-year-f59"> Year </FieldLabel>
                                            <Select defaultValue="">
                                                <SelectTrigger id="checkout-7j9-exp-year-f59">
                                                    <SelectValue placeholder="YYYY" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2024">2024</SelectItem>
                                                    <SelectItem value="2025">2025</SelectItem>
                                                    <SelectItem value="2026">2026</SelectItem>
                                                    <SelectItem value="2027">2027</SelectItem>
                                                    <SelectItem value="2028">2028</SelectItem>
                                                    <SelectItem value="2029">2029</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                                            <Input id="checkout-7j9-cvv" placeholder="123" required />
                                        </Field>
                                    </div>
                                </FieldSet>
                            </FieldGroup>
                        </form>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="payment-2">
                    <AccordionTrigger className='text-xl font-semibold'>
                        <div className='flex flex-row gap-2'>
                            Pay with Bank Transfer <Landmark className="size-5 mt-[2.8px]" />
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>Developers looking to save time with pre-built CRUD solutions.</AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <FieldGroup className="mt-6 px-1">
                <FieldSet className="gap-3">
                    <FieldLegend>Billing Address</FieldLegend>
                    <FieldDescription>
                        The billing address associated with your payment method
                    </FieldDescription>
                    <FieldGroup>
                        <Field orientation="horizontal">
                            <Checkbox
                            id="checkout-7j9-same-as-shipping-wgm"
                            defaultChecked
                            />
                            <FieldLabel
                            htmlFor="checkout-7j9-same-as-shipping-wgm"
                            className="font-normal"
                            >
                            Same as shipping address
                            </FieldLabel>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
            
            <div className="flex flex-row justify-between mt-6">
                <Button variant="outline" type="button" onClick={handlePrevStep}>Back</Button>
                <Button type="button" onClick={handleNextStep}>Skip</Button>
            </div>
        </>
    )
}

export default PaymentInfo
