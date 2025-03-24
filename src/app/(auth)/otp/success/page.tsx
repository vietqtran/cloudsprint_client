'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useRouter,useSearchParams } from 'next/navigation';

export default function OtpSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className='mx-auto max-w-md space-y-8 px-4 py-12 text-center'>
      <div className='flex justify-center'>
        <div className='rounded-full bg-green-100 p-3'>
          <CheckCircle className='h-12 w-12 text-green-600' />
        </div>
      </div>

      <div className='space-y-2'>
        <h1 className='text-2xl font-bold text-[#313957]'>Verification Code Sent</h1>
        <p className='text-[#8897ad]'>
          We&apos;ve sent a 6-digit verification code to{' '}
          <span className='font-medium text-[#313957]'>{email}</span>
        </p>
        <p className='text-[#8897ad]'>
          Please check your email and enter the code on the next screen to reset your password.
        </p>
      </div>

      <div className='space-y-4'>
        <Button
          className='w-full cursor-pointer rounded-md bg-[#162d3a] py-2.5 text-white hover:bg-[#122b31] focus:outline-none focus:ring-2 focus:ring-[#294957] focus:ring-offset-2'
          onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}`)}
        >
          Continue
        </Button>

        <button
          type='button'
          className='text-sm cursor-pointer text-[#1e4ae9] hover:underline'
          onClick={() => router.push('/sign-in')}
        >
          Back to Sign in
        </button>
      </div>

      <div className='rounded-md bg-blue-50 p-4'>
        <p className='text-sm text-blue-800'>
          <span className='font-semibold'>Tip:</span> If you don&apos;t see the email in your inbox,
          please check your spam folder.
        </p>
      </div>
    </div>
  );
}
