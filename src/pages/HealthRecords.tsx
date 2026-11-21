
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { healthRecordsAPI } from "@/services/api";
import HealthRecordsList from "@/components/health/HealthRecordsList";
import HealthAnalytics from "@/components/health/HealthAnalytics";
import AddHealthRecordForm from "@/components/health/AddHealthRecordForm";
import PrescriptionModal from "@/components/health/PrescriptionModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
  isDigital?: boolean;
  medicines?: any[];
  signature_url?: string;
}

const HealthRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<HealthRecord | null>(null);
  
  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setIsLoading(true);
        const response = await healthRecordsAPI.getAllRecords();
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching health records:', error);
        toast.error('Failed to load health records');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHealthRecords();
  }, []);
  
  const handleViewRecord = (id: string) => {
    const record = records.find(r => r._id === id);
    if (record?.isDigital) {
      setSelectedPrescription(record);
    } else {
      toast.info(`Viewing details for ${record?.title}`);
      // Show file modal or something else for non-digital
    }
  };
  
  const handleDeleteRecord = async (id: string) => {
    try {
      await healthRecordsAPI.deleteRecord(id);
      setRecords(records.filter(record => record._id !== id));
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };
  
  const handleAddRecord = () => {
    setIsAddingRecord(true);
  };
  
  const handleSaveRecord = async (data: any) => {
    try {
      const response = await healthRecordsAPI.createRecord(data);
      setRecords([...records, response.data]);
      setIsAddingRecord(false);
      toast.success('Record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add record');
    }
  };
  
  const handleCancelAddRecord = () => {
    setIsAddingRecord(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Health Records</h1>
          <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
        </div>
        
        {isAddingRecord ? (
          <AddHealthRecordForm 
            onSubmit={handleSaveRecord}
            onCancel={handleCancelAddRecord}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="records">My Records</TabsTrigger>
              <TabsTrigger value="analytics">Health Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <CardTitle>Health Records</CardTitle>
                  <CardDescription>
                    Manage your prescriptions, test results, and health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthRecordsList 
                    records={records}
                    onViewRecord={handleViewRecord}
                    onDeleteRecord={handleDeleteRecord}
                    onAddRecord={handleAddRecord}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Health Analytics</CardTitle>
                  <CardDescription>
                    Track and analyze your health metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthAnalytics healthData={[]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <PrescriptionModal 
        isOpen={!!selectedPrescription}
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
};

export default HealthRecords;
