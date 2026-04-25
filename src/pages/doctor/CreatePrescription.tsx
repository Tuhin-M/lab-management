import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { prescriptionsAPI, doctorsAPI } from "@/services/api";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import MedicineInput, { Medicine } from "@/components/doctor/MedicineInput";
import SignaturePad from "@/components/doctor/SignaturePad";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { 
  FileText, 
  User, 
  Mic, 
  MicOff, 
  Save, 
  ChevronLeft,
  PenTool,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/common/Loader";

const CreatePrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [clinicalFindings, setClinicalFindings] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("Patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  // Speech to Text
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechToText();
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  useEffect(() => {
    // Fetch appointment details to get patient info
    const fetchInfo = async () => {
      if (!appointmentId || appointmentId === 'new') {
        setPatientName(""); // Allow manual entry
        setPatientId("walk-in");
        return;
      }
      
      try {
        setLoading(true);
        // In a real app, fetch appointment details from Supabase
        const { data, error } = await supabase
          .from('appointments')
          .select('patient_name, patient_id')
          .eq('id', appointmentId)
          .single();

        if (data) {
          setPatientName(data.patient_name);
          setPatientId(data.patient_id);
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [appointmentId]);

  // Handle Voice Transcript
  useEffect(() => {
    if (transcript && activeVoiceField) {
      if (activeVoiceField === 'clinicalFindings') setClinicalFindings(transcript);
      if (activeVoiceField === 'diagnosis') setDiagnosis(transcript);
      if (activeVoiceField === 'notes') setNotes(transcript);
    }
  }, [transcript, activeVoiceField]);

  const toggleVoice = (field: string) => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      setTranscript("");
      setActiveVoiceField(field);
      startListening();
    }
  };

  const handleSave = async () => {
    if (!signatureUrl) {
      toast.error("Please provide a digital signature.");
      return;
    }

    try {
      setSaving(true);
      await prescriptionsAPI.createPrescription({
        patientId,
        appointmentId,
        medicines,
        clinicalFindings,
        diagnosis,
        notes,
        signatureUrl,
        age,
        gender,
        weight,
        height
      });
      toast.success("Prescription generated successfully!");
      navigate('/doctor/dashboard');
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error("Failed to save prescription.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen text="Preparing prescription template..." />;

  return (
    <div className="flex min-h-screen bg-slate-50/50 pt-20">
      <DoctorSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="rounded-xl h-10 w-10 p-0"
              >
                <ChevronLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">New Prescription</h1>
                {appointmentId === 'new' ? (
                  <Input 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)} 
                    placeholder="Enter Patient Name"
                    className="h-8 border-none bg-slate-100 mt-1 focus:ring-0 rounded-lg text-sm"
                  />
                ) : (
                  <p className="text-sm text-slate-500">Creating prescription for {patientName}</p>
                )}
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-primary text-white rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              {saving ? <Loader className="w-4 h-4" /> : <Save size={18} />}
              Generate & Save
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Clinical Section */}
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="text-primary" size={20} />
                    Clinical Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Clinical Findings</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleVoice('clinicalFindings')}
                        className={`h-8 w-8 p-0 rounded-full ${activeVoiceField === 'clinicalFindings' ? 'bg-red-50 text-red-500' : 'text-slate-400'}`}
                      >
                        {activeVoiceField === 'clinicalFindings' && isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      </Button>
                    </div>
                    <Textarea 
                      placeholder="Enter findings or use voice input..." 
                      value={clinicalFindings}
                      onChange={(e) => setClinicalFindings(e.target.value)}
                      className="min-h-[100px] border-slate-200 rounded-2xl focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Diagnosis</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleVoice('diagnosis')}
                        className={`h-8 w-8 p-0 rounded-full ${activeVoiceField === 'diagnosis' ? 'bg-red-50 text-red-500' : 'text-slate-400'}`}
                      >
                        {activeVoiceField === 'diagnosis' && isListening ? <MicOff size={14} /> : <Mic size={14} />}
                      </Button>
                    </div>
                    <Input 
                      placeholder="Final diagnosis..." 
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="border-slate-200 rounded-2xl h-12 focus:ring-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medicines Section */}
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <MedicineInput medicines={medicines} onChange={setMedicines} />
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-bold text-slate-700">Instructions for Patient</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleVoice('notes')}
                      className={`h-8 w-8 p-0 rounded-full ${activeVoiceField === 'notes' ? 'bg-red-50 text-red-500' : 'text-slate-400'}`}
                    >
                      {activeVoiceField === 'notes' && isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    </Button>
                  </div>
                  <Textarea 
                    placeholder="Dietary advice, lifestyle changes, etc." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] border-slate-200 rounded-2xl"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Patient Info Summary */}
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                      {patientName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{patientName}</h3>
                      <p className="text-xs text-slate-500">ID: {patientId.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
                        <Input 
                          type="number" 
                          value={age} 
                          onChange={(e) => setAge(e.target.value)} 
                          className="h-9 border-slate-100 bg-slate-50 focus:bg-white transition-colors text-sm rounded-xl"
                          placeholder="e.g. 25"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                        <select 
                          value={gender} 
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full h-9 border border-slate-100 bg-slate-50 focus:bg-white transition-colors text-sm rounded-xl px-3 outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                        <Input 
                          type="number" 
                          value={weight} 
                          onChange={(e) => setWeight(e.target.value)} 
                          className="h-9 border-slate-100 bg-slate-50 focus:bg-white transition-colors text-sm rounded-xl"
                          placeholder="e.g. 70"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Height (cm)</label>
                        <Input 
                          type="number" 
                          value={height} 
                          onChange={(e) => setHeight(e.target.value)} 
                          className="h-9 border-slate-100 bg-slate-50 focus:bg-white transition-colors text-sm rounded-xl"
                          placeholder="e.g. 175"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Digital Signature */}
              <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PenTool size={18} className="text-primary" />
                    Signature
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!signatureUrl ? (
                    <SignaturePad onSave={setSignatureUrl} />
                  ) : (
                    <div className="relative">
                      <img src={signatureUrl} alt="Signature" className="w-full h-auto border rounded-xl" />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSignatureUrl("")}
                        className="absolute top-2 right-2 rounded-lg bg-white/80 backdrop-blur-sm"
                      >
                        Reset
                      </Button>
                      <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                        <CheckCircle2 size={16} /> Signed Digitally
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePrescription;
