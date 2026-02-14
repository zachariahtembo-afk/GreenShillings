const DATABRICKS_HOST = process.env.DATABRICKS_HOST;
const DATABRICKS_TOKEN = process.env.DATABRICKS_TOKEN;

function getBaseUrl() {
  return `${DATABRICKS_HOST}/api/2.0`;
}

function getHeaders() {
  return {
    Authorization: `Bearer ${DATABRICKS_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export interface DatabricksJobRunParams {
  jobId: number;
  notebookParams?: Record<string, string>;
}

export interface DatabricksSqlResult {
  columns: string[];
  data: Record<string, unknown>[];
}

// Trigger a Databricks job run
export async function triggerJobRun(params: DatabricksJobRunParams) {
  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) {
    throw new Error('Databricks credentials not configured');
  }

  const response = await fetch(`${getBaseUrl()}/jobs/run-now`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      job_id: params.jobId,
      notebook_params: params.notebookParams || {},
    }),
  });

  if (!response.ok) {
    throw new Error(`Databricks API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get the status of a job run
export async function getJobRunStatus(runId: number) {
  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) {
    throw new Error('Databricks credentials not configured');
  }

  const url = new URL(`${getBaseUrl()}/jobs/runs/get`);
  url.searchParams.set('run_id', String(runId));

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Databricks API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Execute a SQL query via Databricks SQL endpoint
export async function executeSqlQuery(
  warehouseId: string,
  query: string
): Promise<DatabricksSqlResult> {
  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) {
    throw new Error('Databricks credentials not configured');
  }

  const response = await fetch(`${getBaseUrl()}/sql/statements/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      warehouse_id: warehouseId,
      statement: query,
      wait_timeout: '30s',
    }),
  });

  if (!response.ok) {
    throw new Error(`Databricks API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.status?.state !== 'SUCCEEDED') {
    throw new Error(`SQL query failed: ${result.status?.error?.message || 'Unknown error'}`);
  }

  const columns = result.manifest?.schema?.columns?.map(
    (col: { name: string }) => col.name
  ) || [];

  const data = result.result?.data_array?.map((row: unknown[]) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj;
  }) || [];

  return { columns, data };
}

// Check if Databricks is configured
export function isDatabricksConfigured(): boolean {
  return Boolean(DATABRICKS_HOST && DATABRICKS_TOKEN);
}
