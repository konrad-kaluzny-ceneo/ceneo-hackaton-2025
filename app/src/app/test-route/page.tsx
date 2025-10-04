'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ApiResponse {
  message: string;
  method: string;
  timestamp: string;
  query?: Record<string, string>;
  receivedData?: any;
  updatedData?: any;
  deletedId?: string;
  error?: string;
}

export default function TestRoutePage() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('John');
  const [jsonData, setJsonData] = useState('{"name": "John Doe", "email": "john@example.com"}');

  const handleApiCall = async (method: string, endpoint: string, body?: any) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(endpoint, options);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        message: 'Request failed',
        method,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGet = () => {
    const endpoint = `/api/test-route?name=${encodeURIComponent(name)}`;
    handleApiCall('GET', endpoint);
  };

  const handlePost = () => {
    try {
      const body = JSON.parse(jsonData);
      handleApiCall('POST', '/api/test-route', body);
    } catch (error) {
      setResponse({
        message: 'Invalid JSON data',
        method: 'POST',
        timestamp: new Date().toISOString(),
        error: 'Please enter valid JSON'
      });
    }
  };

  const handlePut = () => {
    try {
      const body = JSON.parse(jsonData);
      handleApiCall('PUT', '/api/test-route', body);
    } catch (error) {
      setResponse({
        message: 'Invalid JSON data',
        method: 'PUT',
        timestamp: new Date().toISOString(),
        error: 'Please enter valid JSON'
      });
    }
  };

  const handleDelete = () => {
    const id = prompt('Enter ID to delete:');
    if (id) {
      handleApiCall('DELETE', `/api/test-route?id=${encodeURIComponent(id)}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Route Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GET Request */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">GET Request</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name Parameter:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter name"
              />
            </div>
            <Button onClick={handleGet} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Send GET Request'}
            </Button>
          </div>
        </div>

        {/* POST Request */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">POST Request</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">JSON Data:</label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder='{"name": "John", "email": "john@example.com"}'
              />
            </div>
            <Button onClick={handlePost} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Send POST Request'}
            </Button>
          </div>
        </div>

        {/* PUT Request */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">PUT Request</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Update Data:</label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder='{"id": 1, "name": "Updated Name"}'
              />
            </div>
            <Button onClick={handlePut} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Send PUT Request'}
            </Button>
          </div>
        </div>

        {/* DELETE Request */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">DELETE Request</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Click the button to delete a resource by ID
            </p>
            <Button onClick={handleDelete} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Send DELETE Request'}
            </Button>
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="mt-6 border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">API Response</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
