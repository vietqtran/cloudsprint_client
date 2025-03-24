import { SignInForm } from '@/components/auth/SignInForm';
import Image from 'next/image';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className='flex min-h-screen'>
      <div className='flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24'>
        <div className='mx-auto w-full max-w-sm'>
          <h1 className='text-3xl font-bold tracking-tight text-[#0c1421]'>
            Welcome Back <span className='inline-block'>👋</span>
          </h1>
          <p className='mt-3 text-[#8897ad]'>
            Today is a new day. It&apos;s your day. You shape it.
            <br />
            Sign in to start managing your projects.
          </p>

          <SignInForm />

          <p className='mt-8 text-center text-sm text-[#8897ad]'>
            Don&apos;t you have an account?{' '}
            <Link href='/sign-up' className='font-medium text-[#1e4ae9] hover:underline'>
              Sign up
            </Link>
          </p>

          <p className='mt-10 text-center text-xs text-[#959cb6]'>© 2025 ALL RIGHTS RESERVED</p>
        </div>
      </div>

      <div className='hidden lg:block lg:w-1/2 relative'>
        <div className='relative h-screen w-full bg-[#f7fbff] sticky top-0 left-0 right-0'>
          <Image
            src='/image.png'
            alt='Decorative background'
            width={5000}
            height={5000}
            className='h-full w-full object-cover'
            priority
          />
        </div>
      </div>
    </div>
  );
}
