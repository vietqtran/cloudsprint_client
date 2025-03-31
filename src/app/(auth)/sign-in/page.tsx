import { SignInForm } from '@/components/auth/SignInForm';
import CustomLink from '@/components/ui/link';

export default function SignInPage() {
  return (
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
          Don&apos;t you have an account? <CustomLink href='/sign-up' text='Sign up' />
        </p>

        <p className='mt-10 text-center text-xs text-[#959cb6]'>© 2025 ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
}
