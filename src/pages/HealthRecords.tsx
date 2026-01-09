
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { healthRecordsAPI } from "@/services/api";
import HealthRecordsList from "@/components/health/HealthRecordsList";
import HealthAnalytics from "@/components/health/HealthAnalytics";
import AddHealthRecordForm from "@/components/health/AddHealthRecordForm";
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
}

const HealthRecords = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  
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
    toast.info(`Viewing record ${id}`);
    // You can implement a detailed view or modal here
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

  // Demo data to show functionality while API is being implemented
  const demoRecords: HealthRecord[] = [
    {
      _id: '1',
      recordType: 'prescription',
      title: 'Amoxicillin 500mg',
      date: '2023-05-15T10:30:00Z',
      doctorName: 'Dr. Sarah Johnson',
      hospitalName: 'City Medical Center',
      description: 'Take 1 tablet 3 times daily after meals for 7 days.',
      tags: ['antibiotic', 'infection']
    },
    {
      _id: '2',
      recordType: 'test_result',
      title: 'Complete Blood Count (CBC)',
      date: '2023-06-02T14:45:00Z',
      doctorName: 'Dr. Michael Chen',
      hospitalName: 'HealthPlus Diagnostics',
      description: 'Normal blood cell counts. Slight elevation in white blood cells.',
      tags: ['blood test', 'routine checkup']
    },
    {
      _id: '3',
      recordType: 'health_metric',
      title: 'Blood Pressure Reading',
      date: '2023-06-20T08:15:00Z',
      description: 'Morning reading: 120/80 mmHg',
      tags: ['blood pressure', 'morning']
    },
    {
      _id: '4',
      recordType: 'doctor_note',
      title: 'Annual Physical Examination',
      date: '2023-04-10T11:00:00Z',
      doctorName: 'Dr. Emily Williams',
      hospitalName: 'Wellness Clinic',
      description: 'Patient is in good health. Recommended to maintain current diet and exercise regimen.',
      tags: ['checkup', 'annual']
    },
    {
      _id: '5',
      recordType: 'test_result',
      title: 'Lipid Profile',
      date: '2023-03-25T09:30:00Z',
      doctorName: 'Dr. Robert Lee',
      hospitalName: 'Metropolis Labs',
      description: 'Cholesterol: 190 mg/dL, HDL: 60 mg/dL, LDL: 110 mg/dL, Triglycerides: 100 mg/dL',
      tags: ['cholesterol', 'lipids']
    }
  ];

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
                    records={records.length > 0 ? records : demoRecords}
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
    </div>
  );
};

export default HealthRecords;
