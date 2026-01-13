import React from "react";
import { UserPlus, Mail, Shield, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
    { id: 1, name: "Dr. Sarah Chen", role: "Admin", email: "sarah.c@lab.com", status: "Active", avatar: "" },
    { id: 2, name: "James Wilson", role: "Technician", email: "james.w@lab.com", status: "Active", avatar: "" },
    { id: 3, name: "Elena Rodriguez", role: "Member", email: "elena.r@lab.com", status: "Pending", avatar: "" },
];

const TeamManagement = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h2>
                    <p className="text-muted-foreground">Manage your laboratory staff and their permissions.</p>
                </div>
                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
                    <UserPlus size={18} />
                    Invite Member
                </Button>
            </div>

            <div className="grid gap-4">
                {teamMembers.map((member) => (
                    <Card key={member.id} className="overflow-hidden border-slate-200/60 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-slate-900 truncate">{member.name}</h4>
                                        <Badge variant={member.role === "Admin" ? "default" : "secondary"} className="text-[10px] h-5">
                                            {member.role}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-sm gap-3 mt-1">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {member.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge variant={member.status === "Active" ? "outline" : "secondary"} className={member.status === "Active" ? "text-green-600 bg-green-50 border-green-100" : ""}>
                                        {member.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon" className="text-slate-400">
                                        <MoreVertical size={20} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-dashed border-2 bg-slate-50/50">
                <CardContent className="p-12 text-center">
                    <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Shield className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Security & Permissions</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                        Configure global access rules for your laboratory data and patient records.
                    </p>
                    <Button variant="link" className="mt-4 text-primary">View Permission Matrix</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamManagement;
