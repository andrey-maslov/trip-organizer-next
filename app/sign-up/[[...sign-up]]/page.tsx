import { SignUp } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className='flex justify-center p5'>
      <SignUp path={'/sign-up'} />
    </div>
  )
}
