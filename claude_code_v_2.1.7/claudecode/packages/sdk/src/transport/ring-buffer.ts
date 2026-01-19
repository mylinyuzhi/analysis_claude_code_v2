/**
 * @claudecode/sdk - Ring Buffer
 *
 * Ring buffer for message replay after WebSocket reconnection.
 * Reconstructed from chunks.155.mjs (used in Vy0)
 */

import { SDK_CONSTANTS } from '../types.js';

/**
 * Ring buffer for message buffering with fixed capacity.
 * Used for WebSocket message replay after reconnection.
 */
export class RingBuffer<T> {
  private buffer: T[];
  private head: number = 0;
  private tail: number = 0;
  private size: number = 0;
  private readonly capacity: number;

  constructor(capacity: number = SDK_CONSTANTS.MESSAGE_BUFFER_SIZE) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  /**
   * Add item to buffer.
   * If buffer is full, oldest item is overwritten.
   */
  add(item: T): void {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    } else {
      // Buffer is full, move head forward (overwrite oldest)
      this.head = (this.head + 1) % this.capacity;
    }
  }

  /**
   * Get all items as array, in insertion order.
   */
  toArray(): T[] {
    if (this.size === 0) {
      return [];
    }

    const result: T[] = [];
    let index = this.head;

    for (let i = 0; i < this.size; i++) {
      // size 约束保证该槽位已被写入；这里用非空断言避免 noUncheckedIndexedAccess 误报。
      result.push(this.buffer[index]!);
      index = (index + 1) % this.capacity;
    }

    return result;
  }

  /**
   * Get number of items in buffer.
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Clear buffer.
   */
  clear(): void {
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  /**
   * Find index of item matching predicate.
   */
  findIndex(predicate: (item: T) => boolean): number {
    const arr = this.toArray();
    return arr.findIndex(predicate);
  }

  /**
   * Get items starting from index.
   */
  slice(startIndex: number): T[] {
    const arr = this.toArray();
    return arr.slice(startIndex);
  }
}

// NOTE: RingBuffer 已在声明处导出；移除重复聚合导出以避免 TS2323/TS2484。
