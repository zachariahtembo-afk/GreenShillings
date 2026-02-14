import { redirect } from 'next/navigation';
import { ArrowRight, BarChart3, Clock, FileText, Download, Calendar } from 'lucide-react';
import { auth, type SessionWithPortal } from '../../../../lib/auth';

const reports = [
  {
    id: '1',
    title: 'Annual Impact Report 2025',
    description: 'Annual reporting on activities, outcomes, and financial management.',
    status: 'upcoming',
    expectedDate: 'Q1 2026',
    sections: [
      'Organizational establishment',
      'Pilot project design progress',
      'Community engagement activities',
      'Financial transparency',
    ],
  },
];

const quarterlyUpdates = [
  {
    id: '1',
    quarter: 'Q4 2024',
    title: 'Quarterly Progress Summary',
    date: 'Jan 15, 2025',
    status: 'available',
    highlights: [
      'Completed initial community consultations in Iringa',
      'Established partnership with Morogoro Wildlife Reserve',
      'Finalized standards comparison analysis',
    ],
  },
  {
    id: '2',
    quarter: 'Q1 2025',
    title: 'Quarterly Progress Summary',
    date: 'Apr 15, 2025',
    status: 'upcoming',
    highlights: [
      'FPIC process completion (Iringa)',
      'Baseline assessment (Morogoro)',
      'Partnership development updates',
    ],
  },
];

const mrvSummaries = [
  {
    id: '1',
    project: 'Iringa Agroforestry Pilot',
    title: 'MRV Framework Overview',
    date: 'Dec 1, 2024',
    status: 'draft',
    description:
      'Proposed monitoring, reporting, and verification approach for the Iringa pilot project.',
  },
  {
    id: '2',
    project: 'Morogoro Forest Restoration',
    title: 'Baseline Methodology',
    date: 'Jan 5, 2025',
    status: 'available',
    description:
      'Forest cover and carbon stock baseline methodology using remote sensing and ground surveys.',
  },
];

export default async function PortalReportsPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 space-y-10">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charcoal">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Access oversight-ready reporting, MRV summaries, and scheduled disclosures for each project.
          </p>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-forest" />
              </div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Next disclosure</p>
            </div>
            <p className="text-lg font-bold text-charcoal">Q1 2026 impact report</p>
            <p className="text-sm text-gray-500 mt-1">
              Portfolio-wide reporting aligned with partner diligence timelines.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-forest" />
              </div>
              <p className="text-xs uppercase tracking-wider text-gray-500">MRV updates</p>
            </div>
            <p className="text-lg font-bold text-charcoal">2 summaries active</p>
            <p className="text-sm text-gray-500 mt-1">
              Remote sensing and ground-truthing updates published per project cycle.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-forest" />
              </div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Quarterly updates</p>
            </div>
            <p className="text-lg font-bold text-charcoal">{quarterlyUpdates.length} updates</p>
            <p className="text-sm text-gray-500 mt-1">
              Progress summaries issued within 30 days of each quarter end.
            </p>
          </div>
        </div>

        {/* Annual Reports */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-forest" />
            Annual Impact Reports
          </h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-charcoal">{report.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-citrus text-charcoal">
                        {report.status === 'upcoming' ? 'Upcoming' : 'Available'}
                      </span>
                    </div>
                    <p className="text-gray-600">{report.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Report period: 2025</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{report.expectedDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Expected Sections
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {report.sections.map((section) => (
                      <div
                        key={section}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <FileText className="h-4 w-4 text-gray-400" />
                        {section}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quarterly Updates */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-forest" />
            Quarterly Progress Updates
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quarterlyUpdates.map((update) => (
              <div key={update.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-forest uppercase tracking-wider">
                      {update.quarter}
                    </span>
                    <h3 className="font-semibold text-charcoal mt-1">{update.title}</h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      update.status === 'available'
                        ? 'bg-leaf text-charcoal'
                        : 'bg-citrus text-charcoal'
                    }`}
                  >
                    {update.status === 'available' ? 'Available' : 'Upcoming'}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {update.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">{update.date}</span>
                  {update.status === 'available' && (
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-600">
                      <Download className="h-4 w-4 text-forest" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MRV Summaries */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-forest" />
            MRV Summaries
          </h2>
          <p className="text-sm text-gray-600 mb-4">Plain-language MRV summaries per project.</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {mrvSummaries.map((mrv) => (
                <div key={mrv.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-semibold text-forest">{mrv.project}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            mrv.status === 'available'
                              ? 'bg-leaf text-charcoal'
                              : 'bg-gray-50 text-charcoal'
                          }`}
                        >
                          {mrv.status === 'available' ? 'Available' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="font-medium text-charcoal mb-2">{mrv.title}</h3>
                      <p className="text-sm text-gray-600 max-w-prose">{mrv.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{mrv.date}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-forest hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Notice */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-leaf flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-1">Reporting schedule</h3>
              <p className="text-sm text-gray-600 max-w-prose">
                Quarterly updates are issued within 30 days of each quarter end. Annual impact
                reports are released after audit and verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
