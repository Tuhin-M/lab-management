import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/Button';
import { Trash2, Plus } from 'lucide-react';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface MedicineInputProps {
  medicines: Medicine[];
  onChange: (medicines: Medicine[]) => void;
}

const MedicineInput: React.FC<MedicineInputProps> = ({ medicines, onChange }) => {
  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    onChange([...medicines, newMedicine]);
  };

  const removeMedicine = (id: string) => {
    onChange(medicines.filter(m => m.id !== id));
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    onChange(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Medicines</h3>
        <Button 
          type="button" 
          onClick={addMedicine}
          size="sm"
          className="rounded-xl flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Plus size={16} /> Add Medicine
        </Button>
      </div>

      <div className="space-y-3">
        {medicines.map((medicine, index) => (
          <div key={medicine.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Medicine Name</label>
                <Input 
                  placeholder="e.g. Paracetamol" 
                  value={medicine.name}
                  onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
                  className="bg-white border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Dosage</label>
                <Input 
                  placeholder="e.g. 500mg" 
                  value={medicine.dosage}
                  onChange={(e) => updateMedicine(medicine.id, 'dosage', e.target.value)}
                  className="bg-white border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Frequency</label>
                <Input 
                  placeholder="e.g. 1-0-1" 
                  value={medicine.frequency}
                  onChange={(e) => updateMedicine(medicine.id, 'frequency', e.target.value)}
                  className="bg-white border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Duration</label>
                <Input 
                  placeholder="e.g. 5 days" 
                  value={medicine.duration}
                  onChange={(e) => updateMedicine(medicine.id, 'duration', e.target.value)}
                  className="bg-white border-slate-200 rounded-xl"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="text-xs font-bold text-slate-500 mb-1 block">Instructions</label>
                <Input 
                  placeholder="e.g. After food" 
                  value={medicine.instructions}
                  onChange={(e) => updateMedicine(medicine.id, 'instructions', e.target.value)}
                  className="bg-white border-slate-200 rounded-xl"
                />
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMedicine(medicine.id)}
              className="absolute -top-2 -right-2 bg-white shadow-sm border border-slate-100 rounded-full text-red-500 hover:bg-red-50 md:opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}

        {medicines.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
            <p className="text-slate-400 text-sm italic">No medicines added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineInput;
