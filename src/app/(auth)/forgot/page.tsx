'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomLink from '@/components/ui/link';
import { emailValidation } from '@/constants/validate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: emailValidation,
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    const validationResult = forgotPasswordSchema.safeParse({ email });

    if (!validationResult.success) {
      const formattedErrors = {
        email: '',
      };

      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof ForgotPasswordFormValues;
        formattedErrors[path] = error.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        toast('Verification code sent to your email');

        router.push(`/otp/verify?email=${encodeURIComponent(email)}`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({
        general: 'Failed to send verification code. Please try again.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className='mx-auto max-w-md space-y-6 px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-[#313957]'>Forgot Password</h1>
        <p className='mt-2 text-[#8897ad]'>
          Enter your email address and we&apos;ll send you a verification code to reset your
          password.
        </p>
      </div>

      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='email' className='block text-sm font-medium text-[#313957]'>
            Email Address
          </Label>
          <Input
            autoFocus
            id='email'
            name='email'
            type='email'
            placeholder='example@email.com'
            className={`w-full rounded-md border ${
              errors.email ? 'border-red-500' : 'border-[#d4d7e3]'
            } bg-[#f7fbff] px-3 py-2 text-[#313957]`}
            required
          />
          {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email}</p>}
        </div>

        {errors.general && (
          <div className='rounded-md bg-red-50 p-3'>
            <p className='text-sm text-red-500'>{errors.general}</p>
          </div>
        )}

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full cursor-pointer rounded-md bg-[#162d3a] py-2.5 text-white hover:bg-[#122b31] focus:outline-none focus:ring-2 focus:ring-[#294957] focus:ring-offset-2'
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Button>

        <div className='text-center'>
          <CustomLink href='/sign-in' text='Sign in' />
        </div>
      </form>
    </div>
  );
}
