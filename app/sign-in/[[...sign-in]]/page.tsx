import { SignIn } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className='flex justify-center p5'>
      <SignIn path={'/sign-in'} />
    </div>
  )
}
