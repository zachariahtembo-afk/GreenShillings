import { redirect } from 'next/navigation';
import { ShieldCheck, ChevronRight, CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';
import { auth, type SessionWithPortal } from '../../../../lib/auth';

// Verification requirements by standard
const verificationStandards = [
  {
    standard: 'Verra VCS',
    project: 'Iringa Agroforestry Pilot',
    projectId: 'salima-agroforestry',
    total: 12,
    completed: 2,
    inProgress: 3,
    flagged: 0,
    categories: [
      {
        name: 'Project Documentation',
        items: [
          { requirement: 'Project Description (PD)', status: 'completed' },
          { requirement: 'Monitoring Report', status: 'in_progress' },
          { requirement: 'Validation Report', status: 'not_started' },
          { requirement: 'Verification Report', status: 'not_started' },
        ],
      },
      {
        name: 'Stakeholder Engagement',
        items: [
          { requirement: 'Free Prior and Informed Consent (FPIC)', status: 'completed' },
          { requirement: 'Stakeholder Consultation Report', status: 'in_progress' },
          { requirement: 'Grievance Mechanism', status: 'not_started' },
        ],
      },
      {
        name: 'MRV & Methodology',
        items: [
          { requirement: 'Baseline Assessment', status: 'in_progress' },
          { requirement: 'Monitoring Plan', status: 'not_started' },
          { requirement: 'Emission Reduction Calculations', status: 'not_started' },
          { requirement: 'Additionality Demonstration', status: 'not_started' },
          { requirement: 'Leakage Assessment', status: 'not_started' },
        ],
      },
    ],
  },
  {
    standard: 'Plan Vivo',
    project: 'Iringa Agroforestry Pilot',
    projectId: 'salima-agroforestry',
    total: 8,
    completed: 1,
    inProgress: 1,
    flagged: 0,
    categories: [
      {
        name: 'Project Design',
        items: [
          { requirement: 'Plan Vivo Project Idea Note (PIN)', status: 'completed' },
          { requirement: 'Technical Specification', status: 'in_progress' },
          { requirement: 'Community Benefit Plan', status: 'not_started' },
        ],
      },
      {
        name: 'Community & Governance',
        items: [
          { requirement: 'Community Engagement Plan', status: 'not_started' },
          { requirement: 'Benefit Sharing Agreement', status: 'not_started' },
          { requirement: 'Land Tenure Documentation', status: 'not_started' },
          { requirement: 'Gender and Social Safeguards', status: 'not_started' },
          { requirement: 'Risk Assessment', status: 'not_started' },
        ],
      },
    ],
  },
];

const statusIcons = {
  completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  in_progress: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  not_started: { icon: Circle, color: 'text-gray-300', bg: 'bg-gray-100' },
  flagged: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default async function VerificationPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-charcoal">Verification Tracking</h1>
        <p className="text-sm text-charcoal/60 mt-1">
          Track verification requirements per carbon credit standard for each project
        </p>
      </div>

      {/* Standards Overview */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {verificationStandards.map((standard) => {
          const completionPct = Math.round((standard.completed / standard.total) * 100);

          return (
            <div key={`${standard.standard}-${standard.projectId}`} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-5 w-5 text-forest" />
                    <h3 className="text-lg font-semibold text-charcoal">{standard.standard}</h3>
                  </div>
                  <p className="text-sm text-charcoal/60">{standard.project}</p>
                </div>
                <span className="text-2xl font-semibold text-forest">
                  {completionPct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-forest rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-charcoal/60">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  {standard.completed} done
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  {standard.inProgress} in progress
                </span>
                <span>
                  {standard.total - standard.completed - standard.inProgress} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Checklists */}
      <div className="space-y-8">
        {verificationStandards.map((standard) => (
          <div key={`detail-${standard.standard}-${standard.projectId}`}>
            <h2 className="text-lg font-semibold text-charcoal mb-4">
              {standard.standard} — {standard.project}
            </h2>

            <div className="space-y-4">
              {standard.categories.map((category) => (
                <div key={category.name} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-charcoal/80 uppercase tracking-wider mb-4">
                    {category.name}
                  </h3>

                  <div className="space-y-3">
                    {category.items.map((item) => {
                      const st = statusIcons[item.status as keyof typeof statusIcons];
                      const StatusIcon = st.icon;

                      return (
                        <div
                          key={item.requirement}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-7 w-7 rounded-lg ${st.bg} flex items-center justify-center`}>
                              <StatusIcon className={`h-4 w-4 ${st.color}`} />
                            </div>
                            <span className="text-sm text-charcoal">{item.requirement}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-charcoal/20" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
