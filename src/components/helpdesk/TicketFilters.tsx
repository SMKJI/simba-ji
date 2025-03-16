
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegistrations } from '@/hooks/useRegistrations';

interface TicketFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (priority: 'all' | 'low' | 'medium' | 'high') => void;
  operatorFilter: string;
  setOperatorFilter: (operatorId: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  resetFilters: () => void;
  getPriorityCount: (priority: 'low' | 'medium' | 'high') => number;
}

const TicketFilters = ({
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  operatorFilter,
  setOperatorFilter,
  showFilters,
  setShowFilters,
  resetFilters,
  getPriorityCount
}: TicketFiltersProps) => {
  const { hasRole, getHelpdeskOperators } = useRegistrations();
  const operators = getHelpdeskOperators();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4 sm:mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari tiket..."
          className="pl-8 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Popover open={showFilters} onOpenChange={setShowFilters}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {(priorityFilter !== 'all' || operatorFilter !== 'all') && (
              <Badge variant="secondary" className="ml-1">!</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Filter Tiket</h3>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="priority-filter">Filter Prioritas</label>
              <Select 
                value={priorityFilter} 
                onValueChange={(value) => setPriorityFilter(value as any)}
              >
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="Semua prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua prioritas</SelectItem>
                  <SelectItem value="high">Prioritas Tinggi ({getPriorityCount('high')})</SelectItem>
                  <SelectItem value="medium">Prioritas Menengah ({getPriorityCount('medium')})</SelectItem>
                  <SelectItem value="low">Prioritas Rendah ({getPriorityCount('low')})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasRole(['admin', 'helpdesk']) && (
              <div className="space-y-2">
                <label className="text-sm" htmlFor="operator-filter">Filter Operator</label>
                <Select 
                  value={operatorFilter} 
                  onValueChange={setOperatorFilter}
                >
                  <SelectTrigger id="operator-filter">
                    <SelectValue placeholder="Semua operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua operator</SelectItem>
                    {operators.map(op => (
                      <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                    ))}
                    <SelectItem value="unassigned">Belum ditetapkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filter
              </Button>
              <Button size="sm" onClick={() => setShowFilters(false)}>
                Terapkan
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TicketFilters;
