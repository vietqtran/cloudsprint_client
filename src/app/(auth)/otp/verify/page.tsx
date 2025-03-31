'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { otpValidation } from '@/constants/validate';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const otpVerificationSchema = z.object({
  otp: otpValidation,
});

type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;

export default function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [errors, setErrors] = useState<{
    otp?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const otp = formData.get('otp') as string;

    const validationResult = otpVerificationSchema.safeParse({ otp });

    if (!validationResult.success) {
      const formattedErrors = {
        otp: '',
      };

      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof OtpVerificationFormValues;
        formattedErrors[path] = error.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        toast('Verification successful!');

        router.push(`/reset?email=${encodeURIComponent(email)}&token=${otp}`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({
        general: 'Invalid verification code. Please try again.',
      });
      setIsLoading(false);
    }
  }

  function handleResendOTP() {
    setResendDisabled(true);
    setTimeLeft(60);

    setTimeout(() => {
      toast('Verification code resent!');
    }, 1000);
  }

  return (
    <div className='mx-auto max-w-md space-y-6 px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-[#313957]'>Verify Your Identity</h1>
        <p className='mt-2 text-[#8897ad]'>
          We&apos;ve sent a 6-digit verification code to{' '}
          <span className='font-medium text-[#313957]'>{email}</span>
        </p>
      </div>

      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='otp' className='block text-sm font-medium text-[#313957]'>
            Verification Code
          </Label>
          <Input
            autoFocus
            id='otp'
            name='otp'
            type='text'
            maxLength={6}
            placeholder='Enter 6-digit code'
            className={`w-full rounded-md border text-center tracking-widest ${
              errors.otp ? 'border-red-500' : 'border-[#d4d7e3]'
            } bg-[#f7fbff] px-3 py-2 text-[#313957] text-lg`}
          />
          {errors.otp && <p className='mt-1 text-xs text-red-500'>{errors.otp}</p>}
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
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className='text-center space-y-2'>
          <p className='text-sm text-[#8897ad]'>Didn&apos;t receive the code?</p>
          <button
            type='button'
            disabled={resendDisabled}
            className={`text-sm cursor-pointer ${
              resendDisabled ? 'text-[#8897ad]' : 'text-[#1e4ae9] hover:underline'
            }`}
            onClick={handleResendOTP}
          >
            {resendDisabled ? `Resend code in ${timeLeft}s` : 'Resend code'}
          </button>
        </div>
      </form>
    </div>
  );
}
