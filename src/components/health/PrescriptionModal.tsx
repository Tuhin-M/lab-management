
import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  FileText,
  Clock,
  ExternalLink,
  MapPin,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface PrescriptionModalProps {
  prescription: any;
  isOpen: boolean;
  onClose: () => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, isOpen, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:rounded-none print:max-h-none print:m-0"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Digital Prescription</h2>
                  <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">ID: {prescription.id?.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl gap-2">
                  <Printer size={16} /> Print
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl h-10 w-10 p-0">
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
              <div id="prescription-content" className="space-y-8 print:space-y-6">
                {/* Clinic/Doctor Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">EKITSA CLINIC</h1>
                    <div className="mt-2 space-y-1 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span>Kolkata, West Bengal, India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>+91 98765 43210</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-slate-900">{prescription.doctorName}</h3>
                    <p className="text-sm text-primary font-bold">General Physician</p>
                    <p className="text-xs text-slate-500 mt-1">MBBS, MD (General Medicine)</p>
                  </div>
                </div>

                {/* Patient Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl print:bg-transparent print:border print:rounded-none">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Patient Name</p>
                    <p className="font-bold text-slate-900">{prescription.patientName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Age / Gender</p>
                    <p className="font-bold text-slate-900">{prescription.age || '--'} / {prescription.gender || '--'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Date</p>
                    <p className="font-bold text-slate-900">{new Date(prescription.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Vitals (W/H)</p>
                    <p className="font-bold text-slate-900">{prescription.weight ? `${prescription.weight}kg` : '--'} / {prescription.height ? `${prescription.height}cm` : '--'}</p>
                  </div>
                </div>

                {/* RX Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900">Rx</span>
                    <div className="h-[2px] flex-1 bg-slate-200"></div>
                  </div>

                  <div className="space-y-4">
                    {prescription.medicines?.map((med: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-1 pb-4 border-b border-slate-50 last:border-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{idx + 1}. {med.medicine_name}</h4>
                          <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg">{med.duration}</span>
                        </div>
                        <div className="flex gap-4 text-sm font-bold text-primary">
                          <span>{med.dosage}</span>
                          <span>•</span>
                          <span>{med.frequency}</span>
                        </div>
                        {med.instructions && (
                          <p className="text-sm text-slate-600 italic mt-1 font-medium italic">"{med.instructions}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Findings & Notes */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Findings</h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {prescription.description || "No specific findings noted."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Diagnosis</h4>
                    <p className="text-sm text-slate-900 font-bold leading-relaxed">
                      {prescription.title}
                    </p>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="pt-10 flex justify-end">
                  <div className="text-center w-48 space-y-2">
                    {prescription.signature_url ? (
                      <img src={prescription.signature_url} alt="Signature" className="mx-auto h-16 w-auto grayscale" />
                    ) : (
                      <div className="h-16 border-b-2 border-slate-200"></div>
                    )}
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest border-t-2 border-slate-900 pt-2">Doctor's Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center print:bg-white print:text-slate-400 print:p-0 print:border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase opacity-60">Generated by EKITSA</span>
              </div>
              <p className="text-[10px] opacity-60 font-medium">This is a digitally signed electronic prescription.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrescriptionModal;
