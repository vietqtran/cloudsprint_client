'use client';

import {
  confirmPasswordValidation,
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  passwordValidation,
} from '@/constants/validate';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import FacebookSocialButton from '../common/social/FacebookSocialButton';
import GoogleSocialButton from '../common/social/GoogleSocialButton';
import LoadingSpinner from '../ui/loading-spinner';

const signUpSchema = z
  .object({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleSubmit(values: z.infer<typeof signUpSchema>) {
    if (isLoading) return;
    setIsLoading(true);
    setErrors({});

    const formValues = {
      ...values,
    };

    const validationResult = signUpSchema.safeParse(formValues);

    if (!validationResult.success) {
      const formattedErrors = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };

      validationResult.error.errors.forEach((error) => {
        const path = error.path[0] as keyof SignUpFormValues;
        formattedErrors[path] = error.message;
      });

      setErrors(formattedErrors);
      setIsLoading(false);
      return;
    }
    const result = await fetch('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    const json = await result.json();

    setTimeout(() => {
      setIsLoading(false);
      if (result.ok) {
        toast.success(json.message);
        router.push('/sign-in');
      } else {
        setErrors({ general: json.message });
      }
    }, 1000);
  }

  return (
    <Form {...form}>
      <form className='mt-8 space-y-6' onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex items-start gap-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor='firstName' className='block text-sm font-medium'>
                    First name
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input
                    id='firstName'
                    autoFocus
                    type='text'
                    placeholder='John'
                    className={`w-full rounded-md border px-3 py-2`}
                    isError={!!form.formState.errors.firstName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor='lastName' className='block text-sm font-medium'>
                    Last name
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Doe'
                    className={`w-full rounded-md border px-3 py-2`}
                    isError={!!form.formState.errors.lastName}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor='email' className='block text-sm font-medium'>
                    Email
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input
                    id='email'
                    type='text'
                    placeholder='example@email.com'
                    className={`w-full rounded-md border px-3 py-2`}
                    isError={!!form.formState.errors.email}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor='password' className='block text-sm font-medium'>
                    Password
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    className={`w-full rounded-md border px-3 py-2`}
                    isError={!!form.formState.errors.password}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters with one uppercase letter and one number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Label htmlFor='confirmPassword' className='block text-sm font-medium'>
                    Confirm Password
                  </Label>
                </FormLabel>
                <FormControl>
                  <Input
                    id='confirmPassword'
                    type='confirmPassword'
                    placeholder='••••••••'
                    className={`w-full rounded-md border px-3 py-2`}
                    isError={!!form.formState.errors.confirmPassword}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {errors.general && (
          <div className='rounded-md bg-red-50 p-3'>
            <p className='text-sm text-red-500'>{errors.general}</p>
          </div>
        )}

        <Button type='submit' className='w-full cursor-pointer rounded-md py-2.5 text-white'>
          {isLoading ? <LoadingSpinner /> : 'Sign up'}
        </Button>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-[#d4d7e3]'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-4 text-[#8897ad]'>Or</span>
          </div>
        </div>

        <div className='space-y-3'>
          <GoogleSocialButton />
          <FacebookSocialButton />
        </div>
      </form>
    </Form>
  );
}
