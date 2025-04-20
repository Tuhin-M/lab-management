
import React, { useState } from 'react';
import HealthRecordCard from './HealthRecordCard';
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthRecord {
  _id: string;
  recordType: 'prescription' | 'test_result' | 'health_metric' | 'doctor_note';
  title: string;
  date: string;
  doctorName?: string;
  hospitalName?: string;
  description?: string;
  fileUrl?: string;
  tags?: string[];
}

interface HealthRecordsListProps {
  records: HealthRecord[];
  onViewRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onAddRecord: () => void;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  records,
  onViewRecord,
  onDeleteRecord,
  onAddRecord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.description && record.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.doctorName && record.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.hospitalName && record.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'all') {
      return matchesSearch;
    }
    
    return record.recordType === activeFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddRecord}>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveFilter}>
        <TabsList className="w-full md:w-auto flex justify-start overflow-auto">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="test_result">Test Results</TabsTrigger>
          <TabsTrigger value="health_metric">Health Metrics</TabsTrigger>
          <TabsTrigger value="doctor_note">Doctor Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-4">
          {filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <HealthRecordCard 
                  key={record._id}
                  record={record}
                  onView={onViewRecord}
                  onDelete={onDeleteRecord}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">No health records found</p>
              <Button variant="outline" className="mt-4" onClick={onAddRecord}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Record
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecordsList;
