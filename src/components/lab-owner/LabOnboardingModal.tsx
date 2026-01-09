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
      title={`Lab Onboarding - Step ${currentStep} of 5`}
      isOpen={show}
      onClose={onClose}
      maxWidth="2xl"
    >
      <Progress value={(currentStep / 5) * 100} className="mb-6" />

      {currentStep === 1 && (
        <div className="space-y-4">
          <InputGroup
            label="Lab Name*"
            value={labData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter lab name"
          />
          <div className="grid grid-cols-2 gap-4">
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
              placeholder="Lab registration number"
            />
          </div>
          <InputGroup
            label="Description"
            value={labData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description about your lab"
          />
          <InputGroup
            label="Established Date"
            type="date"
            value={labData.establishedDate}
            onChange={(e) => handleInputChange('establishedDate', e.target.value)}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Email*"
              type="email"
              value={labData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@lab.com"
            />
            <InputGroup
              label="Phone*"
              value={labData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Emergency Contact"
              value={labData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
            <InputGroup
              label="Website"
              value={labData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourlab.com"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputGroup
              label="Street*"
              value={labData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Street address"
            />
            <InputGroup
              label="City*"
              value={labData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
            <InputGroup
              label="State*"
              value={labData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Zip Code*"
              value={labData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="Postal code"
            />
            <InputGroup
              label="Landmark"
              value={labData.landmark}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              placeholder="Nearby landmark"
            />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Facilities</h4>
            <div className="grid grid-cols-2 gap-3">
              {facilityOptions.map(facility => (
                <Checkbox
                  key={facility}
                  id={`facility-${facility}`}
                  label={facility}
                  checked={labData.facilities.includes(facility)}
                  onCheckedChange={(checked) => {
                    const newFacilities = checked
                      ? [...labData.facilities, facility]
                      : labData.facilities.filter(f => f !== facility);
                    handleInputChange('facilities', newFacilities);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Certifications</h4>
            <div className="grid grid-cols-3 gap-3">
              {certificationOptions.map(cert => (
                <Checkbox
                  key={cert}
                  id={`cert-${cert}`}
                  label={cert}
                  checked={labData.certifications.includes(cert)}
                  onCheckedChange={(checked) => {
                    const newCerts = checked
                      ? [...labData.certifications, cert]
                      : labData.certifications.filter(c => c !== cert);
                    handleInputChange('certifications', newCerts);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Services Offered</h4>
            <div className="grid grid-cols-2 gap-3">
              {serviceOptions.map(service => (
                <Checkbox
                  key={service}
                  id={`service-${service}`}
                  label={service}
                  checked={labData.services.includes(service)}
                  onCheckedChange={(checked) => {
                    const newServices = checked
                      ? [...labData.services, service]
                      : labData.services.filter(s => s !== service);
                    handleInputChange('services', newServices);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Working Hours</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Weekdays Open"
                  type="time"
                  value={labData.workingHours.weekdays.open}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekdays.open', e.target.value)}
                />
                <InputGroup
                  label="Weekdays Close"
                  type="time"
                  value={labData.workingHours.weekdays.close}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekdays.close', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Weekends Open"
                  type="time"
                  value={labData.workingHours.weekends.open}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekends.open', e.target.value)}
                />
                <InputGroup
                  label="Weekends Close"
                  type="time"
                  value={labData.workingHours.weekends.close}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekends.close', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Staff Configuration</h4>
            <div className="grid grid-cols-3 gap-4">
              <InputGroup
                label="Pathologists"
                type="number"
                min="0"
                value={labData.staff.pathologists}
                onChange={(e) => handleNestedInputChange('staff', 'pathologists', parseInt(e.target.value))}
              />
              <InputGroup
                label="Technicians"
                type="number"
                min="0"
                value={labData.staff.technicians}
                onChange={(e) => handleNestedInputChange('staff', 'technicians', parseInt(e.target.value))}
              />
              <InputGroup
                label="Receptionists"
                type="number"
                min="0"
                value={labData.staff.receptionists}
                onChange={(e) => handleNestedInputChange('staff', 'receptionists', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="p-5 border rounded-xl bg-gray-50">
            <h3 className="font-semibold mb-3">Final Review</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Lab Name:</span> <span className="font-medium text-right">{labData.name}</span>
              <span className="text-muted-foreground">Address:</span> <span className="font-medium text-right">{labData.city}, {labData.state}</span>
              <span className="text-muted-foreground">Contact:</span> <span className="font-medium text-right">{labData.phone}</span>
              <span className="text-muted-foreground">Staff Total:</span> <span className="font-medium text-right">{labData.staff.pathologists + labData.staff.technicians + labData.staff.receptionists}</span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground pt-4">By clicking complete, you agree to our terms of laboratory partnership.</p>
        </div>
      )}

      <div className="flex justify-between mt-8 border-t pt-6">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={() => onStepChange(currentStep - 1)}>Previous</Button>
        ) : <div />}

        {currentStep < 5 ? (
          <Button onClick={() => onStepChange(currentStep + 1)}>Next Step</Button>
        ) : (
          <Button onClick={onSubmit}>Complete Onboarding</Button>
        )}
      </div>
    </Modal>
  );
};
