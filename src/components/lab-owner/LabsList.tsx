import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink, Pencil, MapPin, FlaskConical, Star, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { DEFAULT_LAB_IMAGE } from "@/constants/images";

interface Lab {
  id: string;
  _id?: string;
  name: string;
  address?: any;
  // Raw Supabase flat columns
  address_street?: string;
  address_city?: string;
  address_state?: string;
  image?: string;
  image_url?: string;
  images?: string[];
  logo?: string;
  rating?: number;
  tests?: any[];
  status?: string;
  accredited?: boolean;
}

interface LabsListProps {
  labs: Lab[];
  onDeleteLab: (id: string) => void;
}

const LabsList = ({ labs, onDeleteLab }: LabsListProps) => {
  const navigate = useNavigate();

  const getLabId = (lab: Lab) => lab.id || lab._id || '';

  const formatAddress = (lab: Lab) => {
    // Prefer nested object shape
    if (lab.address && typeof lab.address === 'object') {
      const parts = [lab.address.street, lab.address.city, lab.address.state].filter(Boolean);
      if (parts.length) return parts.join(', ');
    }
    // Fallback to raw Supabase flat columns
    const parts = [lab.address_street, lab.address_city, lab.address_state].filter(Boolean);
    if (parts.length) return parts.join(', ');
    if (typeof lab.address === 'string' && lab.address) return lab.address;
    return '';
  };

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
      {labs.length === 0 ? (
        <div className="col-span-full py-16 px-6 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-400">
            <Building2 className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No laboratories registered yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1.5">
            Onboard your laboratory facilities to publish test packages and start receiving patient appointments.
          </p>
        </div>
      ) : (
        labs.map((lab) => {
          const labId = getLabId(lab);
          const isActive = lab.status === "active";
          const imageUrl = lab.image || lab.image_url || (Array.isArray(lab.images) && lab.images[0]) || DEFAULT_LAB_IMAGE;

          return (
            <div
              key={labId}
              className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/80 hover:border-primary/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-10px_rgba(13,148,136,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
            >
              {/* Header Image with Glass Badges */}
              <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                <img
                  src={imageUrl}
                  alt={lab.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_LAB_IMAGE;
                  }}
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

                {/* Top-Left: Logo or Accreditation */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {lab.logo ? (
                    <div className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md p-1 shadow-md border border-white/50 flex items-center justify-center overflow-hidden">
                      <img
                        src={lab.logo}
                        alt="Logo"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : lab.accredited ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-teal-800 backdrop-blur-md shadow-sm border border-white/60">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> NABL Accredited
                    </span>
                  ) : null}
                </div>

                {/* Top-Right: Glassmorphic Status Pill */}
                <div className="absolute top-3 right-3">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-md border border-emerald-400/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/95 text-white backdrop-blur-md shadow-md border border-amber-300/30">
                      <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                      Registering
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Lab Title */}
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1 capitalize">
                  {lab.name}
                </h3>

                {/* Location with Pin */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 line-clamp-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{formatAddress(lab) || "Location details pending"}</span>
                </div>

                {/* Modern Metrics Bar */}
                <div className="grid grid-cols-2 bg-slate-50/90 rounded-xl border border-slate-100 mt-4 p-1 divide-x divide-slate-100">
                  <div className="flex items-center gap-2 px-2 py-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FlaskConical className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">Tests</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {lab.tests?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-none mb-0.5">Rating</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {lab.rating ? `${lab.rating}/5` : 'New'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 mt-auto border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-semibold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 h-8 px-2.5 gap-1.5"
                      onClick={() => navigate(`/lab-owner/lab/${labId}`, { state: { lab } })}
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span>Details</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/90 text-slate-800 transition-all duration-200 h-8 px-2.5 gap-1.5"
                      onClick={() => navigate(`/lab-owner/edit-lab/${labId}`)}
                    >
                      <Pencil className="h-3.5 w-3.5 shrink-0" />
                      <span>Edit</span>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    onClick={() => onDeleteLab(labId)}
                    title="Delete Lab"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default LabsList;
