
import React from 'react';
import { FileText, Calendar, User, Hospital, Tag } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HealthRecordProps {
  record: {
    _id: string;
    recordType: 'prescription' | 'test_result' | 'health_metric' | 'doctor_note';
    title: string;
    date: string;
    doctorName?: string;
    hospitalName?: string;
    description?: string;
    fileUrl?: string;
    tags?: string[];
  };
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const getRecordTypeIcon = (recordType: string) => {
  switch (recordType) {
    case 'prescription':
      return <FileText className="text-blue-500" />;
    case 'test_result':
      return <FileText className="text-green-500" />;
    case 'health_metric':
      return <FileText className="text-purple-500" />;
    case 'doctor_note':
      return <FileText className="text-orange-500" />;
    default:
      return <FileText />;
  }
};

const getReadableType = (recordType: string) => {
  switch (recordType) {
    case 'prescription':
      return 'Prescription';
    case 'test_result':
      return 'Test Result';
    case 'health_metric':
      return 'Health Metric';
    case 'doctor_note':
      return 'Doctor Note';
    default:
      return recordType;
  }
};

const HealthRecordCard: React.FC<HealthRecordProps> = ({ record, onView, onDelete }) => {
  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-6 flex-grow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getRecordTypeIcon(record.recordType)}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                  {getReadableType(record.recordType)}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(record.date), { addSuffix: true })}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-2">{record.title}</h3>
            
            {record.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {record.description}
              </p>
            )}
            
            <div className="mt-3 space-y-1 text-sm">
              {record.doctorName && (
                <div className="flex items-center text-muted-foreground">
                  <User className="h-3 w-3 mr-2" />
                  <span>Dr. {record.doctorName}</span>
                </div>
              )}
              
              {record.hospitalName && (
                <div className="flex items-center text-muted-foreground">
                  <Hospital className="h-3 w-3 mr-2" />
                  <span>{record.hospitalName}</span>
                </div>
              )}
            </div>
            
            {record.tags && record.tags.length > 0 && (
              <div className="flex items-center mt-3 gap-1 flex-wrap">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {record.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(record._id)}
              >
                View Details
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive" 
                onClick={() => onDelete(record._id)}
              >
                Delete
              </Button>
            </div>
          </div>
          
          {record.fileUrl && (
            <div className="w-full md:w-32 bg-muted flex items-center justify-center">
              <div className="p-2">
                <img 
                  src={record.fileUrl} 
                  alt={record.title} 
                  className="w-full h-auto object-cover" 
                  onError={(e) => {
                    // If image fails to load, replace with a file icon
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                      icon.className = 'text-muted-foreground';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthRecordCard;
