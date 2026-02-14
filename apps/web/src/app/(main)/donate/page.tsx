'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  Landmark,
  Check,
  Shield,
  Eye,
  FileText,
  Mail,
  User,
  Phone,
  MessageCircle,
  Bell,
} from 'lucide-react';
import {
  CountUp,
  HeroSequence,
  Reveal,
  StaggerContainer,
  StaggerItem,
} from '../../../components/motion';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';

const tiers = [
  {
    id: 'community-advocate',
    name: 'Community Advocate',
    amount: 25,
    description: 'Support the foundation of community-led work',
    icon: Heart,
    benefits: [
      'Quarterly impact updates',
      'Community project briefs',
      'Supporter recognition (optional)',
    ],
    impact: 'Funds training materials for one household',
  },
  {
    id: 'project-catalyst',
    name: 'Project Catalyst',
    amount: 100,
    description: 'Accelerate community-led restoration',
    icon: Users,
    featured: true,
    benefits: [
      'Everything in Community Advocate',
      'Direct project updates',
      'Annual impact report',
    ],
    impact: 'Supports tree planting for a community cooperative',
  },
  {
    id: 'systemic-reformer',
    name: 'Systemic Reformer',
    amount: 500,
    description: 'Advance market reform',
    icon: Landmark,
    benefits: [
      'Everything in Project Catalyst',
      'Early access to research',
      'Strategy briefings with our team',
    ],
    impact: 'Funds policy advocacy for market reform',
  },
];

const faqs = [
  {
    q: 'How is my donation used?',
    a: 'We set pilot targets to direct the majority of funding toward community-led work. We publish transparent allocation updates as pilots progress.',
  },
  {
    q: 'Can I cancel my monthly donation?',
    a: 'Yes. You can cancel anytime via the link in your confirmation email or by contacting us.',
  },
  {
    q: 'Is my donation tax-deductible?',
    a: 'GreenShillings is a registered non-profit. Tax deductibility depends on your jurisdiction.',
  },
  {
    q: 'How will I know my impact?',
    a: 'Supporters receive quarterly impact updates, with optional SMS or WhatsApp milestone alerts.',
  },
];

type Step = 'select' | 'details' | 'confirm';

export default function DonatePage() {
  const [step, setStep] = useState<Step>('select');
  const [selectedTier, setSelectedTier] = useState('project-catalyst');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [donationComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notificationChannel: 'email' as 'email' | 'sms' | 'whatsapp' | 'all',
    receiveMilestoneUpdates: true,
  });

  const selectedTierData = tiers.find((t) => t.id === selectedTier);
  const customValue = customAmount ? Number.parseFloat(customAmount) : NaN;
  const donationAmount = Number.isFinite(customValue)
    ? Math.round(customValue)
    : selectedTierData?.amount || 0;

  const handleContinue = () => {
    if (step === 'select') setStep('details');
    else if (step === 'details') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'details') setStep('select');
    else if (step === 'confirm') setStep('details');
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const handleStripeCheckout = async () => {
    setSubmitError(null);

    if (!formData.email || donationAmount <= 0) {
      setSubmitError('Please enter a valid donation amount and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone || undefined,
          preferredChannel: formData.notificationChannel,
          frequency: frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Something went wrong.');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate impact allocation
  const communityAmount = Math.round(donationAmount * 0.8);
  const operationsAmount = Math.round(donationAmount * 0.15);
  const advocacyAmount = donationAmount - communityAmount - operationsAmount;

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-charcoal">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-18 relative z-10 w-full">
          <HeroSequence className="max-w-3xl">
            <div>
              <div className="flex items-center gap-3 mb-6 text-forest/70" data-hero>
                <span className="h-2 w-2 rounded-full bg-leaf" />
                <span className="section-label">Donate</span>
              </div>

              <h1 className="mb-6 text-charcoal text-balance text-4xl md:text-5xl lg:text-6xl" data-hero>
                Fund community-led restoration
              </h1>

              <p
                className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-6 max-w-prose"
                data-hero
              >
                Your donation goes directly to Tanzanian communities and the work that protects their
                share.
              </p>

              <div
                className="inline-flex items-center gap-3 rounded-full border-2 border-forest/10 bg-white px-5 py-2 text-sm text-forest/80"
                data-hero
              >
                <CountUp value={80} suffix="%" className="font-semibold text-forest" />
                <span>pilot target for community-directed funding.</span>
              </div>

              <div className="mt-8 flex" data-hero>
                <button
                  onClick={() => {
                    setStep('select');
                    document.getElementById('donation-steps')?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className="btn-pill-primary"
                >
                  Choose a tier
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </HeroSequence>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-chalk">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-forest text-white p-6 md:p-7 shadow-[0_24px_50px_rgba(10,28,20,0.2)]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">Funding split</p>
            <p className="text-2xl font-display mb-2">Pilot funding targets</p>
            <p className="text-sm text-white/80 max-w-prose">
              Targeting majority community value share in pilot budgets, with transparent reporting
              on allocations.
            </p>
          </div>

          <div className="rounded-3xl bg-white border-2 border-forest/10 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-forest/70 mb-3">Stewardship</p>
            <p className="text-2xl font-display text-forest mb-2">Quarterly reporting</p>
            <p className="text-sm text-charcoal/70 max-w-prose">
              Donors receive transparent updates and community-approved impact stories.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Allocation Visualization */}
      <section className="py-14 md:py-20 bg-chalk">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="surface-glass rounded-3xl p-8 md:p-10">
              <p className="section-label text-center mb-4">Where your donation goes</p>
              <p className="text-xs text-center text-gray-400 mb-8">
                Pilot targets only — allocations published as pilots progress.
              </p>

              {/* Impact Bar */}
              <div className="mb-8">
                <div className="h-4 rounded-full overflow-hidden flex bg-chalk border-2 border-forest/10">
                  <div className="bg-forest h-full" style={{ width: '80%' }} />
                  <div className="bg-citrus h-full" style={{ width: '15%' }} />
                  <div className="bg-leaf h-full" style={{ width: '5%' }} />
                </div>
              </div>

              {/* Allocation breakdown */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-display text-forest mb-1">80%</div>
                  <div className="text-sm text-gray-500">Community target</div>
                  {donationAmount > 0 && (
                    <div className="text-xs text-forest mt-1">${communityAmount}</div>
                  )}
                </div>
                <div>
                  <div className="text-3xl font-display text-citrus mb-1">15%</div>
                  <div className="text-sm text-gray-500">Operations target</div>
                  {donationAmount > 0 && (
                    <div className="text-xs text-citrus mt-1">${operationsAmount}</div>
                  )}
                </div>
                <div>
                  <div className="text-3xl font-display text-leaf mb-1">5%</div>
                  <div className="text-sm text-gray-500">Advocacy target</div>
                  {donationAmount > 0 && (
                    <div className="text-xs text-leaf mt-1">${advocacyAmount}</div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Multi-Step Donation Flow */}
      <section id="donation-steps" className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Step Indicator */}
          <div className="max-w-xl mx-auto mb-20">
            <div className="step-indicator">
              <div className={`step-dot ${step === 'select' ? 'active' : 'completed'}`}>1</div>
              <div className={`step-line ${step !== 'select' ? 'completed' : ''}`} />
              <div
                className={`step-dot ${step === 'details' ? 'active' : step === 'confirm' ? 'completed' : ''}`}
              >
                2
              </div>
              <div className={`step-line ${step === 'confirm' ? 'completed' : ''}`} />
              <div className={`step-dot ${step === 'confirm' ? 'active' : ''}`}>3</div>
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>Choose tier</span>
              <span>Your details</span>
              <span>Confirm</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Select Tier - Impact Selector */}
            {step === 'select' && (
              <motion.div
                key="select"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Frequency Toggle */}
                <div className="flex justify-center mb-16">
                  <Tabs
                    value={frequency}
                    onValueChange={(v) => setFrequency(v as 'monthly' | 'one-time')}
                  >
                    <TabsList className="bg-white border border-forest/10">
                      <TabsTrigger
                        value="monthly"
                        className="data-[state=active]:bg-forest data-[state=active]:text-white"
                      >
                        Monthly
                      </TabsTrigger>
                      <TabsTrigger
                        value="one-time"
                        className="data-[state=active]:bg-forest data-[state=active]:text-white"
                      >
                        One-time
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <p className="section-label text-center mb-6">Choose your impact level</p>
                <h2 className="text-center mb-16">Pick a tier or enter a custom amount</h2>

                {/* Impact Selector Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                  {tiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = selectedTier === tier.id;
                    const isFeatured = tier.featured;

                    return (
                      <motion.div
                        key={tier.id}
                        onClick={() => {
                          setSelectedTier(tier.id);
                          setCustomAmount('');
                        }}
                        whileHover={{ y: -4 }}
                        className={`relative cursor-pointer p-8 rounded-lg transition-all duration-300 ${
                          isFeatured
                            ? 'bg-forest text-white'
                            : isSelected
                              ? 'bg-white border-2 border-forest'
                              : 'bg-white border border-forest/10'
                        }`}
                      >
                        {isFeatured && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-4 py-1 bg-white text-forest text-xs font-medium rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <Icon
                          className={`w-6 h-6 mb-6 ${isFeatured ? 'text-white/70' : 'text-forest'}`}
                          strokeWidth={1}
                        />

                        <h3
                          className={`text-xl font-medium mb-2 ${isFeatured ? 'text-white' : 'text-forest'}`}
                        >
                          {tier.name}
                        </h3>

                        <p
                          className={`text-sm mb-6 ${isFeatured ? 'text-white/70' : 'text-gray-500'}`}
                        >
                          {tier.description}
                        </p>

                        <div
                          className={`text-4xl font-serif mb-2 ${isFeatured ? 'text-white' : 'text-forest'}`}
                        >
                          ${tier.amount}
                          <span
                            className={`text-base font-sans ${isFeatured ? 'text-white/50' : 'text-gray-400'}`}
                          >
                            {frequency === 'monthly' ? '/mo' : ''}
                          </span>
                        </div>

                        <p
                          className={`text-xs mb-8 ${isFeatured ? 'text-white/60' : 'text-forest/60'}`}
                        >
                          {tier.impact}
                        </p>

                        <ul className="space-y-3 mb-8">
                          {tier.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-sm">
                              <Check
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  isFeatured ? 'text-white/60' : 'text-forest'
                                }`}
                                strokeWidth={1}
                              />
                              <span className={isFeatured ? 'text-white/80' : 'text-gray-600'}>
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div
                          className={`w-full py-3.5 rounded-full font-medium text-center transition-all duration-300 ${
                            isFeatured
                              ? 'bg-white text-forest'
                              : isSelected
                                ? 'bg-forest text-white'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {isSelected || isFeatured ? 'Selected' : 'Select'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Custom Amount */}
                <div className="max-w-md mx-auto">
                  <div className="card-ghost p-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Or enter a custom amount
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedTier('');
                          }}
                          placeholder="0"
                          className="input-premium pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-center mt-16">
                  <button
                    onClick={handleContinue}
                    disabled={!donationAmount}
                    className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to details
                    <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Your Details */}
            {step === 'details' && (
              <motion.div
                key="details"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto"
              >
                <h2 className="text-center mb-4">Your details</h2>
                <p className="text-center text-gray-500 mb-12">
                  We use this for receipts and updates.
                </p>

                {/* Summary Card */}
                <div className="card-ghost p-8 mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Your donation</p>
                      <p className="text-2xl font-serif text-forest">
                        ${donationAmount}
                        <span className="text-base font-sans text-gray-400">
                          {frequency === 'monthly' ? '/month' : ' one-time'}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={handleBack}
                      className="text-forest hover:text-forest/80 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="card-ghost p-8">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="donate-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                        First name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                          strokeWidth={1}
                        />
                        <input
                          id="donate-first-name"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="input-premium pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="donate-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Last name
                      </label>
                      <input
                        id="donate-last-name"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className="input-premium"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="donate-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        strokeWidth={1}
                      />
                      <input
                        id="donate-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="input-premium pl-10"
                      />
                    </div>
                  </div>

                  {/* Milestone Notifications Section */}
                  <div className="pt-6 border-t border-forest/10">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="w-5 h-5 text-forest" strokeWidth={1} />
                      <div>
                        <h4 className="font-medium text-forest">Milestone Updates</h4>
                        <p className="text-sm text-gray-500">
                          Get notified when your contribution creates real impact in the field
                        </p>
                      </div>
                    </div>

                    {/* Opt-in checkbox */}
                    <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.receiveMilestoneUpdates}
                          onChange={(e) =>
                            setFormData({ ...formData, receiveMilestoneUpdates: e.target.checked })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border border-forest/30 rounded transition-colors peer-checked:bg-forest peer-checked:border-forest group-hover:border-forest" />
                        <Check
                          className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-700">
                          Yes, notify me when project milestones are reached
                        </span>
                        <p className="text-gray-400 mt-1">
                          Receive instant updates when trees are planted, communities are trained,
                          or carbon is verified
                        </p>
                      </div>
                    </label>

                    {formData.receiveMilestoneUpdates && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {/* Phone number for SMS/WhatsApp */}
                        <div>
                          <label htmlFor="donate-phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone number{' '}
                            <span className="text-gray-400 font-normal">(for SMS/WhatsApp)</span>
                          </label>
                          <div className="relative">
                            <Phone
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                              strokeWidth={1}
                            />
                            <input
                              id="donate-phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 (555) 000-0000"
                              className="input-premium pl-10"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Include country code for international numbers
                          </p>
                        </div>

                        {/* Notification channel preference */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            How would you like to receive updates?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: 'email', label: 'Email only', icon: Mail },
                              { value: 'sms', label: 'SMS', icon: Phone },
                              { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                              { value: 'all', label: 'All channels', icon: Bell },
                            ].map(({ value, label, icon: Icon }) => (
                              <label
                                key={value}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  formData.notificationChannel === value
                                    ? 'border-forest bg-chalk'
                                    : 'border-forest/10 hover:border-forest/30'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="notificationChannel"
                                  value={value}
                                  checked={formData.notificationChannel === value}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      notificationChannel: e.target.value as
                                        | 'email'
                                        | 'sms'
                                        | 'whatsapp'
                                        | 'all',
                                    })
                                  }
                                  className="sr-only"
                                />
                                <Icon
                                  className={`w-4 h-4 ${
                                    formData.notificationChannel === value
                                      ? 'text-forest'
                                      : 'text-gray-400'
                                  }`}
                                  strokeWidth={1}
                                />
                                <span
                                  className={`text-sm ${
                                    formData.notificationChannel === value
                                      ? 'text-forest font-medium'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={handleBack} className="btn-secondary flex-1">
                      <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={!formData.firstName || !formData.lastName || !formData.email}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to confirm
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <motion.div
                key="confirm"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto"
              >
                {donationComplete ? (
                  <div className="card-ghost p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-leaf flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-charcoal" strokeWidth={1.5} />
                    </div>
                    <h2 className="mb-4">Redirecting to payment...</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      You should be redirected to Stripe to complete your{' '}
                      <strong className="text-forest">${donationAmount}</strong> donation.
                      If not, please try again.
                    </p>
                    <Link href="/" className="btn-pill-primary">
                      Return home
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="text-center mb-4">Confirm your donation</h2>
                    <p className="text-center text-gray-500 mb-12">
                      Review your details and confirm below.
                    </p>

                    {/* Summary Card with Impact Breakdown */}
                    <div className="card-ghost p-8 mb-8">
                      <div className="flex justify-between items-center mb-6 pb-6 border-b border-forest/10">
                        <div>
                          <p className="font-medium text-forest">
                            {selectedTierData?.name || 'Custom amount'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {frequency === 'monthly' ? 'Monthly' : 'One-time'} donation
                          </p>
                        </div>
                        <p className="text-3xl font-serif text-forest">${donationAmount}</p>
                      </div>

                      {/* Impact breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">To community projects</span>
                          <span className="text-forest font-medium">${communityAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Operations</span>
                          <span className="text-gray-600">${operationsAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Advocacy & research</span>
                          <span className="text-gray-600">${advocacyAmount}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-forest/10 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Name</span>
                          <span className="text-gray-700">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email</span>
                          <span className="text-gray-700">{formData.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-ghost p-8">
                      <p className="text-sm text-gray-600 mb-6">
                        You&apos;ll be redirected to Stripe to complete your donation securely.
                        Your payment details are handled entirely by Stripe.
                      </p>

                      {submitError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
                          {submitError}
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button onClick={handleBack} className="btn-secondary flex-1">
                          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                          Back
                        </button>
                        <button
                          onClick={handleStripeCheckout}
                          disabled={isSubmitting || donationAmount <= 0}
                          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart className="w-4 h-4" strokeWidth={1.5} />
                          {isSubmitting ? 'Redirecting…' : `Proceed to secure payment`}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <p className="section-label text-center mb-6">Our commitment</p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-center mb-8">Integrity you can verify</h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg text-gray-500 mb-14 text-center max-w-2xl mx-auto">
              Trust is earned through transparency, not promises.
            </p>
          </Reveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                icon: Shield,
                title: 'Standards-Aligned',
                description: 'Working within Verra VCS, Gold Standard, and Plan Vivo frameworks.',
              },
              {
                icon: Eye,
                title: 'Full Transparency',
                description:
                  'Project economics and methodologies documented and available. No hidden fees.',
              },
              {
                icon: FileText,
                title: 'Regular Reporting',
                description: 'Quarterly impact reports with detailed allocation breakdowns.',
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="surface-glass rounded-2xl p-7 text-center h-full">
                  <item.icon className="w-5 h-5 text-forest mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-lg text-forest mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-24 bg-sand">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center mb-16">Common questions</h2>
          </Reveal>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="surface-glass rounded-2xl px-6 border-0"
              >
                <AccordionTrigger className="text-left font-medium text-forest hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="mb-8">Ready to make a difference?</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xl text-gray-500 mb-16 max-w-xl mx-auto">
              Join supporters building a fairer carbon market that puts communities first.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  setStep('select');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="btn-pill-primary"
              >
                Choose your tier
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <Link href="/contact" className="btn-pill-secondary">
                Talk to our team
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
