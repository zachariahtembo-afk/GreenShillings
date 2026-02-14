/**
 * Verification Engine - Pluggable interface for verification providers.
 *
 * Current providers:
 *   - Planet Labs satellite imagery (apps/api/src/services/planet.ts)
 *
 * Future providers:
 *   - AI-based document verification
 *   - Drone imagery analysis
 *   - IoT sensor data validation
 *   - Third-party auditor integrations
 */

export interface VerificationResult {
  provider: string;
  projectId: string;
  timestamp: string;
  confidence: 'low' | 'medium' | 'high';
  passed: boolean;
  metrics: Record<string, number | string>;
  evidence?: {
    type: 'image' | 'document' | 'sensor' | 'report';
    url?: string;
    description: string;
  }[];
  notes?: string;
}

export interface VerificationProvider {
  name: string;
  isConfigured(): boolean;
  verify(projectId: string, params: Record<string, unknown>): Promise<VerificationResult>;
}

const providers: Map<string, VerificationProvider> = new Map();

export function registerProvider(provider: VerificationProvider): void {
  providers.set(provider.name, provider);
}

export function getProvider(name: string): VerificationProvider | undefined {
  return providers.get(name);
}

export function listProviders(): { name: string; configured: boolean }[] {
  return Array.from(providers.values()).map((p) => ({
    name: p.name,
    configured: p.isConfigured(),
  }));
}

export async function runVerification(
  providerName: string,
  projectId: string,
  params: Record<string, unknown> = {},
): Promise<VerificationResult> {
  const provider = providers.get(providerName);
  if (!provider) {
    throw new Error(`Verification provider "${providerName}" not registered`);
  }
  if (!provider.isConfigured()) {
    throw new Error(`Verification provider "${providerName}" is not configured`);
  }
  return provider.verify(projectId, params);
}
