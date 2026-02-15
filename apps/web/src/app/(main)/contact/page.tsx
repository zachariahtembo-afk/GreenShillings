'use client';

import { Mail, Building2, ArrowRight } from 'lucide-react';
import { ContactForm } from '../../../components/contact-form';
import { HeroSequence, Reveal, StaggerContainer, StaggerItem } from '../../../components/motion';
import { NucleoIcon } from '../../../components/nucleo-icon';
import { useLanguage } from '../../../lib/i18n/language-context';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col bg-chalk">
      {/* Hero Section */}
      <section className="relative bg-chalk text-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6 text-forest/70" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label">{t.contact.sectionLabel}</span>
              </div>

              <h1 className="mb-6 text-ink text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                {t.contact.heroHeadline}
              </h1>

              <p
                className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-8 max-w-prose"
                data-hero
              >
                {t.contact.heroDescription}
              </p>

              <div
                className="inline-flex items-center gap-3 rounded-full border-2 border-forest/10 bg-white px-4 py-2 text-sm text-forest/80 mb-8"
                data-hero
              >
                <NucleoIcon name="clock" size={16} className="text-forest" label="Clock" />
                <span>{t.contact.responseTime}</span>
              </div>

              <a href="#contact-form" className="btn-primary group" data-hero>
                {t.contact.sendAMessage}
                <ArrowRight
                  className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </HeroSequence>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-forest text-white p-6 md:p-7 shadow-[0_24px_50px_rgba(10,28,20,0.2)]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">{t.contact.responseTimeLabel}</p>
            <p className="text-2xl font-display mb-2">{t.contact.fiveBusinessDays}</p>
            <p className="text-sm text-white/80 max-w-prose">
              {t.contact.responseTimeDesc}
            </p>
          </div>

          <div className="rounded-3xl bg-white border-2 border-forest/10 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-3">{t.contact.directEmail}</p>
            <p className="text-xl font-semibold text-forest mb-2">hello@greenshilling.org</p>
            <p className="text-sm text-charcoal/70 max-w-prose">
              {t.contact.directEmailDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Contact form and info */}
      <section id="contact-form" className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form side */}
            <Reveal>
              <div className="rounded-3xl p-8 md:p-10 border-2 border-forest/10 bg-chalk">
                <h2 className="text-2xl mb-4">{t.contact.sendUsAMessage}</h2>
                <p className="text-sm text-gray-500 mb-8">
                  {t.contact.weRespondWithin}
                </p>
                <ContactForm source="contact" submitLabel={t.contactForm.sendMessage} />
              </div>
            </Reveal>

            {/* Info side */}
            <div className="space-y-6">
              <StaggerContainer staggerDelay={0.1}>
                <StaggerItem>
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-chalk border-2 border-forest/10">
                    <NucleoIcon name="clock" size={20} className="text-forest" label="Clock" />
                    <p className="text-sm text-gray-600">
                      {t.contact.typicalResponse}
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="rounded-2xl p-6 md:p-7 border-2 border-forest/10 bg-white">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-leaf flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-charcoal" strokeWidth={1} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-forest mb-2">{t.contact.preferEmail}</h3>
                        <p className="text-gray-500 mb-3">{t.contact.reachUsDirectly}</p>
                        <a
                          href="mailto:hello@greenshilling.org"
                          className="text-lg text-forest font-semibold hover:text-forest-600 transition-colors"
                        >
                          hello@greenshilling.org
                        </a>
                      </div>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="rounded-2xl p-6 md:p-7 border-2 border-forest/10 bg-white">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-full bg-citrus flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-charcoal" strokeWidth={1} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-forest mb-2">
                          {t.contact.partnerBriefings}
                        </h3>
                        <p className="text-gray-500 max-w-prose">
                          {t.contact.partnerBriefingsDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-chalk border-2 border-forest/10">
                    <p className="text-sm text-gray-600">{t.contact.registeredNGO}</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
