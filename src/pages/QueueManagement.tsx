import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shell } from "@/components/Shell";
import { toast } from "@/components/ui/use-toast";
import { useRegistrations } from '@/hooks/useRegistrations';

interface Ticket {
  id: string;
  name: string;
  program: string;
  status: "waiting" | "called" | "serving" | "completed" | "skipped";
  counter: string;
  operator?: {
    id: string;
    name: string;
  };
  timeCalled?: Date;
  timeCompleted?: Date;
}

const QueueManagement = () => {
  const { tickets, counters, operators, updateTicket, fetchTickets } = useRegistrations();
  const [selectedCounter, setSelectedCounter] = useState<string | undefined>(undefined);
  const [queue, setQueue] = useState<Ticket[]>([]);
  const [servingTicket, setServingTicket] = useState<Ticket | null>(null);
  const [completedTickets, setCompletedTickets] = useState<Ticket[]>([]);
  const [skippedTickets, setSkippedTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [status, setStatus] = useState<"waiting" | "called" | "serving" | "completed" | "skipped">("waiting");

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (tickets) {
      const filteredQueue = tickets.filter(ticket => ticket.status === "waiting" && ticket.counter === selectedCounter);
      setQueue(filteredQueue);

      const currentServingTicket = tickets.find(ticket => ticket.status === "serving" && ticket.counter === selectedCounter);
      setServingTicket(currentServingTicket || null);

      const completed = tickets.filter(ticket => ticket.status === "completed" && ticket.counter === selectedCounter);
      setCompletedTickets(completed);

      const skipped = tickets.filter(ticket => ticket.status === "skipped" && ticket.counter === selectedCounter);
      setSkippedTickets(skipped);
    }
  }, [tickets, selectedCounter]);

  const handleCounterChange = (value: string) => {
    setSelectedCounter(value);
  };

  const handleCallNext = async () => {
    if (!selectedCounter) {
      toast({
        title: "Error",
        description: "Please select a counter.",
        variant: "destructive",
      });
      return;
    }

    if (servingTicket) {
      toast({
        title: "Error",
        description: "Please complete or skip the current ticket before calling the next.",
        variant: "destructive",
      });
      return;
    }

    if (queue.length === 0) {
      toast({
        title: "Info",
        description: "No tickets in the queue.",
      });
      return;
    }

    const nextTicket = queue[0];
    if (nextTicket) {
      const operator = operators?.length ? operators[0] : undefined;
      const updatedTicket = {
        ...nextTicket,
        status: "called" as "completed" | "skipped" | "waiting" | "called" | "serving",
        counter: selectedCounter,
        operator: operator,
        timeCalled: new Date(),
      };
      setSelectedTicket(updatedTicket);

      try {
        await updateTicket(updatedTicket.id, updatedTicket);
        toast({
          title: "Success",
          description: `Ticket ${nextTicket.name} called.`,
        });
      } catch (error) {
        console.error("Error updating ticket:", error);
        toast({
          title: "Error",
          description: "Failed to update ticket.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartServing = async () => {
    if (!selectedTicket) {
      toast({
        title: "Error",
        description: "Please call a ticket first.",
        variant: "destructive",
      });
      return;
    }

    const updatedTicket = {
      ...selectedTicket,
      status: "serving" as "completed" | "skipped" | "waiting" | "called" | "serving",
    };

    try {
      await updateTicket(updatedTicket.id, updatedTicket);
      setSelectedTicket(updatedTicket);
      setServingTicket(updatedTicket);
      fetchTickets();
      toast({
        title: "Success",
        description: `Ticket ${selectedTicket.name} is now serving.`,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    if (!servingTicket) {
      toast({
        title: "Error",
        description: "No ticket is currently serving.",
        variant: "destructive",
      });
      return;
    }

    const updatedTicket = {
      ...servingTicket,
      status: "completed" as "completed" | "skipped" | "waiting" | "called" | "serving",
      timeCompleted: new Date(),
    };

    try {
      await updateTicket(updatedTicket.id, updatedTicket);
      setServingTicket(null);
      setSelectedTicket(null);
      fetchTickets();
      toast({
        title: "Success",
        description: `Ticket ${servingTicket.name} completed.`,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = async () => {
    if (!servingTicket) {
      toast({
        title: "Error",
        description: "No ticket is currently serving.",
        variant: "destructive",
      });
      return;
    }

    const updatedTicket = {
      ...servingTicket,
      status: "skipped" as "completed" | "skipped" | "waiting" | "called" | "serving",
    };

    try {
      await updateTicket(updatedTicket.id, updatedTicket);
      setServingTicket(null);
      setSelectedTicket(null);
      fetchTickets();
      toast({
        title: "Success",
        description: `Ticket ${servingTicket.name} skipped.`,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as "waiting" | "called" | "serving" | "completed" | "skipped");
    if (selectedTicket) {
      const updatedTicket = {
        ...selectedTicket,
        status: e.target.value as "completed" | "skipped" | "waiting" | "called" | "serving",
      };
      setSelectedTicket(updatedTicket);
    }
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Queue Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Counter Selection */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Select Counter</CardTitle>
              <CardDescription>Choose a counter to manage the queue.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Select onValueChange={handleCounterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a counter" />
                </SelectTrigger>
                <SelectContent>
                  {counters && counters.map((counter) => (
                    <SelectItem key={counter.id} value={counter.id}>{counter.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Queue Actions */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Queue Actions</CardTitle>
              <CardDescription>Manage the queue for the selected counter.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <Button onClick={handleCallNext} disabled={!selectedCounter || servingTicket !== null}>
                  Call Next Ticket
                </Button>
                {selectedTicket && selectedTicket.status === "called" && (
                  <Button onClick={handleStartServing} variant="secondary">
                    Start Serving {selectedTicket.name}
                  </Button>
                )}
                {servingTicket && (
                  <div className="flex space-x-2">
                    <Button onClick={handleComplete} variant="default">
                      Complete
                    </Button>
                    <Button onClick={handleSkip} variant="destructive">
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Status Update */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Update Ticket Status</CardTitle>
              <CardDescription>Update the status of the selected ticket.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => handleStatusChange({ target: { value } } as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="called">Called</SelectItem>
                    <SelectItem value="serving">Serving</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Queue List */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Queue List</CardTitle>
              <CardDescription>Tickets waiting in the queue.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] w-full">
                {queue.length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    {queue.map((ticket) => (
                      <Badge key={ticket.id} variant="secondary">
                        {ticket.name} - {ticket.program}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tickets in the queue.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Currently Serving */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Currently Serving</CardTitle>
              <CardDescription>Ticket currently being served.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {servingTicket ? (
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-700 font-semibold">{servingTicket.name}</p>
                  <p className="text-gray-500">Program: {servingTicket.program}</p>
                  {servingTicket.operator && (
                    <p className="text-gray-500">Operator: {servingTicket.operator.name}</p>
                  )}
                  <p className="text-gray-500">Time Called: {servingTicket.timeCalled?.toLocaleTimeString()}</p>
                </div>
              ) : (
                <p className="text-gray-500">No ticket is currently being served.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Completed Tickets */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Completed Tickets</CardTitle>
              <CardDescription>List of completed tickets.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] w-full">
                {completedTickets.length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    {completedTickets.map((ticket) => (
                      <Badge key={ticket.id} variant="success">
                        {ticket.name} - {ticket.program}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tickets completed.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Skipped Tickets */}
          <Card className="bg-white shadow-md rounded-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">Skipped Tickets</CardTitle>
              <CardDescription>List of skipped tickets.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[300px] w-full">
                {skippedTickets.length > 0 ? (
                  <div className="flex flex-col space-y-2">
                    {skippedTickets.map((ticket) => (
                      <Badge key={ticket.id} variant="destructive">
                        {ticket.name} - {ticket.program}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tickets skipped.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
};

export default QueueManagement;
