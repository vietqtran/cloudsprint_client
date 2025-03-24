'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { confirmPasswordValidation, passwordValidation } from '@/constants/validate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  //   const searchParams = useSearchParams();
  //   const email = searchParams.get("email") || "";
  //   const token = searchParams.get("token") || "";

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const formValues = {
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const validationResult = resetPasswordSchema.safeParse(formValues);

    if (!validationResult.success) {
      const formattedErrors = {
        password: '',
        confirmPassword: '',
      };

      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof ResetPasswordFormValues;
        formattedErrors[path] = error.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        toast('Password reset successfully!');

        router.push('/auth/sign-in');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrors({
        general: 'Failed to reset password. Please try again.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className='mx-auto max-w-md space-y-6 px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-[#313957]'>Reset Your Password</h1>
        <p className='mt-2 text-[#8897ad]'>Create a new secure password for your account</p>
      </div>

      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='password' className='block text-sm font-medium text-[#313957]'>
            New Password
          </Label>
          <div className='relative'>
            <Input
              autoFocus
              id='password'
              name='password'
              type='password'
              placeholder='Enter new password'
              className={`w-full rounded-md border ${
                errors.password ? 'border-red-500' : 'border-[#d4d7e3]'
              } bg-[#f7fbff] px-3 py-2 text-[#313957] pr-10`}
            />
          </div>
          {errors.password && <p className='mt-1 text-xs text-red-500'>{errors.password}</p>}
          <p className='text-xs text-gray-500'>
            Password must be at least 8 characters with one uppercase letter and one number.
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword' className='block text-sm font-medium text-[#313957]'>
            Confirm New Password
          </Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Confirm new password'
              className={`w-full rounded-md border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#d4d7e3]'
              } bg-[#f7fbff] px-3 py-2 text-[#313957] pr-10`}
            />
          </div>
          {errors.confirmPassword && (
            <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword}</p>
          )}
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
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
