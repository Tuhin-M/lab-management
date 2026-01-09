import React from 'react';
import { Video, Phone, MessageSquare, User } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export type ConsultationMode = 'VIDEO' | 'VOICE' | 'CHAT' | 'IN_PERSON';

interface ConsultationModeConfig {
  value: ConsultationMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const modes: ConsultationModeConfig[] = [
  {
    value: 'VIDEO',
    label: 'Video Call',
    description: 'Face-to-face video consultation',
    icon: <Video className="h-5 w-5" />,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    value: 'VOICE',
    label: 'Voice Call',
    description: 'Audio-only consultation',
    icon: <Phone className="h-5 w-5" />,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  },
  {
    value: 'CHAT',
    label: 'Chat',
    description: 'Text-based messaging',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  },
  {
    value: 'IN_PERSON',
    label: 'In-Person',
    description: 'Visit the clinic in person',
    icon: <User className="h-5 w-5" />,
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
  }
];

interface ConsultationModeSelectorProps {
  selectedMode: ConsultationMode;
  onModeChange: (mode: ConsultationMode) => void;
  availableModes?: ConsultationMode[];
  disabled?: boolean;
}

export const ConsultationModeSelector: React.FC<ConsultationModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  availableModes = ['VIDEO', 'VOICE', 'CHAT', 'IN_PERSON'],
  disabled = false
}) => {
  const filteredModes = modes.filter(mode => availableModes.includes(mode.value));

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">Consultation Mode</Label>
      <RadioGroup
        value={selectedMode}
        onValueChange={(value) => onModeChange(value as ConsultationMode)}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        disabled={disabled}
      >
        {filteredModes.map((mode) => (
          <div key={mode.value}>
            <RadioGroupItem
              value={mode.value}
              id={`mode-${mode.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`mode-${mode.value}`}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                transition-all duration-200
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
                peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5
                ${selectedMode === mode.value ? 'border-primary bg-primary/5' : 'border-muted'}
              `}
            >
              <div className={`p-2 rounded-full ${mode.color} mb-2`}>
                {mode.icon}
              </div>
              <span className="font-medium text-sm">{mode.label}</span>
              <span className="text-xs text-muted-foreground text-center mt-1">
                {mode.description}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ConsultationModeSelector;
