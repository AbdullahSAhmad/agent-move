import { execSync } from 'child_process';

const branchCache = new Map<string, { branch: string | null; ts: number }>();
const CACHE_TTL = 30_000; // 30s
const MAX_CACHE_SIZE = 100;

/** Get the current git branch for a project path, with caching */
export function getGitBranch(projectPath: string): string | null {
  const cached = branchCache.get(projectPath);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.branch;

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectPath,
      timeout: 5000,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
    branchCache.set(projectPath, { branch, ts: Date.now() });
    pruneCache();
    return branch;
  } catch {
    branchCache.set(projectPath, { branch: null, ts: Date.now() });
    return null;
  }
}

function pruneCache(): void {
  if (branchCache.size <= MAX_CACHE_SIZE) return;
  // Remove oldest entries
  const entries = [...branchCache.entries()].sort((a, b) => a[1].ts - b[1].ts);
  const toRemove = entries.slice(0, branchCache.size - MAX_CACHE_SIZE);
  for (const [key] of toRemove) branchCache.delete(key);
}
