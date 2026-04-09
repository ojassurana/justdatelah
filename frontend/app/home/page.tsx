'use client'

import { motion } from 'motion/react'
import {
  ArrowUpRight,
  CalendarHeart,
  Heart,
  MapPin,
  Shield,
} from 'lucide-react'
import { BlurText } from '@/components/BlurText'
import { HlsVideoBackground } from '@/components/HlsVideoBackground'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4'

const HLS_HOW =
  'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8'
const HLS_CTA =
  'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'

const TELEGRAM = 'https://t.me/JustDateLah'

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'How it works', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Sign up', href: '#signup' },
] as const

const SCHOOLS = [
  { key: 'nus', name: 'NUS', src: '/assets/nus.png', w: 80, h: 103 },
  { key: 'ntu', name: 'NTU', src: '/assets/ntu.png', w: 80, h: 103 },
  { key: 'smu', name: 'SMU', src: '/assets/smu.png', w: 80, h: 110 },
] as const

const SECTION_BADGE =
  'liquid-glass mb-4 inline-block rounded-full px-4 py-1.5 font-body text-sm font-medium text-white'

const SECTION_HEADING =
  'text-4xl font-heading italic tracking-tight text-white md:text-5xl lg:text-6xl leading-[0.9]'

const BODY =
  'font-body font-light text-base leading-relaxed text-white/70 md:text-lg'

const CAPTION = 'font-body text-sm text-white/50 md:text-base'

function VideoSectionFades() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[200px] bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px] bg-gradient-to-t from-black to-transparent" />
    </>
  )
}

function SchoolLogosRow({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  return (
    <div className={cn('flex flex-col items-center gap-5', className)}>
      {label ? (
        <p className="font-body text-sm font-medium uppercase tracking-[0.18em] text-white/55 md:text-base">
          {label}
        </p>
      ) : null}
      <div
        className="flex flex-wrap items-end justify-center gap-10 md:gap-16"
        aria-label="NUS, NTU, and SMU"
      >
        {SCHOOLS.map((s) => (
          <div
            key={s.key}
            className="flex flex-col items-center gap-3 text-center"
          >
            <img
              src={s.src}
              alt=""
              width={s.w}
              height={s.h}
              className="h-16 w-auto max-w-[80px] object-contain md:h-[5.75rem] md:max-w-[96px]"
            />
            <span className="font-body text-base font-medium text-white/85 md:text-lg">
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <p className="max-w-lg text-center font-body text-sm text-white/55 md:text-base">
        .edu.sg verified, Singapore, 18+
      </p>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-visible bg-black">
      <header className="fixed left-0 right-0 top-4 z-50 px-4 md:px-8">
        <div className="relative mx-auto flex h-14 max-w-7xl items-center">
          <a href="#home" className="relative z-10 flex shrink-0 items-center gap-2">
            <img
              src="/assets/logo-mark.svg"
              alt="JustDateLah"
              width={48}
              height={48}
              className="size-12"
            />
            <span className="hidden font-body text-base font-medium text-white/90 sm:inline">
              justdatelah
            </span>
          </a>
          <nav
            className="liquid-glass absolute left-1/2 flex max-w-[calc(100vw-10rem)] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-full px-2 py-2 md:max-w-none md:gap-1 md:px-3"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-2.5 py-1.5 font-body text-sm font-medium text-white/90 hover:bg-white/5 md:px-3 md:text-base"
              >
                {item.label}
              </a>
            ))}
            <Button
              variant="default"
              size="sm"
              className="ml-0.5 shrink-0 gap-1.5 text-sm md:text-base"
              asChild
            >
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                Join on Telegram
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </nav>
          <div className="ml-auto hidden w-8 shrink-0 sm:block md:w-12" aria-hidden />
        </div>
      </header>

      <section
        id="home"
        className="relative min-h-[920px] overflow-visible bg-black pb-16 md:h-[960px]"
      >
        <video
          className="absolute top-[20%] z-0 h-auto w-full object-contain"
          src={HERO_VIDEO}
          poster="/images/hero_bg.jpeg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 z-0 bg-black/5" />
        <div className="absolute bottom-0 left-0 right-0 z-[1] h-[300px] bg-gradient-to-b from-transparent to-black" />

        <div className="relative z-10 mx-auto flex min-h-[880px] max-w-5xl flex-col items-center px-6 pt-[150px]">
          <div className="mt-12">
            <BlurText
              text="Get a Date Every Wednesday"
              className="text-6xl font-heading italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
            className={`${BODY} mx-auto mt-8 max-w-2xl text-center`}
          >
            No swiping. One match on Telegram each week. We arrange you and your
            match at a date spot in Singapore.
          </motion.p>

          <SchoolLogosRow className="mt-10" label="Verified Universities " />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.1, ease: 'easeOut' }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button variant="liquid" size="lg" className="gap-2 px-7 text-base" asChild>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                Telegram @justdatelah to join
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </motion.div>

          <div className="mt-auto pb-6 pt-16" />
        </div>
      </section>

      <section
        id="process"
        className="relative min-h-[560px] bg-black px-6 py-24 md:px-16 lg:px-24"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HlsVideoBackground
            src={HLS_HOW}
            className="h-full w-full object-cover"
            desaturated={false}
          />
          <VideoSectionFades />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[480px] max-w-2xl flex-col items-center justify-center px-6 text-center">
          <span className={SECTION_BADGE}>How it works</span>
          <h2 className={`${SECTION_HEADING} mb-6`}>
            Your type in. We plan the date.
          </h2>
          <p className={`${BODY} mb-10 max-w-xl`}>
            Verified NUS, NTU & SMU only. We drop one match on Wednesday. Then we
            arrange you both at a date spot in Singapore and help you align on
            time.
          </p>
          <Button variant="liquid" size="lg" className="gap-2 px-7 text-base" asChild>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
              Join on Telegram
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>

      <section
        id="steps"
        className="bg-black px-6 py-24 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-6xl">
          <span className={SECTION_BADGE}>The Wednesday drop</span>
          <h2 className={`${SECTION_HEADING} mb-4 max-w-3xl`}>
            Four steps to the date.
          </h2>
          <p className="mb-16 max-w-2xl font-body font-light text-sm text-white/60 md:text-base">
            From your preferences to a real meetup: one path, no noise.
          </p>

          <div className="flex flex-col gap-20 lg:gap-28">
            {[
              {
                step: '1',
                title: 'Tell us your type',
                body: 'By Tuesday 11:59 PM (SGT), share who you\u2019re looking for: NUS, NTU & SMU only, verified .edu.sg.',
                img: '/assets/step1-singapore.png',
                alt: 'Set your preferences',
                cta: 'Join on Telegram' as const,
                reverse: false,
              },
              {
                step: '2',
                title: 'Wednesday 7pm, your match',
                body: 'One match on Telegram each week. No endless swipes. One person chosen for you, this Wednesday.',
                img: '/assets/step2-singapore.png',
                alt: 'Wednesday match on Telegram',
                cta: null,
                reverse: true,
              },
              {
                step: '3',
                title: 'We set the date',
                body: 'We arrange you both at a date spot in Singapore: caf\u00e9s, walks, dinner, and help you lock in a time that works.',
                img: '/assets/step3-singapore-cafe.png',
                alt: 'Date arranged at a spot in Singapore',
                cta: null,
                reverse: false,
              },
              {
                step: '4',
                title: 'Show up',
                body: 'Meet in person. That\u2019s the point: real chemistry, not another chat queue.',
                img: '/assets/step4-mbs-sunset.png',
                alt: 'Meet in Singapore',
                cta: null,
                reverse: true,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={cn(
                  'flex flex-col gap-10 lg:items-center lg:gap-14',
                  item.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row',
                )}
              >
                <div className="min-w-0 flex-1 lg:max-w-[48%]">
                  <span className="font-body text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                    Step {item.step}
                  </span>
                  <h3 className="mt-3 font-heading text-2xl italic leading-[0.95] tracking-tight text-white md:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-body font-light text-sm leading-relaxed text-white/60 md:text-base">
                    {item.body}
                  </p>
                  {item.cta ? (
                    <div className="mt-8">
                      <Button
                        variant="liquid"
                        size="lg"
                        className="gap-2 px-7 text-base"
                        asChild
                      >
                        <a
                          href={TELEGRAM}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.cta}
                          <ArrowUpRight className="size-4" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 lg:max-w-[52%]">
                  <div className="liquid-glass relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-[16/10]">
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="bg-black px-6 py-20 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <span className={SECTION_BADGE}>Why us</span>
          <h2 className={`${SECTION_HEADING} mb-12 max-w-3xl`}>
            Built for student dates in SG.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: 'No swiping',
                body: 'One match per week.',
              },
              {
                icon: CalendarHeart,
                title: 'Wed 7pm',
                body: 'Drop on Telegram.',
              },
              {
                icon: MapPin,
                title: 'In Singapore',
                body: 'We arrange the venue. You show up.',
              },
              {
                icon: Shield,
                title: '.edu.sg',
                body: 'NUS, NTU, SMU only.',
              },
            ].map((card) => (
              <div key={card.title} className="liquid-glass rounded-2xl p-7">
                <div className="liquid-glass-strong mb-5 flex size-11 items-center justify-center rounded-full">
                  <card.icon className="size-5 text-white" />
                </div>
                <h3 className="mb-2 font-heading text-xl italic text-white md:text-2xl">
                  {card.title}
                </h3>
                <p className={`${BODY} !text-base md:!text-[1.125rem]`}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-black px-6 py-20 md:px-16 lg:px-24">
        <div className="mx-auto max-w-3xl">
          <span className={SECTION_BADGE}>FAQ</span>
          <h2 className={`${SECTION_HEADING} mb-10`}>Quick answers.</h2>
          <div className="space-y-3">
            {[
              {
                q: 'How does pairing work?',
                a: 'We match verified NUS, NTU & SMU students from profiles and preferences, then arrange you at a date spot in Singapore. Join on Telegram, share your type, get your Wednesday drop.',
              },
              {
                q: 'What do I see before the date?',
                a: 'Photos, a short why you two blurb, and we coordinate time once we\u2019ve arranged your date spot.',
              },
              {
                q: 'Who can join?',
                a: 'Enrolled NUS, NTU, or SMU students, 18+, verified .edu.sg. Singapore only.',
              },
              {
                q: 'Where do we meet?',
                a: 'We arrange you at a date spot in Singapore: caf\u00e9s, walks, dinner, and align timing with you and your match.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group liquid-glass rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-base font-medium text-white md:text-lg">
                  {item.q}
                  <span className="text-xl text-white/40 transition group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className={`${BODY} mt-4 border-t border-white/10 pt-4 !text-base md:!text-lg`}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="signup"
        className="relative min-h-[520px] bg-black py-24"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HlsVideoBackground
            src={HLS_CTA}
            className="h-full w-full object-cover"
          />
          <VideoSectionFades />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-12">
          <h2 className="font-heading text-4xl italic tracking-tight text-white md:text-6xl lg:text-7xl leading-[0.9]">
            Sign up for Wednesday.
          </h2>
          <p className={`${BODY} mx-auto mt-8 max-w-xl`}>
            Telegram or email. One match a week, three schools only.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="liquid" size="lg" className="gap-2 px-7 text-base" asChild>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                @JustDateLah
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button variant="default" size="lg" className="px-7 text-base" asChild>
              <a href="mailto:hello@justdatelah.sg?subject=JustDateLah%20signup">
                hello@justdatelah.sg
              </a>
            </Button>
          </div>

          <footer
            id="contact"
            className="mt-20 border-t border-white/10 pt-10 text-sm text-white/45 md:text-base"
          >
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span>&copy; 2026 JustDateLah</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white/70">
                  Privacy
                </a>
                <a href="#" className="hover:text-white/70">
                  Terms
                </a>
                <a
                  href="mailto:hello@justdatelah.sg"
                  className="hover:text-white/70"
                >
                  Contact
                </a>
              </div>
            </div>
            <p className={`${CAPTION} mx-auto mt-6 max-w-md text-center`}>
              Not affiliated with NUS, NTU, or SMU.
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}
