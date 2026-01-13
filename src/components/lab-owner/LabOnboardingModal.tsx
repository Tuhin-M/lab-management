import React from "react";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/common/Modal";
import { InputGroup } from "@/components/common/InputGroup";
import { Select } from "@/components/common/Select";
import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/common/Button";

export interface LabCreateRequest {
  name: string;
  type: string;
  description: string;
  establishedDate: string;
  registrationNumber: string;
  email: string;
  phone: string;
  emergencyContact: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark: string;
  facilities: string[];
  certifications: string[];
  workingHours: {
    weekdays: { open: string; close: string };
    weekends: { open: string; close: string };
    holidays: { open: string; close: string };
  };
  staff: {
    pathologists: number;
    technicians: number;
    receptionists: number;
  };
  services: string[];
}

interface LabOnboardingModalProps {
  show: boolean;
  onClose: () => void;
  currentStep: number;
  labData: LabCreateRequest;
  onLabDataChange: (data: LabCreateRequest) => void;
  onSubmit: () => void;
  onStepChange: (step: number) => void;
}

export const LabOnboardingModal = ({
  show,
  onClose,
  currentStep,
  labData,
  onLabDataChange,
  onSubmit,
  onStepChange
}: LabOnboardingModalProps) => {
  const labTypes = [
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'Pathology', label: 'Pathology' },
    { value: 'Imaging', label: 'Imaging' },
    { value: 'Specialty', label: 'Specialty' },
    { value: 'Hospital', label: 'Hospital' }
  ];

  const facilityOptions = [
    'Home Collection', 'Digital Reports', 'Ambulance Service', 'NABL Accredited',
    '24/7 Emergency', 'Wheelchair Accessible', 'Parking Available', 'Phlebotomy Services'
  ];

  const certificationOptions = ['NABL', 'ISO', 'CAP', 'JCI', 'NABH', 'CLIA'];
  const serviceOptions = [
    'Blood Tests', 'Urine Tests', 'Imaging', 'Biopsy', 'Genetic Testing', 'Allergy Testing', 'COVID Testing'
  ];

  const handleInputChange = (field: string, value: any) => {
    onLabDataChange({ ...labData, [field]: value });
  };

  const handleNestedInputChange = (parentField: string, fieldPath: string, value: any) => {
    const keys = fieldPath.split('.');
    const newData = { ...labData } as any;

    if (keys.length === 1) {
      newData[parentField] = { ...newData[parentField], [keys[0]]: value };
    } else {
      newData[parentField] = {
        ...newData[parentField],
        [keys[0]]: { ...newData[parentField][keys[0]], [keys[1]]: value }
      };
    }

    onLabDataChange(newData);
  };

  return (
    <Modal
      title={`Lab Onboarding - Step ${currentStep} of 2`}
      isOpen={show}
      onClose={onClose}
      maxWidth="xl"
    >
      <Progress value={(currentStep / 2) * 100} className="mb-6 h-2" />

      {currentStep === 1 && (
        <div className="space-y-5">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-2">
            <h4 className="text-sm font-semibold text-primary mb-1">Let's get started</h4>
            <p className="text-xs text-slate-600">Enter the basic identity of your laboratory. You can add more details and tests later.</p>
          </div>

          <InputGroup
            label="Lab Name*"
            value={labData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g. Central Diagnostics"
            className="rounded-xl"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Lab Type*"
              value={labData.type}
              options={labTypes}
              onValueChange={(val) => handleInputChange('type', val)}
              placeholder="Select lab type"
            />
            <InputGroup
              label="Registration Number*"
              value={labData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              placeholder="e.g. 123456789"
            />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
            <h4 className="text-sm font-semibold text-blue-700 mb-1">Contact & Primary Location</h4>
            <p className="text-xs text-slate-600">Provide ways for patients to find and contact you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Business Email*"
              type="email"
              value={labData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@lab.com"
            />
            <InputGroup
              label="Primary Phone*"
              value={labData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="City*"
              value={labData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="e.g. Mumbai"
            />
            <InputGroup
              label="State*"
              value={labData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="e.g. Maharashtra"
            />
          </div>

          <div className="mt-4 p-4 border rounded-xl bg-slate-50">
            <h3 className="text-sm font-semibold mb-2">Verification Summary</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between"><span>Lab Name:</span> <span className="font-medium text-slate-900">{labData.name || 'Not set'}</span></div>
              <div className="flex justify-between"><span>Location:</span> <span className="font-medium text-slate-900">{labData.city || 'Not set'}, {labData.state}</span></div>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-4 italic">By clicking complete, you agree to our laboratory partnership agreement.</p>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
        {currentStep > 1 ? (
          <Button variant="ghost" onClick={() => onStepChange(currentStep - 1)} className="rounded-xl">Previous</Button>
        ) : <div />}

        {currentStep < 2 ? (
          <Button onClick={() => onStepChange(currentStep + 1)} className="rounded-xl">Next: Contact Info</Button>
        ) : (
          <Button onClick={onSubmit} className="rounded-xl shadow-lg shadow-primary/20">Complete Onboarding</Button>
        )}
      </div>
    </Modal>
  );
};
