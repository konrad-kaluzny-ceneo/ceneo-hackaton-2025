export enum TaskStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Task<T = any> {
  id: string;
  status: TaskStatus;
  progress?: number;
  result?: T;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export type TaskHandler<T = any> = () => Promise<T>;

export type TaskUpdateListener = (task: Task) => void;

/**
 * In-memory task queue for background processing
 */
export class TaskQueue {
  private tasks = new Map<string, Task>();
  private listeners = new Map<string, Set<TaskUpdateListener>>();
  private queue: Array<{ id: string; handler: TaskHandler }> = [];
  private isProcessing = false;
  private wsManager: any = null; // Will be set via setWebSocketManager

  /**
   * Set WebSocket manager for broadcasting updates
   */
  setWebSocketManager(wsManager: any): void {
    this.wsManager = wsManager;
  }

  /**
   * Enqueue a new task for background processing
   * @param handler The async function to execute
   * @returns Task ID for tracking
   */
  enqueue<T>(handler: TaskHandler<T>): string {
    const taskId = this.generateTaskId();
    
    const task: Task<T> = {
      id: taskId,
      status: TaskStatus.PENDING,
      progress: 0,
      createdAt: new Date()
    };

    this.tasks.set(taskId, task);
    this.queue.push({ id: taskId, handler });
    
    // Notify listeners about new task
    this.notifyListeners(taskId, task);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    return taskId;
  }

  /**
   * Get task status and details
   */
  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Subscribe to task updates
   */
  subscribe(taskId: string, listener: TaskUpdateListener): () => void {
    if (!this.listeners.has(taskId)) {
      this.listeners.set(taskId, new Set());
    }
    
    this.listeners.get(taskId)!.add(listener);

    // Send current state immediately
    const task = this.tasks.get(taskId);
    if (task) {
      listener(task);
    }

    // Return unsubscribe function
    return () => {
      const taskListeners = this.listeners.get(taskId);
      if (taskListeners) {
        taskListeners.delete(listener);
        if (taskListeners.size === 0) {
          this.listeners.delete(taskId);
        }
      }
    };
  }

  /**
   * Update task progress (can be called from within task handler)
   */
  updateProgress(taskId: string, progress: number): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.progress = progress;
      this.notifyListeners(taskId, task);
    }
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Clear completed tasks older than specified time
   */
  clearOldTasks(olderThanMs: number = 3600000): void {
    const now = Date.now();
    const tasksToDelete: string[] = [];

    this.tasks.forEach((task, id) => {
      if (
        (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED) &&
        task.completedAt &&
        now - task.completedAt.getTime() > olderThanMs
      ) {
        tasksToDelete.push(id);
      }
    });

    tasksToDelete.forEach(id => {
      this.tasks.delete(id);
      this.listeners.delete(id);
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      const task = this.tasks.get(item.id);
      if (!task) continue;

      // Update task to running
      task.status = TaskStatus.RUNNING;
      task.startedAt = new Date();
      task.progress = 0;
      this.notifyListeners(item.id, task);

      try {
        // Execute the task handler
        const result = await item.handler();

        // Mark as completed
        task.status = TaskStatus.COMPLETED;
        task.result = result;
        task.progress = 100;
        task.completedAt = new Date();
        this.notifyListeners(item.id, task);
      } catch (error) {
        // Mark as failed
        task.status = TaskStatus.FAILED;
        task.error = error instanceof Error ? error.message : String(error);
        task.completedAt = new Date();
        this.notifyListeners(item.id, task);
      }
    }

    this.isProcessing = false;
  }

  private notifyListeners(taskId: string, task: Task): void {
    const taskListeners = this.listeners.get(taskId);
    if (taskListeners) {
      taskListeners.forEach(listener => listener(task));
    }

    // Also broadcast via WebSocket if available
    if (this.wsManager) {
      this.wsManager.broadcastTaskUpdate(task);
    }
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
