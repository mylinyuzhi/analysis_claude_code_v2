/**
 * @claudecode/sdk - Async Message Queue
 *
 * Producer-consumer queue for asynchronous message streaming.
 * Reconstructed from chunks.133.mjs:3221-3280 (khA)
 */

export class AsyncMessageQueue<T> implements AsyncIterable<T> {
  private queue: T[] = [];
  private readResolve?: (value: { done: boolean; value: T | undefined }) => void;
  private readReject?: (error: Error) => void;
  private isDone = false;
  private hasError: Error | null = null;
  private started = false;
  private readonly returnedCallback?: () => void;

  constructor(returnedCallback?: () => void) {
    this.returnedCallback = returnedCallback;
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    if (this.started) {
      throw new Error('Stream can only be iterated once');
    }
    this.started = true;
    return {
      next: () => this.next(),
      return: () => this.return(),
    };
  }

  private next(): Promise<IteratorResult<T>> {
    if (this.queue.length > 0) {
      return Promise.resolve({
        done: false,
        value: this.queue.shift() as T,
      });
    }

    if (this.isDone) {
      return Promise.resolve({
        done: true,
        value: undefined as any,
      });
    }

    if (this.hasError) {
      return Promise.reject(this.hasError);
    }

    return new Promise((resolve, reject) => {
      this.readResolve = resolve;
      this.readReject = reject;
    });
  }

  /**
   * Add item to queue.
   * Original: enqueue() in khA
   */
  enqueue(item: T): void {
    if (this.isDone || this.hasError) return;

    if (this.readResolve) {
      const resolve = this.readResolve;
      this.readResolve = undefined;
      this.readReject = undefined;
      resolve({
        done: false,
        value: item,
      });
    } else {
      this.queue.push(item);
    }
  }

  /**
   * Mark queue as complete.
   * Original: done() in khA
   */
  done(): void {
    if (this.isDone) return;
    this.isDone = true;

    if (this.readResolve) {
      const resolve = this.readResolve;
      this.readResolve = undefined;
      this.readReject = undefined;
      resolve({
        done: true,
        value: undefined as any,
      });
    }
  }

  /**
   * Signal error in queue.
   * Original: error() in khA
   */
  error(err: Error): void {
    if (this.isDone || this.hasError) return;
    this.hasError = err;

    if (this.readReject) {
      const reject = this.readReject;
      this.readResolve = undefined;
      this.readReject = undefined;
      reject(err);
    }
  }

  /**
   * Handle iterator return.
   * Original: return() in khA
   */
  return(): Promise<IteratorResult<T>> {
    this.isDone = true;
    if (this.returnedCallback) {
      this.returnedCallback();
    }
    return Promise.resolve({
      done: true,
      value: undefined as any,
    });
  }
}
