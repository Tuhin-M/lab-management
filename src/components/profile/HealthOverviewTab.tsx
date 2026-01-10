import React from "react";
import { FileText, Activity, Heart, ChevronRight, Stethoscope, TestTube, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const HealthOverviewTab = () => {
  const navigate = useNavigate();
  
  const healthCards = [
    {
      icon: FileText,
      title: "Health Records",
      description: "Manage your prescriptions and test results",
      path: "/health-records",
      buttonText: "View Records",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      stat: "12 Records"
    },
    {
      icon: Activity,
      title: "Health Metrics",
      description: "Track your weight, blood pressure, and more",
      path: "/health-records?tab=analytics",
      buttonText: "View Metrics",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      stat: "Last updated: Today"
    },
    {
      icon: Heart,
      title: "Appointment History",
      description: "View your past doctor visits and lab tests",
      path: "/appointments",
      buttonText: "View History",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      stat: "3 Appointments"
    }
  ];

  const quickStats = [
    { label: "Lab Tests", value: "8", icon: TestTube, color: "text-cyan-600" },
    { label: "Doctor Visits", value: "5", icon: Stethoscope, color: "text-purple-600" },
    { label: "Health Score", value: "85%", icon: TrendingUp, color: "text-green-600" },
    { label: "Next Checkup", value: "15 Jan", icon: Calendar, color: "text-amber-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Quick Stats */}
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Health Overview
          </CardTitle>
          <CardDescription>
            Your health summary at a glance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl overflow-hidden h-full hover:shadow-2xl transition-all group cursor-pointer">
              <CardContent className="p-6 flex flex-col h-full">
                <div className={`h-14 w-14 rounded-2xl ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 flex-1">{card.description}</p>
                <div className="text-xs text-primary font-medium mb-4">{card.stat}</div>
                <Button 
                  className={`w-full rounded-xl bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white shadow-lg transition-all hover:scale-[1.02]`}
                  onClick={() => navigate(card.path)}
                >
                  {card.buttonText}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 backdrop-blur-md border-primary/20 shadow-xl overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Manage All Health Records</h3>
              <p className="text-sm text-muted-foreground">Access and organize your complete medical history</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 shrink-0"
            onClick={() => navigate('/health-records')}
          >
            Go to Health Records
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthOverviewTab;
