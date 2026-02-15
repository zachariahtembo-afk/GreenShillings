import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Resetting database...');

  // Clear existing data
  await prisma.community.deleteMany();
  await prisma.project.deleteMany();
  await prisma.advocacyOutput.deleteMany();
  await prisma.capitalPartner.deleteMany();
  await prisma.contactInquiry.deleteMany();

  console.log('📋 Seeding projects...');

  // Pilot projects
  const salimaProject = await prisma.project.create({
    data: {
      name: 'Iringa Agroforestry Pilot',
      slug: 'salima-agroforestry',
      description:
        'A community-led agroforestry restoration project in Iringa District, working with local communities to integrate trees into agricultural landscapes while building carbon sequestration capacity.',
      location: 'Iringa District, Tanzania',
      projectType: 'agroforestry',
      status: 'PLANNING',
      standardsAlignment: ['Plan Vivo', 'Gold Standard'],
      methodology: 'Plan Vivo Agroforestry Methodology',
      targetHectares: 500,
      targetCO2e: 15000,
      impactSummary:
        'Targeting 500 hectares of community-managed land with integrated agroforestry systems, benefiting approximately 200 households.',
      metadata: {
        treeSpecies: ['Faidherbia albida', 'Gliricidia sepium', 'Sesbania sesban'],
        intercropping: ['maize', 'groundnuts', 'soybeans'],
      },
    },
  });

  const nkhotakotaProject = await prisma.project.create({
    data: {
      name: 'Morogoro Forest Restoration',
      slug: 'nkhotakota-restoration',
      description:
        'Forest restoration initiative on the periphery of Morogoro Wildlife Reserve, working with communities on reforestation and improved cookstove adoption to reduce deforestation pressure.',
      location: 'Morogoro District, Tanzania',
      projectType: 'reforestation',
      status: 'PLANNING',
      standardsAlignment: ['Verra VCS', 'CCB Standards'],
      methodology: 'VCS VM0007 REDD+ Methodology Framework',
      targetHectares: 1000,
      targetCO2e: 45000,
      impactSummary:
        'Combining native forest restoration with community engagement to reduce deforestation drivers and enhance biodiversity corridors.',
      metadata: {
        biodiversityFocus: true,
        nativeSpeciesOnly: true,
        bufferZoneManagement: true,
      },
    },
  });

  console.log('👥 Seeding communities...');

  // Communities
  await prisma.community.create({
    data: {
      name: 'Chipoka Village Group',
      location: 'Chipoka, Iringa District',
      district: 'Iringa',
      region: 'Central Region',
      populationEstimate: 1200,
      engagementModel: 'co-design',
      consentStatus: 'pending',
      primaryContact: 'Village Development Committee Chair',
      notes:
        'Initial consultations conducted. Community expressed strong interest in agroforestry integration.',
      projectId: salimaProject.id,
    },
  });

  await prisma.community.create({
    data: {
      name: 'Senga Bay Farmers Association',
      location: 'Senga Bay, Iringa District',
      district: 'Iringa',
      region: 'Central Region',
      populationEstimate: 800,
      engagementModel: 'consultation',
      consentStatus: 'pending',
      primaryContact: 'Association Secretary',
      notes:
        'Existing cooperative structure. Strong history of collective action on agricultural projects.',
      projectId: salimaProject.id,
    },
  });

  await prisma.community.create({
    data: {
      name: 'Benga Community Forest Group',
      location: 'Benga, Morogoro District',
      district: 'Morogoro',
      region: 'Central Region',
      populationEstimate: 2500,
      engagementModel: 'co-design',
      consentStatus: 'pending',
      primaryContact: 'Traditional Authority Representative',
      notes: 'Adjacent to wildlife reserve. Key stakeholder in forest buffer zone management.',
      projectId: nkhotakotaProject.id,
    },
  });

  console.log('📄 Seeding advocacy outputs...');

  // Advocacy outputs
  await prisma.advocacyOutput.create({
    data: {
      title: 'Carbon Market Access for Tanzanian Communities: Barriers and Opportunities',
      slug: 'tanzania-community-carbon-market-access',
      outputType: 'report',
      topic: 'community_benefits',
      audience: 'policymakers',
      summary:
        'An analysis of the structural barriers preventing Tanzanian communities from accessing voluntary carbon markets, with recommendations for policy interventions and market reforms.',
      publicationDate: new Date('2025-03-15'),
      authors: ['GREENSHILLING Research Team'],
      isPublic: true,
      metadata: {
        pages: 42,
        methodology: 'Mixed methods: interviews, market analysis, policy review',
      },
    },
  });

  await prisma.advocacyOutput.create({
    data: {
      title: 'Understanding Plan Vivo: A Guide for Tanzanian Communities',
      slug: 'plan-vivo-community-guide',
      outputType: 'briefing',
      topic: 'standards',
      audience: 'communities',
      summary:
        'An accessible introduction to the Plan Vivo standard for community-based carbon projects, explaining requirements, processes, and what communities should expect.',
      publicationDate: new Date('2025-02-01'),
      authors: ['GREENSHILLING Standards Team'],
      isPublic: true,
      metadata: {
        language: 'English with Chichewa summary',
        format: 'PDF and print',
      },
    },
  });

  await prisma.advocacyOutput.create({
    data: {
      title: 'Position Paper: Fair Benefit-Sharing in African Carbon Projects',
      slug: 'fair-benefit-sharing-position',
      outputType: 'position_paper',
      topic: 'market_integrity',
      audience: 'standards_bodies',
      summary:
        "GREENSHILLING's position on minimum standards for community benefit-sharing in carbon projects, submitted to Verra and Gold Standard consultations.",
      publicationDate: new Date('2025-01-15'),
      authors: ['GREENSHILLING Policy Team'],
      isPublic: true,
      metadata: {
        submittedTo: ['Verra Consultation', 'Gold Standard Review'],
      },
    },
  });

  console.log('🤝 Seeding capital partners...');

  // Capital partners (example relationships - not transactional)
  await prisma.capitalPartner.create({
    data: {
      name: 'Example Foundation',
      partnerType: 'foundation',
      engagementType: 'funder',
      geography: 'Sub-Saharan Africa',
      website: 'https://example-foundation.org',
      notes: 'Potential funder for pilot project phase. Initial conversations ongoing.',
      isActive: true,
    },
  });

  await prisma.capitalPartner.create({
    data: {
      name: 'University of Edinburgh - School of GeoSciences',
      partnerType: 'academic',
      engagementType: 'knowledge_partner',
      geography: 'Global',
      website: 'https://www.ed.ac.uk/geosciences',
      notes: 'Technical partnership on remote sensing and MRV methodology development.',
      isActive: true,
    },
  });

  await prisma.capitalPartner.create({
    data: {
      name: 'Plan Vivo Foundation',
      partnerType: 'standards_body',
      engagementType: 'technical_partner',
      geography: 'Global',
      website: 'https://www.planvivo.org',
      notes: 'Standards body relationship. Exploring project registration pathway.',
      isActive: true,
    },
  });

  console.log('📧 Seeding sample contact inquiries...');

  await prisma.contactInquiry.createMany({
    data: [
      {
        fullName: 'Dr. Sarah Thompson',
        email: 'sarah.thompson@climateresearch.org',
        phone: '+44 20 7123 4567',
        organization: 'Climate Research Institute',
        role: 'Senior Research Fellow',
        message:
          'Interested in potential research collaboration on community-based MRV methodologies. We have experience in participatory monitoring approaches that may complement your work.',
        source: 'get-involved',
      },
      {
        fullName: 'James Okonkwo',
        email: 'james@impactfund.org',
        phone: '+1 415 555 0123',
        organization: 'African Climate Impact Fund',
        role: 'Program Officer',
        message:
          'Our foundation is exploring funding opportunities in East and Southern Africa for community-led carbon projects. Would welcome a conversation about your pilot projects.',
        source: 'get-involved',
      },
      {
        fullName: 'Maria Santos',
        email: 'maria.santos@ngo-alliance.org',
        organization: 'Global Conservation Alliance',
        role: 'Policy Coordinator',
        message:
          'We are developing a joint position paper on benefit-sharing standards for the upcoming UNFCCC negotiations. Would GREENSHILLING be interested in contributing?',
        source: 'mission',
      },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('\n📊 Summary:');
  console.log('- Projects: 2 (Iringa Agroforestry, Morogoro Restoration)');
  console.log('- Communities: 3');
  console.log('- Advocacy Outputs: 3');
  console.log('- Capital Partners: 3');
  console.log('- Contact Inquiries: 3');
  console.log(
    '\nThis is an advocacy-led NGO - no user accounts, dashboards, or transactional features.',
  );
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
