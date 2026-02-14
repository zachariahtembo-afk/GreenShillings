import { redirect } from 'next/navigation';
import { FileText, CheckCircle, AlertCircle, Download, Shield, BarChart3, Users } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { auth, type SessionWithPortal } from '../../../../lib/auth';

const partnerProfiles = [
  {
    id: 'buyers',
    title: 'Carbon buyers and offtakers',
    description: 'High expectations for MRV rigor, transparency, and issuance credibility.',
    focusAreas: ['Additionality', 'MRV traceability', 'Issuance readiness', 'Safeguards'],
    icon: Shield,
  },
  {
    id: 'verifiers',
    title: 'Verification partners',
    description: 'Independent validation and verification of methodology and data quality.',
    focusAreas: ['QA/QC', 'Sampling design', 'Evidence traceability', 'Audit trails'],
    icon: BarChart3,
  },
  {
    id: 'standards',
    title: 'Standards and registries',
    description: 'Alignment to approved methodologies and issuance requirements.',
    focusAreas: ['Methodology alignment', 'Registry readiness', 'Permanence risk', 'Leakage'],
    icon: Users,
  },
] as const;

const readinessSummary = [
  {
    id: 'buyers',
    label: 'Buyer readiness',
    progress: 54,
    met: 13,
    total: 24,
    status: 'In progress',
  },
  {
    id: 'verifiers',
    label: 'Verifier readiness',
    progress: 56,
    met: 5,
    total: 9,
    status: 'In progress',
  },
  {
    id: 'standards',
    label: 'Standards readiness',
    progress: 50,
    met: 7,
    total: 14,
    status: 'Planned',
  },
];

type Priority = 'Now' | 'Next';

const priorityVariants: Record<Priority, 'success' | 'outline'> = {
  Now: 'success',
  Next: 'outline',
};

const documentChecklist = [
  {
    id: 'verification',
    title: 'Carbon verification (baseline across standards)',
    description: 'Core documents required for validation and verification readiness.',
    priority: 'Now' as Priority,
    items: [
      'Project design document (PDD) or equivalent project description',
      'Methodology selection and applicability analysis',
      'Baseline study with assumptions and uncertainty notes',
      'Additionality demonstration and barrier analysis',
      'Leakage assessment with mitigation measures',
      'Permanence risk assessment and buffer plan',
      'Monitoring plan and sampling design',
      'Data collection SOPs and QA/QC protocol',
      'Remote sensing sources and model versioning',
      'FPIC and stakeholder consultation records',
      'Safeguards and grievance mechanism',
      'Land tenure and community rights evidence',
    ],
  },
  {
    id: 'registry',
    title: 'Registry and issuance readiness',
    description: 'Documents needed to satisfy registry and credit issuance requirements.',
    priority: 'Next' as Priority,
    items: [
      'Registry requirements mapping',
      'Validation and verification plan and timeline',
      'Project boundary GIS files and maps',
      'Issuance workflow and vintage schedule',
      'Data management and audit trail summary',
    ],
  },
  {
    id: 'due-diligence',
    title: 'Funder due diligence',
    description: 'Standard organizational and financial due diligence expectations.',
    priority: 'Now' as Priority,
    items: [
      'Organization registration documents and bylaws',
      'Governance structure and decision rights',
      'Leadership and key staff bios',
      'Financial statements or management accounts',
      'Budget and use-of-funds breakdown',
      'AML, anti-corruption, and sanctions policies',
      'Procurement policy and vendor due diligence',
      'Risk register and mitigation plan',
      'Bank details and KYC package',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial terms (buyers and offtakers)',
    description: 'Commercial terms and data-sharing expectations for purchase agreements.',
    priority: 'Next' as Priority,
    items: [
      'Draft ERPA or offtake agreement',
      'Pricing, volume, and delivery schedule',
      'Payment milestones and invoicing plan',
      'Data-sharing and confidentiality terms',
      'Credit quality and co-benefits narrative',
    ],
  },
];

const standardAddOns = [
  {
    id: 'gold-standard',
    title: 'Gold Standard add-ons',
    description: 'Typical additions for Gold Standard alignment and SDG impact reporting.',
    priority: 'Next' as Priority,
    items: [
      'GS_Gold_Standard_Project_Design_Document_v01.pdf',
      'GS_Sustainable_Development_Indicators_v01.xlsx',
      'GS_Stakeholder_Consultation_Report_v01.pdf',
      'GS_Safeguards_and_Gender_Assessment_v01.pdf',
      'GS_SDG_Impact_Monitoring_Plan_v01.pdf',
    ],
  },
  {
    id: 'verra-vcs',
    title: 'Verra VCS add-ons',
    description: 'Typical additions for VCS registry readiness and AFOLU risk treatment.',
    priority: 'Next' as Priority,
    items: [
      'GS_VCS_Project_Description_v01.pdf',
      'GS_VCS_Methodology_Applicability_Checklist_v01.xlsx',
      'GS_AFOLU_Risk_Buffer_Analysis_v01.pdf',
      'GS_VCS_Registry_Readiness_v01.pdf',
      'GS_CCB_or_SDG_Impact_Addendum_v01.pdf',
    ],
  },
  {
    id: 'plan-vivo',
    title: 'Plan Vivo add-ons',
    description: 'Typical additions for community-led project and smallholder requirements.',
    priority: 'Next' as Priority,
    items: [
      'GS_Plan_Vivo_Project_Design_Document_v01.pdf',
      'GS_Community_Governance_Plan_v01.pdf',
      'GS_Benefit_Sharing_Agreements_v01.pdf',
      'GS_Smallholder_Eligibility_Criteria_v01.pdf',
      'GS_Plan_Vivo_Monitoring_Plan_v01.pdf',
    ],
  },
];

const methodologyAddOns = [
  {
    id: 'agroforestry',
    title: 'Agroforestry (ARR) add-ons',
    description: 'Common artifacts requested for agroforestry carbon verification.',
    priority: 'Next' as Priority,
    items: [
      'GS_Agroforestry_Methodology_Applicability_v01.pdf',
      'GS_Stratification_and_Project_Maps_v01.pdf',
      'GS_Species_Mix_and_Planting_Density_v01.pdf',
      'GS_Biomass_Allometry_References_v01.pdf',
      'GS_Survival_and_Replanting_Assumptions_v01.xlsx',
      'GS_Farmer_Plot_Registry_v01.xlsx',
      'GS_Maintenance_and_Tree_Management_Plan_v01.pdf',
      'GS_Soil_Carbon_Sampling_Notes_v01.pdf',
    ],
  },
  {
    id: 'ifm',
    title: 'Improved Forest Management (IFM) add-ons',
    description: 'Common artifacts requested for IFM carbon verification.',
    priority: 'Next' as Priority,
    items: [
      'GS_Forest_Management_Plan_v01.pdf',
      'GS_Harvesting_and_Extraction_Schedule_v01.xlsx',
      'GS_Baseline_Harvest_Reference_Level_v01.pdf',
      'GS_Forest_Inventory_Plot_Data_v01.xlsx',
      'GS_Leakage_and_Displacement_Assessment_v01.pdf',
      'GS_Permanence_Risk_and_Buffer_Summary_v01.pdf',
      'GS_Wood_Product_Lifecycle_Assumptions_v01.pdf',
      'GS_Post_Harvest_Monitoring_Plan_v01.pdf',
    ],
  },
  {
    id: 'arr',
    title: 'Reforestation / ARR add-ons',
    description: 'Common artifacts requested for reforestation and afforestation projects.',
    priority: 'Next' as Priority,
    items: [
      'GS_Site_Eligibility_Assessment_v01.pdf',
      'GS_Historical_Land_Use_Evidence_v01.pdf',
      'GS_Planting_Design_and_Species_List_v01.pdf',
      'GS_Survival_Mortality_Assumptions_v01.xlsx',
      'GS_Nursery_and_Seedling_Sourcing_Plan_v01.pdf',
      'GS_Replanting_and_Maintenance_Plan_v01.pdf',
      'GS_Baseline_Carbon_Stock_Estimate_v01.xlsx',
      'GS_ARR_Monitoring_Plan_v01.pdf',
    ],
  },
  {
    id: 'soil-carbon',
    title: 'Soil carbon add-ons',
    description: 'Common artifacts requested for soil carbon verification.',
    priority: 'Next' as Priority,
    items: [
      'GS_Soil_Sampling_Protocol_v01.pdf',
      'GS_Soil_Strata_and_Sampling_Map_v01.pdf',
      'GS_SOC_Baseline_Data_v01.xlsx',
      'GS_Lab_Analysis_QAQC_v01.pdf',
      'GS_Soil_Bulk_Density_Assumptions_v01.pdf',
      'GS_Management_Practice_Change_Log_v01.xlsx',
      'GS_Uncertainty_Analysis_v01.pdf',
      'GS_Reversal_Risk_Plan_v01.pdf',
    ],
  },
];

const requirementRows = [
  {
    id: 'project-boundary',
    category: 'Project design',
    requirement: 'Project boundary and activity definition',
    response: 'Project boundary maps, activity descriptions, and eligibility criteria documented.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_PDD_Project_Boundary_Map_v01.pdf', 'GS_Activity_Definition_Memo_v01.pdf'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'land-tenure',
    category: 'Project design',
    requirement: 'Land tenure and community rights',
    response: 'Land tenure documentation and community rights agreements compiled.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Land_Tenure_Dossier_v01.pdf', 'GS_Community_Rights_Confirmation_v01.pdf'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'baseline',
    category: 'Baseline and additionality',
    requirement: 'Baseline scenario and assumptions',
    response: 'Baseline scenario defined with sources, assumptions, and uncertainty notes.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Baseline_Study_v01.pdf', 'GS_Assumptions_Log_v01.xlsx'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'additionality',
    category: 'Baseline and additionality',
    requirement: 'Additionality demonstration',
    response: 'Additionality tests and barrier analysis documented.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_Additionality_Memo_v01.pdf', 'GS_Barrier_Analysis_v01.xlsx'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'leakage',
    category: 'Leakage and permanence',
    requirement: 'Leakage assessment and mitigation',
    response: 'Leakage risks assessed with mitigation measures and monitoring approach.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_Leakage_Assessment_v01.pdf', 'GS_Leakage_Mitigation_Plan_v01.pdf'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'permanence',
    category: 'Leakage and permanence',
    requirement: 'Permanence risk and buffer allocation',
    response: 'Permanence risks scored and buffer allocation documented.',
    status: 'In progress',
    priority: 'Next' as Priority,
    evidence: ['GS_Permanence_Risk_Assessment_v01.pdf', 'GS_Buffer_Allocation_Note_v01.pdf'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'monitoring-plan',
    category: 'Monitoring and MRV',
    requirement: 'Monitoring plan and sampling design',
    response: 'Monitoring plan includes sampling strategy and field measurement schedule.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Monitoring_Plan_v01.pdf', 'GS_Sampling_Design_v01.pdf'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'data-collection',
    category: 'Monitoring and MRV',
    requirement: 'Data collection protocols',
    response: 'Field data collection SOPs aligned to methodology requirements.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Field_Data_SOP_v01.pdf', 'GS_Enumerator_Guide_v01.pdf'],
    appliesTo: ['Buyers', 'Verifiers'],
  },
  {
    id: 'qa-qc',
    category: 'Monitoring and MRV',
    requirement: 'QA/QC and data validation',
    response: 'QA/QC checks documented for data integrity and outlier handling.',
    status: 'In progress',
    priority: 'Next' as Priority,
    evidence: ['GS_QAQC_Checklist_v01.xlsx', 'GS_Validation_Logs_v01.csv'],
    appliesTo: ['Verifiers', 'Standards'],
  },
  {
    id: 'remote-sensing',
    category: 'Monitoring and MRV',
    requirement: 'Remote sensing and model traceability',
    response: 'Imagery sources, model versions, and processing steps logged.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Imagery_Catalog_v01.csv', 'GS_Model_Version_Log_v01.csv'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'verification-plan',
    category: 'Verification and issuance',
    requirement: 'Validation/verification plan',
    response: 'Third-party verification plan scoped for pilot and scale phases.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_Verification_Plan_v01.pdf'],
    appliesTo: ['Buyers', 'Verifiers', 'Standards'],
  },
  {
    id: 'registry',
    category: 'Verification and issuance',
    requirement: 'Registry readiness and issuance pathway',
    response: 'Registry requirements mapped to issuance workflow and documentation.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_Registry_Requirements_Map_v01.pdf', 'GS_Issuance_Workflow_v01.pdf'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'safeguards',
    category: 'Safeguards',
    requirement: 'FPIC and grievance mechanism',
    response: 'FPIC process documented with grievance pathway and response timelines.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_FPIC_Protocol_v01.pdf', 'GS_Grievance_Pathway_v01.pdf'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'benefit-sharing',
    category: 'Safeguards',
    requirement: 'Benefit-sharing and community governance',
    response: 'Benefit-sharing plan and community governance model documented.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_Benefit_Sharing_Plan_v01.pdf', 'GS_Community_Governance_Note_v01.pdf'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'risk-register',
    category: 'Risk management',
    requirement: 'Project risk register',
    response: 'Risk register maintained for delivery, social, and MRV risks.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_Risk_Register_v01.xlsx'],
    appliesTo: ['Buyers', 'Standards'],
  },
  {
    id: 'org-registration',
    category: 'Due diligence',
    requirement: 'Organization registration and governance docs',
    response: 'Registration certificates, bylaws, and governance structure compiled for review.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: [
      'GS_Registration_Certificate_v01.pdf',
      'GS_Bylaws_v01.pdf',
      'GS_Governance_Chart_v01.pdf',
    ],
    appliesTo: ['Buyers'],
  },
  {
    id: 'leadership-bios',
    category: 'Due diligence',
    requirement: 'Leadership and key staff bios',
    response: 'Leadership bios and key staff roles documented.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_Leadership_Bios_v01.pdf', 'GS_Org_Chart_v01.pdf'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'financial-statements',
    category: 'Due diligence',
    requirement: 'Financial statements or management accounts',
    response: 'Latest financials prepared for partner review.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_Financial_Statements_v01.pdf', 'GS_Management_Accounts_v01.xlsx'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'budget-use',
    category: 'Due diligence',
    requirement: 'Budget and use-of-funds breakdown',
    response: 'Project budget with line-item use-of-funds narrative.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_Budget_Breakdown_v01.xlsx', 'GS_Use_of_Funds_Narrative_v01.pdf'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'bank-kyc',
    category: 'Due diligence',
    requirement: 'Bank details and KYC package',
    response: 'Banking details and KYC documents organized for onboarding.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_Bank_Letter_v01.pdf', 'GS_KYC_Checklist_v01.pdf'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'aml-compliance',
    category: 'Legal and compliance',
    requirement: 'AML, anti-corruption, and sanctions compliance',
    response: 'Policies and screening procedures documented.',
    status: 'Planned',
    priority: 'Now' as Priority,
    evidence: ['GS_AML_Policy_v01.pdf', 'GS_Sanctions_Screening_Checklist_v01.xlsx'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'procurement-controls',
    category: 'Legal and compliance',
    requirement: 'Procurement and vendor due diligence',
    response: 'Procurement thresholds and vendor due diligence documented.',
    status: 'In progress',
    priority: 'Next' as Priority,
    evidence: ['GS_Procurement_Policy_v01.pdf', 'GS_Vendor_Due_Diligence_Checklist_v01.xlsx'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'commercial-terms',
    category: 'Commercial terms',
    requirement: 'Draft ERPA or offtake terms',
    response: 'Draft terms cover volume, price, delivery, and payment milestones.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_ERPA_Draft_v01.pdf', 'GS_Payment_Milestones_v01.xlsx'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'data-sharing-terms',
    category: 'Commercial terms',
    requirement: 'Data-sharing and confidentiality terms',
    response: 'Data-sharing scope, confidentiality, and IP terms documented.',
    status: 'Planned',
    priority: 'Next' as Priority,
    evidence: ['GS_DPA_Draft_v01.pdf', 'GS_Confidentiality_Clause_v01.docx'],
    appliesTo: ['Buyers'],
  },
  {
    id: 'co-benefits',
    category: 'Commercial terms',
    requirement: 'Credit quality and co-benefits narrative',
    response: 'Co-benefits aligned to SDGs with supporting evidence.',
    status: 'In progress',
    priority: 'Now' as Priority,
    evidence: ['GS_CoBenefits_Narrative_v01.pdf', 'GS_SDG_Mapping_v01.xlsx'],
    appliesTo: ['Buyers'],
  },
];

type DocStatus = 'Planned' | 'Draft' | 'Latest';

const evidenceKit: Array<{
  id: string;
  title: string;
  description: string;
  status: DocStatus;
  version: string;
  priority: Priority;
}> = [
  {
    id: 'prospectus',
    title: 'Project design document (PDD)',
    description: 'Project description, boundary, eligibility, and stakeholder overview.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'requirements',
    title: 'Carbon verification requirements checklist',
    description: 'Requirements aligned to standards, verification, and issuance.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'mrv-pack',
    title: 'MRV methodology pack',
    description: 'Methodology alignment, monitoring plan, and QA/QC workflows.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'baseline-pack',
    title: 'Baseline and additionality pack',
    description: 'Baseline scenario, assumptions, and additionality tests.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'leakage-pack',
    title: 'Leakage and permanence assessment',
    description: 'Leakage risks, mitigation measures, and permanence risk scoring.',
    status: 'Planned',
    version: 'v01',
    priority: 'Next',
  },
  {
    id: 'verification-pack',
    title: 'Verification and registry pack',
    description: 'Verification plan and registry readiness notes.',
    status: 'Planned',
    version: 'v01',
    priority: 'Next',
  },
  {
    id: 'safeguards-pack',
    title: 'Safeguards and FPIC pack',
    description: 'Community consent, safeguards, and grievance pathway.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'due-diligence-pack',
    title: 'Funder due diligence pack',
    description: 'Registration, governance, financials, AML, and procurement policies.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
  {
    id: 'commercial-pack',
    title: 'Commercial terms pack',
    description: 'Draft ERPA, pricing, delivery schedule, and data sharing.',
    status: 'Planned',
    version: 'v01',
    priority: 'Next',
  },
  {
    id: 'data-submission',
    title: 'Field data collection templates',
    description: 'Field data templates, metadata schema, and validation notes.',
    status: 'Planned',
    version: 'v01',
    priority: 'Now',
  },
];

const statusStyles: Record<string, { variant: 'success' | 'warning' | 'outline'; label: string }> =
  {
    Met: { variant: 'success', label: 'Met' },
    'In progress': { variant: 'warning', label: 'In progress' },
    Planned: { variant: 'outline', label: 'Planned' },
  };

type DocMeta = { name: string; version: string; status: DocStatus };

const docStatusVariants: Record<DocStatus, 'success' | 'warning' | 'outline'> = {
  Planned: 'outline',
  Draft: 'warning',
  Latest: 'success',
};

const getDocVersion = (fileName: string) => {
  const match = fileName.match(/_v\d+/);
  return match ? match[0].slice(1) : 'v01';
};

const buildDocMeta = (name: string, status: DocStatus = 'Planned'): DocMeta => ({
  name,
  version: getDocVersion(name),
  status,
});

const deriveDocStatus = (requirementStatus: string): DocStatus => {
  if (requirementStatus === 'Met') return 'Latest';
  if (requirementStatus === 'In progress') return 'Draft';
  return 'Planned';
};

export default async function PortalRequirementsPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Partner requirements and evidence</h1>
        <p className="text-charcoal/70 text-lg leading-relaxed max-w-prose mb-2">
          A structured view of partner expectations and how GreenShillings responds with
          documented evidence.
        </p>
        <p className="text-sm text-charcoal/60 max-w-prose mb-6">
          Baseline requirements align with Gold Standard and Verra expectations, with tailored
          add-ons reviewed each intake.
        </p>
        <a
          href="/portal/documents"
          className="inline-flex items-center justify-center rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest/90 transition-colors"
        >
          View documents
        </a>
      </div>

      <div className="space-y-10">
        {/* Partner profiles */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4">Partner profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerProfiles.map((profile) => {
              const IconComponent = profile.icon;
              return (
                <div key={profile.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        <IconComponent size={20} className="text-forest" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-charcoal">{profile.title}</h3>
                        <p className="text-sm text-gray-600">{profile.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.focusAreas.map((area) => (
                        <Badge key={area} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Readiness summary */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4">Readiness summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readinessSummary.map((summary) => {
              const status = statusStyles[summary.status];
              return (
                <div key={summary.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{summary.label}</p>
                        <p className="text-2xl font-semibold text-charcoal">
                          {summary.met}/{summary.total}
                        </p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Requirements met</span>
                        <span className="font-medium text-charcoal">{summary.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest rounded-full"
                          style={{ width: `${summary.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Last reviewed: Jan 2025</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Document checklist */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-2">
            Funding and verification document checklist
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            This is the baseline pack aligned across Gold Standard, Verra, and Plan Vivo. Partners
            may request additional documentation depending on their internal requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentChecklist.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">{group.title}</p>
                      <Badge variant={priorityVariants[group.priority]} size="sm">
                        {group.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const doc = buildDocMeta(item);
                      return (
                        <li key={doc.name} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest" />
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs text-gray-600 break-words">{doc.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="uppercase">{doc.version}</span>
                              <Badge variant={docStatusVariants[doc.status]} size="sm">
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standard-specific add-ons */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-2">Standard-specific add-ons</h2>
          <p className="text-sm text-gray-600 mb-4">
            Start with Gold Standard, then Verra VCS, then Plan Vivo. Add-ons below highlight
            typical extras each standard expects beyond the baseline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardAddOns.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">{group.title}</p>
                      <Badge variant={priorityVariants[group.priority]} size="sm">
                        {group.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const doc = buildDocMeta(item);
                      return (
                        <li key={doc.name} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest" />
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs text-gray-600 break-words">{doc.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="uppercase">{doc.version}</span>
                              <Badge variant={docStatusVariants[doc.status]} size="sm">
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology-specific add-ons */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-2">
            Methodology-specific add-ons
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Includes agroforestry (ARR), reforestation/ARR, IFM, and soil carbon. We can expand
            this list for other methodologies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methodologyAddOns.map((group) => (
              <div key={group.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-charcoal">{group.title}</p>
                      <Badge variant={priorityVariants[group.priority]} size="sm">
                        {group.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {group.items.map((item) => {
                      const doc = buildDocMeta(item);
                      return (
                        <li key={doc.name} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest" />
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs text-gray-600 break-words">{doc.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="uppercase">{doc.version}</span>
                              <Badge variant={docStatusVariants[doc.status]} size="sm">
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements matrix */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-charcoal">
              Verification and funding requirements matrix
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="h-4 w-4 text-success-600" />
              Status tracked per requirement
            </div>
          </div>

          <div className="hidden lg:block bg-white rounded-xl border border-gray-200">
            <div className="grid grid-cols-[180px_1.2fr_1.3fr_160px_1.2fr] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <span>Category</span>
              <span>Requirement</span>
              <span>GreenShillings response</span>
              <span>Status</span>
              <span>Evidence</span>
            </div>
            <div className="divide-y divide-gray-200">
              {requirementRows.map((row) => {
                const status = statusStyles[row.status];
                const evidenceStatus = deriveDocStatus(row.status);
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[180px_1.2fr_1.3fr_160px_1.2fr] gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{row.category}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {row.appliesTo.map((label) => (
                          <Badge key={label} variant="outline">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{row.requirement}</p>
                      <div className="mt-2">
                        <Badge variant={priorityVariants[row.priority]} size="sm">
                          {row.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{row.response}</p>
                    </div>
                    <div className="flex items-start">
                      <Badge variant={status.variant} size="md">
                        {status.label}
                      </Badge>
                    </div>
                    <div>
                      <ul className="space-y-2">
                        {row.evidence.map((item) => {
                          const doc = buildDocMeta(item, evidenceStatus);
                          return (
                            <li key={doc.name} className="flex items-start gap-2">
                              <FileText className="mt-0.5 h-3 w-3 text-gray-400" />
                              <div className="min-w-0 space-y-1">
                                <p className="text-xs text-gray-600 break-words">{doc.name}</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                  <span className="uppercase">{doc.version}</span>
                                  <Badge variant={docStatusVariants[doc.status]} size="sm">
                                    {doc.status}
                                  </Badge>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {requirementRows.map((row) => {
              const status = statusStyles[row.status];
              const evidenceStatus = deriveDocStatus(row.status);
              return (
                <div key={row.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-charcoal">{row.category}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-sm font-medium text-charcoal">{row.requirement}</p>
                    <div>
                      <Badge variant={priorityVariants[row.priority]} size="sm">
                        {row.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{row.response}</p>
                    <div className="flex flex-wrap gap-2">
                      {row.appliesTo.map((label) => (
                        <Badge key={label} variant="outline">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {row.evidence.map((item) => {
                        const doc = buildDocMeta(item, evidenceStatus);
                        return (
                          <div key={doc.name} className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-3 w-3 text-gray-400" />
                            <div className="min-w-0 space-y-1">
                              <p className="text-xs text-gray-600 break-words">{doc.name}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span className="uppercase">{doc.version}</span>
                                <Badge variant={docStatusVariants[doc.status]} size="sm">
                                  {doc.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Partner evidence kit */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal mb-4">Partner evidence kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {evidenceKit.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={priorityVariants[doc.priority]} size="sm">
                        {doc.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">{doc.version}</span>
                      <Badge variant={docStatusVariants[doc.status]}>{doc.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{doc.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest/80 transition-colors">
                    <Download size={16} className="text-forest" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner-specific tailoring notice */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-leaf flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-charcoal" />
            </div>
            <div>
              <h3 className="font-medium text-charcoal mb-1">Partner-specific tailoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Requirements and evidence are refined with each partner during intake. Reach out
                if you need a custom view or additional artifacts at{' '}
                <a
                  href="mailto:hello@greenshillings.org"
                  className="text-forest hover:text-forest/80 font-medium"
                >
                  hello@greenshillings.org
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
