import { button as buttonStyles } from '@nextui-org/theme'
import { mainSubtitle } from '@/config/site'
import { title, subtitle } from '@/components/primitives'
import NextLink from 'next/link'

export default function Home() {
  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
      <div className='inline-block max-w-xl text-center justify-center'>
        <h1 className={title()}>Make your travels</h1>
        <br />
        <h1 className={title({ color: 'yellow' })}>
          unforgettable and optimal&nbsp;
        </h1>
        <br />
        <h1 className={title()}>regardless of the mode of transportation</h1>

        <h2 className={subtitle({ class: 'mt-4' })}>{mainSubtitle}</h2>
      </div>

      <div className='flex gap-3'>
        <NextLink
          href={'/trips'}
          className={buttonStyles({
            color: 'primary',
            radius: 'full',
            variant: 'shadow',
          })}
        >
          Start organizing
        </NextLink>
      </div>
    </section>
  )
}
