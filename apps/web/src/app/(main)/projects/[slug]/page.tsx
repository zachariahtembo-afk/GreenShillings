import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '../../../../lib/prisma';
import ProjectDetailContent from './project-detail-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
    if (!project) return { title: 'Project Not Found' };
    return {
      title: project.name,
      description: project.description,
    };
  } catch {
    return { title: 'Project Not Found' };
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { communities: true },
    });

    if (!project) {
      notFound();
    }

    return <ProjectDetailContent project={project} />;
  } catch {
    notFound();
  }
}
