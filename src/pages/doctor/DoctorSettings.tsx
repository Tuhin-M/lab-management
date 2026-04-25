
import React, { useState, useEffect } from "react";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Stethoscope, 
  MapPin, 
  Briefcase, 
  Star, 
  Save,
  Shield,
  Clock,
  DollarSign
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader } from "@/components/common/Loader";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const specialties = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Ophthalmology",
  "Gastroenterology",
  "Psychiatry",
  "ENT Specialist",
  "Diabetologist",
  "Urology",
  "Oncology",
  "Dentist"
];

const DoctorSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorData, setDoctorData] = useState<any>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setDoctorData(data);
        } else {
          // If no doctor record exists yet but they are logged in as doctor
          setDoctorData({
            id: user.id,
            name: user.user_metadata?.name || '',
            specialty: '',
            city: '',
            experience: '',
            bio: '',
            fee: 500
          });
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { error } = await supabase
        .from('doctors')
        .upsert(doctorData);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen text="Loading settings..." />;

  return (
    <div className="flex min-h-screen bg-slate-50/50 pt-20">
      <DoctorSidebar />

      <main className="flex-1 p-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor Settings</h1>
            <p className="text-slate-500 mt-1">Manage your professional profile and clinic details.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="text-primary" size={20} />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input 
                      value={doctorData?.name || ''} 
                      onChange={(e) => setDoctorData({...doctorData, name: e.target.value})}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Specialty</label>
                    <Select 
                      value={doctorData?.specialty || ''} 
                      onValueChange={(value) => setDoctorData({...doctorData, specialty: value})}
                    >
                      <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty} className="rounded-lg">
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Experience</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input 
                        className="pl-10"
                        value={doctorData?.experience || ''} 
                        onChange={(e) => setDoctorData({...doctorData, experience: e.target.value})}
                        placeholder="e.g. 10+ years"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input 
                        className="pl-10"
                        value={doctorData?.city || ''} 
                        onChange={(e) => setDoctorData({...doctorData, city: e.target.value})}
                        placeholder="e.g. Kolkata"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">About / Biography</label>
                  <Textarea 
                    rows={4}
                    value={doctorData?.bio || ''} 
                    onChange={(e) => setDoctorData({...doctorData, bio: e.target.value})}
                    placeholder="Briefly describe your medical background and approach..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="text-primary" size={20} />
                  Consultation & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Consultation Fee (₹)</label>
                    <Input 
                      type="number"
                      value={doctorData?.fee || 500} 
                      onChange={(e) => setDoctorData({...doctorData, fee: parseInt(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Available Slots Per Day</label>
                    <Input 
                      type="number"
                      placeholder="20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-xl">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DoctorSettings;
