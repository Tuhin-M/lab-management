import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const labTypes = ['Diagnostic', 'Pathology', 'Imaging', 'Specialty', 'Hospital'];
  const facilityOptions = [
    'Home Collection',
    'Digital Reports',
    'Ambulance Service',
    'NABL Accredited',
    '24/7 Emergency',
    'Wheelchair Accessible',
    'Parking Available',
    'Phlebotomy Services'
  ];
  
  const certificationOptions = ['NABL', 'ISO', 'CAP', 'JCI', 'NABH', 'CLIA'];
  const serviceOptions = [
    'Blood Tests',
    'Urine Tests',
    'Imaging',
    'Biopsy',
    'Genetic Testing',
    'Allergy Testing',
    'COVID Testing'
  ];

  const handleInputChange = (field: string, value: any) => {
    onLabDataChange({
      ...labData,
      [field]: value
    });
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    onLabDataChange({
      ...labData,
      [parentField]: {
        ...(labData as any)[parentField],
        [field]: value
      }
    });
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lab Onboarding - Step {currentStep} of 5</DialogTitle>
          <Progress value={(currentStep / 5) * 100} className="my-4" />
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Lab Name*</Label>
              <Input
                value={labData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter lab name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Lab Type*</Label>
                <Select
                  value={labData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lab type" />
                  </SelectTrigger>
                  <SelectContent>
                    {labTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Registration Number*</Label>
                <Input
                  value={labData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Lab registration number"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={labData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description about your lab"
                rows={3}
              />
            </div>
            <div>
              <Label>Established Date</Label>
              <Input
                type="date"
                value={labData.establishedDate}
                onChange={(e) => handleInputChange('establishedDate', e.target.value)}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email*</Label>
                <Input
                  type="email"
                  value={labData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@lab.com"
                />
              </div>
              <div>
                <Label>Phone*</Label>
                <Input
                  value={labData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Emergency Contact</Label>
                <Input
                  value={labData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={labData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourlab.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Street*</Label>
                <Input
                  value={labData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label>City*</Label>
                <Input
                  value={labData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label>State*</Label>
                <Input
                  value={labData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Zip Code*</Label>
                <Input
                  value={labData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="Postal code"
                />
              </div>
              <div>
                <Label>Landmark</Label>
                <Input
                  value={labData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  placeholder="Nearby landmark"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Facilities</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {facilityOptions.map(facility => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`facility-${facility}`}
                      checked={labData.facilities.includes(facility)}
                      onCheckedChange={(checked) => {
                        const newFacilities = checked
                          ? [...labData.facilities, facility]
                          : labData.facilities.filter(f => f !== facility);
                        handleInputChange('facilities', newFacilities);
                      }}
                    />
                    <label htmlFor={`facility-${facility}`} className="text-sm">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Certifications</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {certificationOptions.map(cert => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${cert}`}
                      checked={labData.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        const newCerts = checked
                          ? [...labData.certifications, cert]
                          : labData.certifications.filter(c => c !== cert);
                        handleInputChange('certifications', newCerts);
                      }}
                    />
                    <label htmlFor={`cert-${cert}`} className="text-sm">
                      {cert}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {serviceOptions.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={labData.services.includes(service)}
                      onCheckedChange={(checked) => {
                        const newServices = checked
                          ? [...labData.services, service]
                          : labData.services.filter(s => s !== service);
                        handleInputChange('services', newServices);
                      }}
                    />
                    <label htmlFor={`service-${service}`} className="text-sm">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <Label>Working Hours (Weekdays)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  value={labData.workingHours.weekdays.open}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekdays.open', e.target.value)}
                />
                <Input
                  type="time"
                  value={labData.workingHours.weekdays.close}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekdays.close', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Working Hours (Weekends)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  value={labData.workingHours.weekends.open}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekends.open', e.target.value)}
                />
                <Input
                  type="time"
                  value={labData.workingHours.weekends.close}
                  onChange={(e) => handleNestedInputChange('workingHours', 'weekends.close', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Working Hours (Holidays)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  value={labData.workingHours.holidays.open}
                  onChange={(e) => handleNestedInputChange('workingHours', 'holidays.open', e.target.value)}
                />
                <Input
                  type="time"
                  value={labData.workingHours.holidays.close}
                  onChange={(e) => handleNestedInputChange('workingHours', 'holidays.close', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <Label>Pathologists</Label>
                <Input
                  type="number"
                  min="0"
                  value={labData.staff.pathologists}
                  onChange={(e) => handleNestedInputChange('staff', 'pathologists', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Technicians</Label>
                <Input
                  type="number"
                  min="0"
                  value={labData.staff.technicians}
                  onChange={(e) => handleNestedInputChange('staff', 'technicians', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Receptionists</Label>
                <Input
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
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Review Your Lab Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Lab Name:</span> {labData.name}</p>
                <p><span className="font-medium">Type:</span> {labData.type}</p>
                <p><span className="font-medium">Address:</span> {labData.street}, {labData.city}, {labData.state} {labData.zipCode}</p>
                <p><span className="font-medium">Contact:</span> {labData.phone} | {labData.email}</p>
                <p><span className="font-medium">Facilities:</span> {labData.facilities.join(', ')}</p>
                <p><span className="font-medium">Certifications:</span> {labData.certifications.join(', ')}</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Working Hours</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Weekdays:</span> {labData.workingHours.weekdays.open} - {labData.workingHours.weekdays.close}</p>
                <p><span className="font-medium">Weekends:</span> {labData.workingHours.weekends.open} - {labData.workingHours.weekends.close}</p>
                <p><span className="font-medium">Holidays:</span> {labData.workingHours.holidays.open} - {labData.workingHours.holidays.close}</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Staff Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Pathologists:</span> {labData.staff.pathologists}</p>
                <p><span className="font-medium">Technicians:</span> {labData.staff.technicians}</p>
                <p><span className="font-medium">Receptionists:</span> {labData.staff.receptionists}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => onStepChange(currentStep - 1)}>
              Previous
            </Button>
          ) : (
            <div />
          )}
          
          {currentStep < 5 ? (
            <Button onClick={() => onStepChange(currentStep + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={onSubmit}>
              Complete Onboarding
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
