import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { HeroSequence, Reveal } from '../../../../components/motion';

export default function DonateSuccessPage() {
  return (
    <div className="flex flex-col bg-white">
      <section className="relative overflow-hidden bg-white text-charcoal">
        <div className="absolute inset-0 bg-topo opacity-[0.06]" />
        <div className="absolute -top-12 right-10 h-32 w-32 md:h-48 md:w-48 bg-leaf rounded-[32%]" />
        <div className="absolute bottom-12 left-8 h-28 w-28 md:h-40 md:w-40 bg-forest rounded-full" />
        <div className="absolute bottom-20 right-1/3 h-20 w-20 md:h-28 md:w-28 bg-citrus rounded-2xl" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10 w-full">
          <HeroSequence className="grid gap-10">
            <div className="inline-flex items-center gap-3 text-forest/70" data-hero>
              <span className="h-2 w-2 rounded-full bg-leaf" />
              <span className="section-label">Payment confirmed</span>
            </div>

            <h1 className="text-ink text-balance" data-hero>
              Thank you for backing community-led restoration.
            </h1>

            <p
              className="text-lg md:text-xl text-charcoal/70 leading-relaxed max-w-prose"
              data-hero
            >
              Your payment has been processed successfully. Your contribution helps communities
              in Tanzania restore land, build resilient livelihoods, and document climate impact
              with integrity.
            </p>

            <Reveal className="grid gap-4 sm:grid-cols-2" data-hero>
              <div className="rounded-3xl border border-forest/10 bg-white p-6">
                <div className="flex items-center gap-3 text-forest mb-3">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">Payment processed</p>
                </div>
                <p className="text-sm text-charcoal/70">
                  Your donation has been securely processed via Stripe. A receipt has been
                  sent to your email address.
                </p>
              </div>
              <div className="rounded-3xl border border-forest/10 bg-white p-6">
                <div className="flex items-center gap-3 text-forest mb-3">
                  <CheckCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">Impact updates</p>
                </div>
                <p className="text-sm text-charcoal/70">
                  You will receive quarterly updates and milestone alerts if you opted in.
                </p>
              </div>
            </Reveal>

            <div className="flex flex-wrap gap-4" data-hero>
              <Link href="/integrity" className="btn-primary">
                Integrity overview
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/" className="btn-secondary">
                Back to home
              </Link>
            </div>
          </HeroSequence>
        </div>
      </section>
    </div>
  );
}
