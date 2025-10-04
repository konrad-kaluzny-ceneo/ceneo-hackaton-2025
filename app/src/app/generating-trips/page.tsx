'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

interface Task {
  id: string;
  status: TaskStatus;
  result?: any;
  error?: string;
}

function GeneratingTripsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initializeTask = async () => {
      const urlTaskId = searchParams.get('taskId');
      
      if (urlTaskId) {
        connectToTask(urlTaskId);
      } else {
        await createNewTask();
      }
    };

    initializeTask();
  }, []);

  const createNewTask = async () => {
    try {      
      const response = await fetch('/api/tasks/enqueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success && data.taskId) {
        const url = new URL(window.location.href);
        url.searchParams.set('taskId', data.taskId);
        window.history.pushState({}, '', url);
        
        connectToTask(data.taskId);
      } else {
        setError(data.error || 'Failed to start generating trips');
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to start generating trips');
    }
  };

  const connectToTask = (taskId: string) => {
    fetch(`/api/tasks/status?taskId=${taskId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.task) {
          setTask(data.task);
          
          if (data.task.status === 'COMPLETED') {
            redirectToResults(data.task.result);
          }
        }
      })
      .catch(err => {
        console.error('Failed to fetch initial task state:', err);
      });

    const eventSource = new EventSource(`/api/tasks/ws?taskId=${taskId}`);
    
    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'TASK_UPDATE' && message.task) {
          setTask(message.task);
          
          if (message.task.status === 'COMPLETED') {
            eventSource.close();
            redirectToResults(message.task.result);
          } else if (message.task.status === 'FAILED') {
            eventSource.close();
            setError(message.task.error || 'Failed to generate trips');
          }
        }
      } catch (err) {
        console.error('SSE message error:', err);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      // Don't set error here as EventSource will auto-reconnect
    };
  };

  const redirectToResults = (result: any) => {
    if (result) {
      sessionStorage.setItem('tripPropositionsResult', JSON.stringify(result));
    }
    router.push('/trip-propositions');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {error ? (
          <div className="space-y-4">
            <div className="text-6xl">😔</div>
            <h1 className="text-2xl font-semibold text-gray-900">Coś poszło nie tak</h1>
            <p className="text-base text-gray-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 bg-primary text-white border-none rounded-lg px-8 py-3 text-base font-bold cursor-pointer hover:bg-primary transition-colors">
              Spróbuj ponownie
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="space-y-6 border border-gray-300 rounded-lg px-4 py-8 shadow-md bg-white">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3D5A4C]"></div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Generujemy propozycje wycieczek...</h1>
              <p className="text-base text-gray-600">Czekaj cierpliwie, to może chwilę potrwać</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GeneratingTripsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3D5A4C]"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Ładowanie...
            </h1>
            <p className="text-base text-gray-600">
              Przygotowujemy wszystko dla Ciebie
            </p>
          </div>
        </div>
      </div>
    }>
      <GeneratingTripsContent />
    </Suspense>
  );
}
