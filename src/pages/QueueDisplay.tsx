
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Shell } from "@/components/Shell";

interface QueueData {
  id: string;
  queueNumber: number;
  status: string;
  operator: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

const QueueDisplay = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<QueueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`https://api.example.com/queue/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: QueueData = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <Shell>Loading...</Shell>;
  }

  if (error) {
    return <Shell>Error: {error}</Shell>;
  }

  if (!data) {
    return <Shell>Queue not found</Shell>;
  }

  return (
    <Shell>
      <Card>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Nomor Antrian: {data.queueNumber}</h1>
          <div className="mb-2">
            <p className="text-sm text-gray-600">Status: {data.status}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Operator: {data.operator ? data.operator.name : 'Belum ditentukan'}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Dibuat pada: {new Date(data.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
};

export default QueueDisplay;
