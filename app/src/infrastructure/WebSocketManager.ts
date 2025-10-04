/**
 * WebSocket Manager for real-time task updates
 * Manages WebSocket connections and broadcasts task updates to clients
 */

import { Task } from './TaskQueue';

export interface WebSocketClient {
  id: string;
  send: (data: any) => void;
  close: () => void;
}

export class WebSocketManager {
  private clients = new Map<string, WebSocketClient>();
  private taskSubscriptions = new Map<string, Set<string>>(); // taskId -> Set of clientIds

  /**
   * Register a new WebSocket client
   */
  registerClient(clientId: string, client: WebSocketClient): void {
    this.clients.set(clientId, client);
    console.log(`WebSocket client registered: ${clientId}`);
  }

  /**
   * Unregister a WebSocket client
   */
  unregisterClient(clientId: string): void {
    this.clients.delete(clientId);
    
    // Remove client from all task subscriptions
    this.taskSubscriptions.forEach((subscribers) => {
      subscribers.delete(clientId);
    });
    
    console.log(`WebSocket client unregistered: ${clientId}`);
  }

  /**
   * Subscribe a client to task updates
   */
  subscribeToTask(clientId: string, taskId: string): void {
    if (!this.taskSubscriptions.has(taskId)) {
      this.taskSubscriptions.set(taskId, new Set());
    }
    
    this.taskSubscriptions.get(taskId)!.add(clientId);
  }

  /**
   * Unsubscribe a client from task updates
   */
  unsubscribeFromTask(clientId: string, taskId: string): void {
    const subscribers = this.taskSubscriptions.get(taskId);
    if (subscribers) {
      subscribers.delete(clientId);
      if (subscribers.size === 0) {
        this.taskSubscriptions.delete(taskId);
      }
    }
  }

  /**
   * Broadcast task update to all subscribed clients
   */
  broadcastTaskUpdate(task: Task): void {
    const subscribers = this.taskSubscriptions.get(task.id);
    if (!subscribers) return;

    const message = {
      type: 'TASK_UPDATE',
      task
    };

    subscribers.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client) {
        try {
          client.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send message to client ${clientId}:`, error);
        }
      }
    });
  }

  /**
   * Send message to a specific client
   */
  sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.send(typeof message === 'string' ? message : JSON.stringify(message));
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error);
      }
    }
  }

  /**
   * Get all connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get subscribers count for a task
   */
  getTaskSubscribersCount(taskId: string): number {
    return this.taskSubscriptions.get(taskId)?.size || 0;
  }
}
