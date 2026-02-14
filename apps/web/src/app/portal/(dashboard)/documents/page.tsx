import { FolderOpen, FileText, Download, Search, Filter, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';
import { auth, type SessionWithPortal, isStaffSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fileExtension(contentType: string, fileName: string): string {
  const ext = fileName.split('.').pop()?.toUpperCase();
  if (ext && ext.length <= 5) return ext;
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'text/csv': 'CSV',
  };
  return map[contentType] || 'FILE';
}

const categoryColors: Record<string, string> = {
  Engagement: 'bg-forest text-white',
  Technical: 'bg-leaf text-charcoal',
  Methodology: 'bg-citrus text-charcoal',
  MRV: 'bg-forest text-white',
  Legal: 'bg-gray-50 text-charcoal border border-gray-200',
  Report: 'bg-gray-50 text-charcoal border border-gray-200',
  General: 'bg-gray-50 text-charcoal border border-gray-200',
};

const statusColors: Record<string, string> = {
  FINAL: 'bg-leaf text-charcoal',
  DRAFT: 'bg-citrus text-charcoal',
  REVIEW: 'bg-amber-100 text-amber-800',
  ARCHIVED: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  FINAL: 'Final',
  DRAFT: 'Draft',
  REVIEW: 'Review',
  ARCHIVED: 'Archived',
};

export default async function PortalDocumentsPage() {
  const session = (await auth()) as SessionWithPortal;
  if (!session?.user?.email) redirect('/portal/login');

  const isStaff = isStaffSession(session);
  const orgId = (session as SessionWithPortal).organizationId;

  const documents = await prisma.document.findMany({
    where: isStaff
      ? {}
      : {
          OR: [
            { visibility: 'PUBLIC' },
            ...(orgId ? [{ access: { some: { organizationId: orgId } } }] : []),
          ],
        },
    orderBy: { createdAt: 'desc' },
    include: { project: { select: { name: true } } },
  });

  // Compute stats from real data
  const totalCount = documents.length;
  const projectNames = new Set(documents.map((d) => d.project?.name).filter(Boolean));
  const projectCount = projectNames.size;
  const categories = new Set(documents.map((d) => d.category || 'General'));
  const categoryCount = categories.size;

  const latestUpdate =
    documents.length > 0
      ? documents[0].updatedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '--';

  // Build project options and category options for filters
  const projectOptions = Array.from(projectNames).sort();
  const categoryOptions = Array.from(categories).sort();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charcoal">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search verification materials, methodology notes, and partner-ready documentation.
          </p>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{totalCount}</p>
                <p className="text-xs text-gray-500">Total documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{projectCount}</p>
                <p className="text-xs text-gray-500">Projects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Filter className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{categoryCount}</p>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{latestUpdate}</p>
                <p className="text-xs text-gray-500">Latest update</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-charcoal placeholder:text-gray-400 focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-charcoal text-sm font-medium focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500">
                <option value="">All Projects</option>
                {projectOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <select className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-charcoal text-sm font-medium focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500">
                <option value="">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">Documents</h2>
            <span className="text-sm text-gray-500">{totalCount} items</span>
          </div>

          {documents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="h-8 w-8 text-charcoal/20 mx-auto mb-3" />
              <p className="text-sm text-charcoal/50">No documents available yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => {
                const category = doc.category || 'General';
                const catColor = categoryColors[category] || categoryColors.General;
                const stColor = statusColors[doc.status] || statusColors.DRAFT;
                const stLabel = statusLabels[doc.status] || doc.status;
                const ext = fileExtension(doc.contentType, doc.fileName);

                return (
                  <div key={doc.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-forest" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal truncate">{doc.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.project?.name || 'Organization'} &bull; {ext} &bull;{' '}
                          {formatFileSize(doc.sizeBytes)}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${catColor}`}>
                            {category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${stColor}`}>
                            {stLabel}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(doc.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 text-forest" />
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
