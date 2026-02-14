import { NextRequest, NextResponse } from 'next/server';
import { auth, sessionToInternalUser } from '../../../../../../../lib/auth';
import { prisma } from '../../../../../../../lib/prisma';
import { getJobRunStatus, isDatabricksConfigured } from '../../../../../../../lib/api/services/databricks';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = sessionToInternalUser(session);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    select: { databricksRunId: true, analysisStatus: true, analysisResult: true },
  });

  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

  if (!proposal.databricksRunId) {
    return NextResponse.json({ status: 'none', message: 'No analysis has been triggered' });
  }

  // If already completed or failed, return cached result
  if (proposal.analysisStatus === 'completed' || proposal.analysisStatus === 'failed') {
    return NextResponse.json({
      status: proposal.analysisStatus,
      result: proposal.analysisResult,
    });
  }

  // Otherwise poll Databricks for latest status
  if (!isDatabricksConfigured()) {
    return NextResponse.json({ status: proposal.analysisStatus || 'unknown' });
  }

  const runStatus = await getJobRunStatus(Number(proposal.databricksRunId));
  const state = runStatus.state?.life_cycle_state;

  let analysisStatus = proposal.analysisStatus;
  if (state === 'TERMINATED' && runStatus.state?.result_state === 'SUCCESS') {
    analysisStatus = 'completed';
  } else if (state === 'TERMINATED') {
    analysisStatus = 'failed';
  } else if (state === 'RUNNING' || state === 'PENDING') {
    analysisStatus = 'running';
  }

  // Update status if changed
  if (analysisStatus !== proposal.analysisStatus) {
    await prisma.proposal.update({
      where: { id },
      data: { analysisStatus },
    });
  }

  return NextResponse.json({
    status: analysisStatus,
    result: proposal.analysisResult,
    databricksState: state,
  });
}
