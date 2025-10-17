import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Search, Filter, X } from 'lucide-react';
import { Report, ReportCategory, ReportStatus, ReportPriority } from '../types/report';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterCriteria) => void;
}

export interface FilterCriteria {
  category?: ReportCategory | 'all';
  status?: ReportStatus | 'all';
  priority?: ReportPriority | 'all';
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function SearchAndFilter({ onSearch, onFilter }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    category: 'all',
    status: 'all',
    priority: 'all',
  });

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: keyof FilterCriteria, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterCriteria = {
      category: 'all',
      status: 'all',
      priority: 'all',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by title, description, or reporter name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-11"
          />
        </div>
        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={hasActiveFilters ? 'border-blue-500 text-blue-700' : ''}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-900">Filter Options</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Category</label>
              <Select 
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="potholes">Potholes</SelectItem>
                  <SelectItem value="streetlight">Street Light</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                  <SelectItem value="water-supply">Water Supply</SelectItem>
                  <SelectItem value="road-damage">Road Damage</SelectItem>
                  <SelectItem value="park-maintenance">Park Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Status</label>
              <Select 
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Priority</label>
              <Select 
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm text-slate-700">Date From</label>
              <Input 
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-slate-600">Active filters:</span>
              {filters.category && filters.category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Category: {filters.category}
                  <button onClick={() => handleFilterChange('category', 'all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.status && filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Status: {filters.status}
                  <button onClick={() => handleFilterChange('status', 'all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.priority && filters.priority !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Priority: {filters.priority}
                  <button onClick={() => handleFilterChange('priority', 'all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
