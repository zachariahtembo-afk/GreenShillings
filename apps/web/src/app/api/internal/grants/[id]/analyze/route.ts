import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';
import { triggerJobRun, isDatabricksConfigured } from '../../../../../../lib/api/services/databricks';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  if (!isDatabricksConfigured()) {
    return NextResponse.json({ error: 'Databricks is not configured' }, { status: 503 });
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { documents: { orderBy: { uploadedAt: 'desc' }, take: 1 } },
  });

  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

  if (!proposal.documents.length) {
    return NextResponse.json({ error: 'No documents uploaded for this proposal' }, { status: 400 });
  }

  const latestDoc = proposal.documents[0];
  const jobId = Number(process.env.DATABRICKS_RFP_JOB_ID);

  if (!jobId) {
    return NextResponse.json({ error: 'Databricks RFP job not configured' }, { status: 503 });
  }

  const appUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const result = await triggerJobRun({
    jobId,
    notebookParams: {
      storage_key: latestDoc.storageKey,
      proposal_id: id,
      webhook_url: `${appUrl}/api/webhooks/databricks/rfp-analysis`,
      webhook_secret: process.env.DATABRICKS_WEBHOOK_SECRET || '',
      bucket_name: process.env.STORAGE_BUCKET || '',
      aws_region: process.env.STORAGE_REGION || '',
    },
  });

  // Update proposal with the run ID
  await prisma.proposal.update({
    where: { id },
    data: {
      analysisStatus: 'pending',
      databricksRunId: String(result.run_id),
    },
  });

  return NextResponse.json({ runId: result.run_id, status: 'pending' });
}
