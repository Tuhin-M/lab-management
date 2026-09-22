import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Modal } from "@/components/common/Modal";
import { InputGroup } from "@/components/common/InputGroup";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { INDIAN_STATES, getCitiesByState } from "@/data/indianLocations";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const labTypes = [
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'Pathology', label: 'Pathology' },
    { value: 'Imaging', label: 'Imaging' },
    { value: 'Specialty', label: 'Specialty' },
    { value: 'Hospital', label: 'Hospital' }
  ];

  const stateOptions = INDIAN_STATES.map((state) => ({
    value: state,
    label: state
  }));

  const availableCities = labData.state ? getCitiesByState(labData.state) : [];
  const cityOptions = availableCities.map((city) => ({
    value: city,
    label: city
  }));

  const handleInputChange = (field: string, value: any) => {
    // Clear error for the field being edited
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    if (field === 'state') {
      // Reset city when state changes
      onLabDataChange({ ...labData, state: value, city: '' });
      if (errors.city) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.city;
          return updated;
        });
      }
      return;
    }

    onLabDataChange({ ...labData, [field]: value });
  };

  const validateStep1 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!labData.name || labData.name.trim().length < 2) {
      stepErrors.name = "Laboratory name must be at least 2 characters.";
    } else if (labData.name.length > 100) {
      stepErrors.name = "Laboratory name cannot exceed 100 characters.";
    }

    if (!labData.type) {
      stepErrors.type = "Please select a laboratory type.";
    }

    if (!labData.registrationNumber || labData.registrationNumber.trim().length < 3) {
      stepErrors.registrationNumber = "Valid registration/license number is required (min 3 characters).";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!labData.email || !emailRegex.test(labData.email.trim())) {
      stepErrors.email = "Please enter a valid business email address.";
    }

    const phoneDigits = labData.phone ? labData.phone.replace(/\D/g, '') : '';
    if (!phoneDigits || !/^[6-9]\d{9}$/.test(phoneDigits)) {
      stepErrors.phone = "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }

    if (!labData.state) {
      stepErrors.state = "Please select a state.";
    }

    if (!labData.city) {
      stepErrors.city = labData.state ? "Please select a city." : "Select a state first.";
    }

    if (!labData.street || labData.street.trim().length < 5) {
      stepErrors.street = "Street address must be at least 5 characters.";
    }

    const zipDigits = labData.zipCode ? labData.zipCode.replace(/\D/g, '') : '';
    if (!zipDigits || !/^\d{6}$/.test(zipDigits)) {
      stepErrors.zipCode = "PIN Code must be exactly 6 digits.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        onStepChange(2);
      }
    }
  };

  const handleComplete = () => {
    if (validateStep2()) {
      onSubmit();
    }
  };

  const handleModalClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title={`Lab Onboarding - Step ${currentStep} of 2`}
      isOpen={show}
      onClose={handleModalClose}
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
            label="Lab Name *"
            value={labData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g. Central Diagnostics"
            className="rounded-xl"
            error={errors.name}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Lab Type *"
              value={labData.type}
              options={labTypes}
              onValueChange={(val) => handleInputChange('type', val)}
              placeholder="Select lab type"
              error={errors.type}
            />
            <InputGroup
              label="Registration Number *"
              value={labData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              placeholder="e.g. REG-123456"
              error={errors.registrationNumber}
            />
          </div>

          <InputGroup
            label="Brief Description (optional)"
            value={labData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief overview of lab facilities and specialties..."
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
            <h4 className="text-sm font-semibold text-blue-700 mb-1">Contact & Primary Location</h4>
            <p className="text-xs text-slate-600">Standardized location data enables patients to find your lab through location search filters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Business Email *"
              type="email"
              value={labData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@lab.com"
              error={errors.email}
            />
            <InputGroup
              label="Primary Phone *"
              value={labData.phone}
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleInputChange('phone', clean);
              }}
              placeholder="9876543210"
              maxLength={10}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="State *"
              value={labData.state}
              options={stateOptions}
              onValueChange={(val) => handleInputChange('state', val)}
              placeholder="Select state"
              error={errors.state}
            />
            <Select
              label="City *"
              value={labData.city}
              options={cityOptions}
              onValueChange={(val) => handleInputChange('city', val)}
              placeholder={labData.state ? "Select city" : "Select state first"}
              error={errors.city}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <InputGroup
                label="Street Address *"
                value={labData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Building, Street, Area/Locality"
                error={errors.street}
              />
            </div>
            <div>
              <InputGroup
                label="PIN Code *"
                value={labData.zipCode}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                  handleInputChange('zipCode', clean);
                }}
                placeholder="400001"
                maxLength={6}
                error={errors.zipCode}
              />
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-xl bg-slate-50">
            <h3 className="text-sm font-semibold mb-2">Location Summary</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Lab Name:</span>
                <span className="font-medium text-slate-900">{labData.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Standardized Location:</span>
                <span className="font-medium text-slate-900">
                  {labData.city ? `${labData.city}, ` : ''}{labData.state || 'Not selected'}
                  {labData.zipCode ? ` - ${labData.zipCode}` : ''}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-4 italic">
            Standardized state and city allow patients to discover this laboratory easily when filtering searches.
          </p>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
        {currentStep > 1 ? (
          <Button variant="ghost" onClick={() => onStepChange(currentStep - 1)} className="rounded-xl">
            Previous
          </Button>
        ) : <div />}

        {currentStep < 2 ? (
          <Button onClick={handleNext} className="rounded-xl">
            Next: Contact & Location
          </Button>
        ) : (
          <Button onClick={handleComplete} className="rounded-xl shadow-lg shadow-primary/20">
            Complete Onboarding
          </Button>
        )}
      </div>
    </Modal>
  );
};

