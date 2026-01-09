import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Building2, 
  Phone, 
  Globe, 
  Award,
  CalendarClock,
  FlaskConical,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { labsAPI } from '@/services/api';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Lab {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  certifications: string[];
  operatingHours: {
    weekdays: { open: string; close: string };
    weekends: { open: string; close: string };
  };
  rating: number;
  image: string;
  tests: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

const LabComparison: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labIds = searchParams.get('ids')?.split(',') || [];

  useEffect(() => {
    const fetchLabs = async () => {
      if (labIds.length < 2) {
        setError('Please select at least 2 labs to compare');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const labPromises = labIds.map((id) => labsAPI.getLabById(id));
        const labsData = await Promise.all(labPromises);
        setLabs(labsData);
      } catch (err) {
        setError('Failed to load lab details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabs();
  }, [labIds.join(',')]);

  // Find all unique test names across labs
  const allTestNames = [...new Set(labs.flatMap((lab) => lab.tests.map((t) => t.name)))];

  const ComparisonRow = ({ 
    label, 
    icon: Icon, 
    children, 
    className 
  }: { 
    label: string; 
    icon?: React.ElementType; 
    children: React.ReactNode; 
    className?: string; 
  }) => (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("border-b border-white/5 hover:bg-white/5 transition-colors", className)}
    >
      <td className="py-6 px-6 font-medium text-muted-foreground w-64 bg-card/50 backdrop-blur-sm sticky left-0 z-10 border-r border-white/5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </div>
      </td>
      {children}
    </motion.tr>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-12 w-64 mx-auto rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || labs.length < 2) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-20">
        <div className="bg-card border border-dashed p-12 rounded-3xl text-center max-w-lg w-full">
          <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Comparison Unavailable</h2>
          <p className="text-muted-foreground mb-8 text-lg">{error || 'Select at least 2 labs to compare'}</p>
          <Link to="/lab-tests">
            <Button size="lg" className="rounded-full px-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Labs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-16 relative selection:bg-primary/20">
      
      {/* Background Gradients & Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-60" />
      </div>

      {/* Hero Header */}
      <div className="bg-black text-white py-16 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-purple-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/lab-tests" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Compare Labs</h1>
            <p className="text-xl text-white/60 max-w-2xl">
              Compare features, prices, and ratings side-by-side to make the best choice for your health.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="py-6 px-6 text-left w-64 bg-card/95 backdrop-blur-md sticky left-0 z-20 border-r border-white/5 border-b">
                    <span className="text-lg font-bold text-muted-foreground">Lab Details</span>
                  </th>
                  {labs.map((lab) => (
                    <th key={lab.id} className="py-6 px-6 text-left min-w-[280px] bg-card/30 border-b border-white/5 relative group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="space-y-4">
                        <div className="relative h-32 rounded-2xl overflow-hidden group-hover:shadow-lg transition-all duration-300">
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10 opacity-95" />
                           <img
                            src={lab.image || 'https://via.placeholder.com/200x100?text=Lab'}
                            alt={lab.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute bottom-3 left-3 z-20">
                            <div className="flex items-center gap-1 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded-full w-fit">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {lab.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-xl leading-tight mb-2">{lab.name}</h3>
                          <Link to={`/labs/${lab.id}`}>
                            <Button className="w-full rounded-xl shadow-lg shadow-primary/10">
                              Book Appointment
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow label="Address" icon={MapPin}>
                  {labs.map((lab) => (
                    <td key={lab.id} className="py-4 px-6 align-top">
                      <p className="text-sm leading-relaxed">{lab.address?.street}, {lab.address?.city}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lab.address?.zipCode}</p>
                    </td>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Certifications" icon={Award}>
                  {labs.map((lab) => (
                    <td key={lab.id} className="py-4 px-6 align-top">
                      <div className="flex flex-wrap gap-2">
                        {lab.certifications?.map((cert) => (
                          <Badge key={cert} variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Operating Hours" icon={CalendarClock}>
                  {labs.map((lab) => (
                    <td key={lab.id} className="py-4 px-6 align-top">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center border-b border-border/50 pb-1">
                          <span className="text-muted-foreground">Mon-Fri</span>
                          <span className="font-medium">{lab.operatingHours?.weekdays?.open} - {lab.operatingHours?.weekdays?.close}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Sat-Sun</span>
                          <span className="font-medium">{lab.operatingHours?.weekends?.open} - {lab.operatingHours?.weekends?.close}</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Facilities" icon={Building2}>
                  {labs.map((lab) => (
                    <td key={lab.id} className="py-4 px-6 align-top">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                           <ShieldCheck className="h-4 w-4 text-green-500" />
                           <span>NABL Accredited</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                           <CheckCircle2 className="h-4 w-4 text-green-500" />
                           <span>Home Collection</span>
                        </div>
                      </div>
                    </td>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Contact" icon={Phone}>
                  {labs.map((lab) => (
                    <td key={lab.id} className="py-4 px-6 align-top">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{lab.contactInfo?.phone}</span>
                        </div>
                        {lab.contactInfo?.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <a href={lab.contactInfo.website} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[150px]">
                              Website
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </ComparisonRow>

                {/* Test Prices Section Header */}
                <tr className="bg-primary/5">
                  <td colSpan={labs.length + 1} className="py-4 px-6 sticky left-0 z-10 bg-primary/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 font-bold text-primary">
                      <FlaskConical className="h-5 w-5" />
                      Test Pricing Comparison
                    </div>
                  </td>
                </tr>

                {allTestNames.slice(0, 8).map((testName, idx) => (
                  <ComparisonRow 
                    key={testName} 
                    label={testName} 
                    className={idx % 2 === 0 ? "bg-white/2" : ""}
                  >
                    {labs.map((lab) => {
                      const test = lab.tests.find((t) => t.name === testName);
                      // Find minimum price for this test across displayed labs to highlight it
                      const prices = labs
                        .map(l => l.tests.find(t => t.name === testName)?.price)
                        .filter((p): p is number => p !== undefined);
                      const minPrice = Math.min(...prices);
                      const isBestPrice = test?.price === minPrice;

                      return (
                        <td key={lab.id} className="py-4 px-6">
                          {test ? (
                            <div className={`p-3 rounded-xl border ${isBestPrice ? 'bg-green-500/10 border-green-500/30' : 'bg-transparent border-transparent'}`}>
                              <span className={`text-lg font-bold block ${isBestPrice ? 'text-green-600' : 'text-foreground'}`}>
                                ₹{test.price}
                              </span>
                              {isBestPrice && prices.length > 1 && (
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Best Price</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground opacity-50 p-3">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm">N/A</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </ComparisonRow>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LabComparison;
