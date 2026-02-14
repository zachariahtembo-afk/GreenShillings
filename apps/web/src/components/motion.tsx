'use client';

import { useRef, ReactNode } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

interface HeroSequenceProps {
  children: ReactNode;
  className?: string;
}

interface CountUpProps {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

interface PinnedSectionProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export function Reveal({ children, className, delay = 0, duration = 0.6, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(element, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(element, { opacity: 0, y, willChange: 'transform, opacity' });
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { dependencies: [delay, duration, y], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function HeroSequence({ children, className }: HeroSequenceProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-hero]', element);
      const cards = gsap.utils.toArray<HTMLElement>('[data-hero-card]', element);
      if (!items.length && !cards.length) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set([...items, ...cards], { opacity: 1, y: 0, scale: 1 });
        return;
      }
      if (items.length) {
        gsap.set(items, { opacity: 0, y: 20, willChange: 'transform, opacity' });
      }
      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 28, scale: 0.98, willChange: 'transform, opacity' });
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 70%',
          once: true,
        },
      });
      if (items.length) {
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
        });
      }
      if (cards.length) {
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.12,
          },
          items.length ? '-=0.45' : 0,
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function CountUp({
  value,
  className,
  duration = 1.4,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const update = (val: number) => {
        element.textContent = `${prefix}${formatter.format(val)}${suffix}`;
      };
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        update(value);
        return;
      }
      const counter = { value: 0 };
      update(0);
      gsap.to(counter, {
        value,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: () => update(counter.value),
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { dependencies: [value, duration, delay, suffix, prefix, decimals], scope: ref },
  );

  return <span ref={ref} className={className} />;
}

export function PinnedSection({ left, right, className }: PinnedSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const pinned = element.querySelector<HTMLElement>('[data-pin]');
      const content = element.querySelector<HTMLElement>('[data-pin-content]');
      if (!pinned || !content) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const offset = Math.max(0, content.offsetHeight - pinned.offsetHeight);
        if (!offset) return;
        gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top top+=120',
            end: () => `+=${offset}`,
            pin: pinned,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <div data-pin>{left}</div>
      <div data-pin-content>{right}</div>
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const items = Array.from(element.querySelectorAll<HTMLElement>('[data-gsap-stagger]'));
      if (!items.length) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(items, { opacity: 0, y: 20, willChange: 'transform, opacity' });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: staggerDelay,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { dependencies: [staggerDelay], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-gsap-stagger className={className}>
      {children}
    </div>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
      const distance = 80 * speed;
      gsap.to(element, {
        y: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { dependencies: [speed], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(element, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            once: true,
          },
        },
      );
    },
    { dependencies: [delay], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
