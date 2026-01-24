/**
 * @claudecode/integrations - Background Task Registry
 *
 * Registry for managing background tasks.
 * Reconstructed from chunks.91.mjs, chunks.121.mjs
 */

import { BACKGROUND_AGENT_CONSTANTS } from './types.js';
import { randomUUID } from 'crypto';
import type { 
  BackgroundTaskType,
  BackgroundTask,
  TaskRegistryEntry,
  TaskEvent,
  TaskEventHandler,
} from './types.js';

// ============================================
// Task Registry
// ============================================

/**
 * Background task registry.
 * Manages in-memory task state and event handling.
 */
export class BackgroundTaskRegistry {
  private tasks: Map<string, TaskRegistryEntry> = new Map();
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
   * Remove a task from registry.
   */
  remove(taskId: string): boolean {
    const existed = this.tasks.has(taskId);
    this.tasks.delete(taskId);
    return existed;
  }

  /**
   * Get all tasks.
   */
  getAll(): BackgroundTask[] {
    return Array.from(this.tasks.values()).map((entry) => entry.task);
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
    for (const entry of this.tasks.values()) {
      if (entry.task.status === 'running' && entry.abortController) {
        entry.abortController.abort();
      }
    }
    this.tasks.clear();
  }
}

// ============================================
// ID Generation
// ============================================

/**
 * Prefix mapping for task IDs.
 * Original: JG5 in chunks.91.mjs
 */
const TASK_TYPE_PREFIXES: Record<string, string> = {
  local_bash: BACKGROUND_AGENT_CONSTANTS.BASH_ID_PREFIX,
  local_agent: BACKGROUND_AGENT_CONSTANTS.AGENT_ID_PREFIX,
  remote_agent: BACKGROUND_AGENT_CONSTANTS.REMOTE_ID_PREFIX,
};

/**
 * Generate unique task ID based on type.
 * Original: GyA in chunks.91.mjs
 */
export function generateTaskId(type: BackgroundTaskType): string {
  const prefix = TASK_TYPE_PREFIXES[type] ?? 'x';
  // Source: GyA in chunks.91.mjs:904-908
  const id = randomUUID().replace(/-/g, '').substring(0, BACKGROUND_AGENT_CONSTANTS.ID_LENGTH);
  return `${prefix}${id}`;
}

/**
 * Generate bash task ID.
 */
export function generateBashTaskId(): string {
  return generateTaskId('local_bash');
}

/**
 * Generate agent task ID.
 */
export function generateAgentTaskId(): string {
  return generateTaskId('local_agent');
}

/**
 * Generate remote agent task ID.
 */
export function generateRemoteAgentTaskId(): string {
  return generateTaskId('remote_agent');
}

/**
 * Check if task ID is for a bash task.
 */
export function isBashTaskId(taskId: string): boolean {
  return taskId.startsWith(BACKGROUND_AGENT_CONSTANTS.BASH_ID_PREFIX);
}

/**
 * Check if task ID is for a remote agent task.
 */
export function isRemoteAgentTaskId(taskId: string): boolean {
  return taskId.startsWith(BACKGROUND_AGENT_CONSTANTS.REMOTE_ID_PREFIX);
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
