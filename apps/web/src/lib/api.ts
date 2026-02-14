// GREENSHILLINGS API Client
// Minimal API client for advocacy-led NGO website

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Project types
export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  projectType: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  standardsAlignment: string[];
  methodology: string | null;
  targetHectares: number | null;
  targetCO2e: number | null;
  actualCO2e: number | null;
  impactSummary: string | null;
  communities: Community[];
};

export type Community = {
  id: string;
  name: string;
  location: string;
  district: string | null;
  region: string | null;
  populationEstimate: number | null;
  engagementModel: string | null;
};

export type AdvocacyOutput = {
  id: string;
  title: string;
  slug: string;
  outputType: string;
  topic: string;
  audience: string;
  summary: string;
  publicationDate: string;
  authors: string[];
  documentUrl: string | null;
  isPublic: boolean;
};

// API functions
export async function getProjects() {
  return request<{ data: Project[] }>('/projects');
}

export async function getProject(id: string) {
  return request<{ data: Project }>(`/projects/${id}`);
}

export async function getAdvocacyOutputs() {
  return request<{ data: AdvocacyOutput[] }>('/advocacy-outputs');
}

// Contact form submission
export async function submitContactInquiry(data: {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  message: string;
  source?: string;
}) {
  return request<{ success: boolean; id: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
