'use client'

import { cloneElement, useState } from 'react';
import User from './user';
import Address from './address';
import PaymentInfo from './payment-info';
import Verification from './verification';
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Check } from 'lucide-react';

const steps = [
    {title: 'Step 1', content: <User />},
    {title: 'Step 2', content: <Address />},
    {title: 'Step 3', content: <PaymentInfo />},
    {title: 'Step 4', content: <Verification />},
];

const SignupUser = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep((prev) => {
            if (prev >= steps.length) return prev;
            return prev + 1;
        });
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => {
            if (prev <= 1) return prev;
            return prev - 1;
        });
    };

    return (
        <Stepper 
            defaultValue={1}
            value={currentStep}
            indicators={{
                completed: <Check className="size-3.5" />,
            }}
        >
            <StepperNav className='mb-6'>
                {steps.map((step, index) => (
                <StepperItem key={index} step={index + 1}>
                    <StepperTrigger asChild>
                    <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                        {index + 1}
                    </StepperIndicator>
                    </StepperTrigger>
                    {steps.length > index + 1 && <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />}
                </StepperItem>
                ))}
            </StepperNav>

            <StepperPanel className="text-sm">
                {steps.map((step, index) => (
                <StepperContent key={index} value={index + 1}>
                    {cloneElement(step.content, { onNextStep: handleNextStep, onPrevStep: handlePrevStep })}
                </StepperContent>
                ))}
            </StepperPanel> 
        </Stepper>
    )
}

export default SignupUser
