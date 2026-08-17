import React, { useState } from "react";
import {
  LifeBuoy, MessageCircle, BookOpen, ChevronDown, ChevronUp,
  Search, Send, ExternalLink, Phone, Mail, Clock, CheckCircle2,
  AlertCircle, Zap, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

const FAQ_ITEMS = [
  {
    q: "How do I add a new test to my lab's catalog?",
    a: "Navigate to your Lab Detail page, click on 'Manage Tests', then click 'Add Test'. Fill in the test details including name, category, price, and parameters. The test will immediately appear for patients to book."
  },
  {
    q: "How long does lab verification take after registration?",
    a: "Lab verification typically takes 1–3 business days. Our team reviews your registration number, certifications, and contact information. You'll receive an email once your lab is verified and visible to patients."
  },
  {
    q: "Can I offer home sample collection for specific tests only?",
    a: "Yes! When adding or editing a test, you can specify whether home collection is available for that particular test. This allows you to offer home collection selectively based on your operational capacity."
  },
  {
    q: "How do I update my lab's working hours?",
    a: "Go to your Lab Detail page, click 'Edit Lab', and update the working hours in the 'Contact & Location' section. Changes take effect immediately for new bookings."
  },
  {
    q: "How are payments handled and when do I receive them?",
    a: "Payments collected from patients are processed through our payment gateway. Settlements are made to your registered bank account every 7 business days, after deducting our platform fee. You can view all transactions in the Billing section."
  },
  {
    q: "What happens if a patient cancels a booking?",
    a: "Cancelled bookings appear in your Bookings tab with a 'Cancelled' status. Refunds are automatically processed based on the cancellation timing as per our refund policy. You will not be charged for cancelled bookings."
  },
  {
    q: "How do I download patient reports?",
    a: "Reports uploaded to a booking are accessible from the booking detail view in your Bookings tab. Patients also receive a link to download their report directly from their account."
  },
];

const STATUS_TICKETS = [
  { id: "TKT-1042", subject: "Unable to upload lab report", status: "resolved", date: "Aug 15, 2026" },
  { id: "TKT-1028", subject: "Payment settlement delay inquiry", status: "in-progress", date: "Aug 12, 2026" },
  { id: "TKT-1011", subject: "New lab verification request", status: "resolved", date: "Aug 5, 2026" },
];

const QUICK_ACTIONS = [
  { label: "Getting Started Guide", icon: <BookOpen size={18} />, desc: "Learn the basics of managing your lab" },
  { label: "Video Tutorials", icon: <Zap size={18} />, desc: "Step-by-step video walkthroughs" },
  { label: "API Documentation", icon: <FileText size={18} />, desc: "For developers integrating with Ekitsa" },
];

const SupportCenter = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredFaqs = FAQ_ITEMS.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!subject || !category || !message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success("Ticket submitted! We'll respond within 24 hours.");
    setSubject(""); setCategory(""); setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <LifeBuoy className="text-primary" size={24} />
          Support Center
        </h2>
        <p className="text-slate-500 mt-1">Get help with your lab management, billing, and technical issues.</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Phone size={20} />, label: "Phone Support", value: "+91-800-EKI-TSA", sub: "Mon–Fri, 9am–6pm", color: "bg-primary/10 text-primary" },
          { icon: <Mail size={20} />, label: "Email Support", value: "support@ekitsa.com", sub: "Response in 24 hours", color: "bg-green-50 text-green-600" },
          { icon: <MessageCircle size={20} />, label: "Live Chat", value: "Start Chat", sub: "Available right now", color: "bg-blue-50 text-blue-600" },
        ].map(c => (
          <Card key={c.label} className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.color} flex-shrink-0`}>
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.label}</p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{c.value}</p>
                <p className="text-xs text-slate-400">{c.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-bold">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <Input
                  className="pl-9 h-10 rounded-xl border-slate-200"
                  placeholder="Search FAQs..."
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredFaqs.length === 0 && (
                  <p className="text-center text-slate-400 italic text-sm py-8">No FAQs match your search.</p>
                )}
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                      {openFaq === i
                        ? <ChevronUp size={16} className="text-primary flex-shrink-0" />
                        : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                      }
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 border-t border-slate-50 bg-slate-50/50">
                        <p className="text-sm text-slate-600 leading-relaxed pt-3">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Ticket */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Send size={16} className="text-primary" /> Submit a Support Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-semibold text-slate-700">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="verification">Lab Verification</SelectItem>
                    <SelectItem value="booking">Booking Problem</SelectItem>
                    <SelectItem value="report">Report Upload</SelectItem>
                    <SelectItem value="account">Account Access</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold text-slate-700">Subject *</Label>
                <Input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-semibold text-slate-700">Message *</Label>
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Please provide as much detail as possible so we can help you quickly..."
                  className="rounded-xl resize-none"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2 rounded-xl shadow-lg shadow-primary/20 w-full"
              >
                {submitting ? "Submitting..." : <><Send size={15} /> Submit Ticket</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Tickets + Quick Links */}
        <div className="space-y-4">
          {/* Your Tickets */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-bold">Your Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {STATUS_TICKETS.map(t => (
                <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  {t.status === "resolved"
                    ? <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    : <Clock size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.subject}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.id} · {t.date}</p>
                  </div>
                  <Badge
                    className={`text-[9px] flex-shrink-0 ${t.status === "resolved"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"}`}
                  >
                    {t.status === "resolved" ? "Resolved" : "In Progress"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-bold">Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{a.label}</p>
                    <p className="text-xs text-slate-400">{a.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-300 group-hover:text-primary flex-shrink-0 transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* SLA Info */}
          <Card className="bg-primary text-primary-foreground rounded-2xl border-none shadow-lg shadow-primary/20 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-white/80" />
                <p className="font-bold text-sm">Response Times</p>
              </div>
              {[
                { level: "Critical", time: "< 2 hours" },
                { level: "High", time: "< 8 hours" },
                { level: "Normal", time: "< 24 hours" },
              ].map(s => (
                <div key={s.level} className="flex justify-between text-xs py-1.5 border-b border-white/10 last:border-0">
                  <span className="text-white/70">{s.level}</span>
                  <span className="font-semibold">{s.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
