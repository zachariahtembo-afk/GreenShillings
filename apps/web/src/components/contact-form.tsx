'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../lib/i18n/language-context';

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  message: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

type ContactFormProps = {
  source: string;
  submitLabel?: string;
  className?: string;
};

const initialState: FormState = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  role: '',
  message: '',
};

export function ContactForm({
  source,
  submitLabel,
  className = '',
}: ContactFormProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const endpoint = '/api/contact';

  const resolvedSubmitLabel = submitLabel || t.contactForm.sendMessage;

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (status === 'error') {
        setStatus('idle');
        setErrorMessage(null);
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          organization: form.organization || undefined,
          role: form.role || undefined,
          message: form.message,
          source,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }

      setForm(initialState);
      setStatus('success');
    } catch (error) {
      console.error('Failed to submit contact form', error);
      setErrorMessage(t.contactForm.errorMessage);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`${className}`}>
        <div className="card-bento p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-leaf flex items-center justify-center mx-auto mb-5">
            <Check className="h-6 w-6 text-charcoal" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">{t.contactForm.messageSent}</h3>
          <p className="text-gray-600 mb-6">
            {t.contactForm.thankYou}
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-sm text-forest hover:text-forest-600 font-semibold transition-colors"
          >
            {t.contactForm.sendAnother}
          </button>
        </div>
      </div>
    );
  }

  const inputClasses =
    'w-full rounded-xl border-2 border-forest/10 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 outline-none transition-all duration-300';

  return (
    <form className={`space-y-5 ${className}`} onSubmit={handleSubmit}>
      {/* Name and Email row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contactForm.fullName} <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={handleChange('fullName')}
            className={inputClasses}
            placeholder={t.contactForm.yourName}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contactForm.email} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange('email')}
            className={inputClasses}
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Organization and Role row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contactForm.organization}
          </label>
          <input
            id="organization"
            type="text"
            value={form.organization}
            onChange={handleChange('organization')}
            className={inputClasses}
            placeholder={t.contactForm.yourOrg}
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contactForm.role}
          </label>
          <input
            id="role"
            type="text"
            value={form.role}
            onChange={handleChange('role')}
            className={inputClasses}
            placeholder={t.contactForm.yourRole}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          {t.contactForm.message} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange('message')}
          className={`${inputClasses} resize-none`}
          placeholder={t.contactForm.messagePlaceholder}
        />
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <div className="rounded-xl bg-error-50 border border-error-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-error-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-pill-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.contactForm.sending}
          </>
        ) : (
          resolvedSubmitLabel
        )}
      </button>
    </form>
  );
}
