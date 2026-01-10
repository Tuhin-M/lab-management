import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, User, Users, Heart, Phone, Mail, Calendar, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
}

const DependentsTab: React.FC = () => {
  const [dependents, setDependents] = useState<Dependent[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '9876543210'
    },
    {
      id: '2',
      name: 'Alex Johnson',
      relationship: 'Child',
      dateOfBirth: '2015-08-20',
      gender: 'Male',
      bloodGroup: 'A+'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDependent, setEditingDependent] = useState<Dependent | null>(null);
  const [formData, setFormData] = useState<Partial<Dependent>>({
    name: '',
    relationship: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: ''
  });

  const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = () => {
    if (!formData.name || !formData.relationship || !formData.dateOfBirth || !formData.gender) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingDependent) {
      setDependents(dependents.map(d => 
        d.id === editingDependent.id 
          ? { ...formData, id: editingDependent.id } as Dependent
          : d
      ));
      toast.success('Dependent updated successfully');
    } else {
      const newDependent: Dependent = {
        ...formData as Dependent,
        id: Date.now().toString()
      };
      setDependents([...dependents, newDependent]);
      toast.success('Dependent added successfully');
    }

    resetForm();
  };

  const handleEdit = (dependent: Dependent) => {
    setEditingDependent(dependent);
    setFormData(dependent);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDependents(dependents.filter(d => d.id !== id));
    toast.success('Dependent removed');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
      phone: '',
      email: ''
    });
    setEditingDependent(null);
    setIsDialogOpen(false);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'Spouse': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Child': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Parent': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Sibling': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Family & Dependents</CardTitle>
                <CardDescription>
                  Manage family members for easy booking
                </CardDescription>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    {editingDependent ? 'Edit Dependent' : 'Add New Dependent'}
                  </DialogTitle>
                  <DialogDescription>
                    Add family members to easily book tests and appointments for them.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="relationship" className="text-sm font-medium">Relationship *</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {relationships.map((rel) => (
                            <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="dob" className="text-sm font-medium">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="h-11 rounded-xl"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                      >
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
                  <Button onClick={handleSubmit} className="rounded-xl bg-primary hover:bg-primary/90">
                    {editingDependent ? 'Update' : 'Add'} Dependent
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {dependents.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Dependents Added</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Add family members to easily book tests and appointments for them.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Dependent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dependents.map((dependent, index) => (
                <motion.div
                  key={dependent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{dependent.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getRelationshipColor(dependent.relationship)}`}
                              >
                                {dependent.relationship}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {calculateAge(dependent.dateOfBirth)} years
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(dependent)}
                            className="rounded-xl hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(dependent.id)}
                            className="text-red-500 hover:text-red-600 rounded-xl hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{dependent.gender}</span>
                        </div>
                        {dependent.bloodGroup && (
                          <div className="flex items-center gap-2 text-sm">
                            <Droplets className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-600">{dependent.bloodGroup}</span>
                          </div>
                        )}
                        {dependent.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{dependent.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(dependent.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DependentsTab;
