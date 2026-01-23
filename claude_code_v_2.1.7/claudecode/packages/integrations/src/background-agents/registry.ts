/**
 * @claudecode/integrations - Background Task Registry
 *
 * Registry for managing background tasks.
 * Reconstructed from chunks.91.mjs, chunks.121.mjs
 */

import { generateTaskId as generateCoreTaskId } from '@claudecode/shared';
import type {
  BackgroundTask,
  BackgroundBashTask,
  BackgroundAgentTask,
  BackgroundTaskStatus,
  TaskRegistryEntry,
  TaskEvent,
  TaskEventHandler,
} from './types.js';
import { BACKGROUND_AGENT_CONSTANTS } from './types.js';

// ============================================
// Task Registry
// ============================================

/**
 * Background task registry.
 * Manages in-memory task state and event handling.
 */
export class BackgroundTaskRegistry {
  private tasks: Map<string, TaskRegistryEntry> = new Map();
  private outputFiles: Map<string, string> = new Map();
  private eventHandlers: Set<TaskEventHandler> = new Set();

  /**
   * Register a new task.
   */
  register(task: BackgroundTask, options?: { abortController?: AbortController }): void {
    const entry: TaskRegistryEntry = {
      task,
      abortController: options?.abortController,
    };
    this.tasks.set(task.id, entry);
    this.emit({ type: 'task_started', taskId: task.id, timestamp: Date.now() });
  }

  /**
   * Get task by ID.
   */
  get(taskId: string): BackgroundTask | undefined {
    return this.tasks.get(taskId)?.task;
  }

  /**
   * Get task entry by ID.
   */
  getEntry(taskId: string): TaskRegistryEntry | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Update task status.
   */
  updateStatus(taskId: string, status: BackgroundTaskStatus): void {
    const entry = this.tasks.get(taskId);
    if (!entry) return;

    entry.task.status = status;
    if (status !== 'running') {
      entry.task.endTime = Date.now();
    }

    const eventType = status === 'completed' ? 'task_completed' :
                      status === 'failed' ? 'task_failed' :
                      status === 'cancelled' ? 'task_cancelled' : 'task_output';

    this.emit({ type: eventType, taskId, timestamp: Date.now() });
  }

  /**
   * Update bash task output.
   */
  updateBashOutput(taskId: string, stdout?: string, stderr?: string): void {
    const entry = this.tasks.get(taskId);
    if (!entry || entry.task.type !== 'local_bash') return;

    const bashTask = entry.task as BackgroundBashTask;
    if (stdout !== undefined) bashTask.stdout += stdout;
    if (stderr !== undefined) bashTask.stderr += stderr;

    this.emit({
      type: 'task_output',
      taskId,
      timestamp: Date.now(),
      data: { stdout, stderr },
    });
  }

  /**
   * Set bash task exit code.
   */
  setBashExitCode(taskId: string, exitCode: number): void {
    const entry = this.tasks.get(taskId);
    if (!entry || entry.task.type !== 'local_bash') return;

    const bashTask = entry.task as BackgroundBashTask;
    bashTask.exitCode = exitCode;
    this.updateStatus(taskId, exitCode === 0 ? 'completed' : 'failed');
  }

  /**
   * Register output file for task.
   */
  registerOutputFile(taskId: string, outputPath: string): void {
    this.outputFiles.set(taskId, outputPath);

    const entry = this.tasks.get(taskId);
    if (entry && (entry.task.type === 'local_agent' || entry.task.type === 'remote_agent')) {
      (entry.task as BackgroundAgentTask).outputPath = outputPath;
    }
  }

  /**
   * Get output file path for task.
   */
  getOutputFile(taskId: string): string | undefined {
    return this.outputFiles.get(taskId);
  }

  /**
   * Cancel a task.
   */
  cancel(taskId: string): boolean {
    const entry = this.tasks.get(taskId);
    if (!entry || entry.task.status !== 'running') return false;

    if (entry.abortController) {
      entry.abortController.abort();
    }
    this.updateStatus(taskId, 'cancelled');
    return true;
  }

  /**
   * Remove a task from registry.
   */
  remove(taskId: string): boolean {
    const existed = this.tasks.has(taskId);
    this.tasks.delete(taskId);
    this.outputFiles.delete(taskId);
    return existed;
  }

  /**
   * Get all tasks.
   */
  getAll(): BackgroundTask[] {
    return Array.from(this.tasks.values()).map((entry) => entry.task);
  }

  /**
   * Get running tasks.
   */
  getRunning(): BackgroundTask[] {
    return this.getAll().filter((task) => task.status === 'running');
  }

  /**
   * Get tasks by type.
   */
  getByType(type: BackgroundTask['type']): BackgroundTask[] {
    return this.getAll().filter((task) => task.type === type);
  }

  /**
   * Check if task exists.
   */
  has(taskId: string): boolean {
    return this.tasks.has(taskId);
  }

  /**
   * Get task count.
   */
  get size(): number {
    return this.tasks.size;
  }

  /**
   * Subscribe to task events.
   */
  subscribe(handler: TaskEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  /**
   * Emit task event.
   */
  private emit(event: TaskEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch {
        // Ignore handler errors
      }
    }
  }

  /**
   * Clear all tasks.
   */
  clear(): void {
    // Cancel all running tasks
    for (const [taskId, entry] of this.tasks) {
      if (entry.task.status === 'running' && entry.abortController) {
        entry.abortController.abort();
      }
    }
    this.tasks.clear();
    this.outputFiles.clear();
  }
}

// ============================================
// ID Generation
// ============================================

/**
 * Generate unique task ID.
 * Original: YG5().replace(/-/g, "").substring(0, 6) in chunks.91.mjs
 */
export function generateTaskId(prefix?: string): string {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  const id = uuid.substring(0, BACKGROUND_AGENT_CONSTANTS.ID_LENGTH);
  return prefix ? `${prefix}${id}` : id;
}

/**
 * Generate bash task ID.
 */
export function generateBashTaskId(): string {
  return generateTaskId(BACKGROUND_AGENT_CONSTANTS.BASH_ID_PREFIX);
}

/**
 * Generate agent task ID.
 */
export function generateAgentTaskId(): string {
  return generateTaskId();
}

/**
 * Generate remote agent task ID.
 */
export function generateRemoteAgentTaskId(): string {
  return generateTaskId(BACKGROUND_AGENT_CONSTANTS.REMOTE_ID_PREFIX);
}

/**
 * Check if ID is a bash task ID.
 */
export function isBashTaskId(id: string): boolean {
  return id.startsWith(BACKGROUND_AGENT_CONSTANTS.BASH_ID_PREFIX);
}

/**
 * Check if ID is a remote agent task ID.
 */
export function isRemoteAgentTaskId(id: string): boolean {
  return id.startsWith(BACKGROUND_AGENT_CONSTANTS.REMOTE_ID_PREFIX);
}

// ============================================
// Singleton Instance
// ============================================

let registryInstance: BackgroundTaskRegistry | null = null;

/**
 * Get singleton registry instance.
 */
export function getTaskRegistry(): BackgroundTaskRegistry {
  if (!registryInstance) {
    registryInstance = new BackgroundTaskRegistry();
  }
  return registryInstance;
}

/**
 * Reset registry (for testing).
 */
export function resetTaskRegistry(): void {
  if (registryInstance) {
    registryInstance.clear();
  }
  registryInstance = null;
}

// ============================================
// Export
// ============================================

// NOTE: 符号已在声明处导出；移除重复聚合导出以避免构建期重复导出报错。
