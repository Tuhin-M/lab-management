import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

interface Lab {
  id: string;
  _id?: string;
  name: string;
  address: any;
  image: string;
  rating: number;
  tests: any[];
  status: string;
}

interface LabsListProps {
  labs: Lab[];
  onDeleteLab: (id: string) => void;
}

const LabsList = ({ labs, onDeleteLab }: LabsListProps) => {
  const navigate = useNavigate();

  const getLabId = (lab: Lab) => lab.id || lab._id || '';

  const formatAddress = (address: any) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [address.street, address.city, address.state].filter(Boolean);
      return parts.join(', ') || 'No address provided';
    }
    return 'No address provided';
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {labs.length === 0 ? (
        <Card className="col-span-full border-dashed p-12 text-center">
          <h3 className="text-lg font-medium text-muted-foreground">No labs found</h3>
          <p className="text-sm text-muted-foreground mt-2">Connect your laboratory facilities to start receiving bookings.</p>
        </Card>
      ) : (
        labs.map((lab) => {
          const labId = getLabId(lab);
          return (
            <Card key={labId} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={lab.image || "https://images.unsplash.com/photo-1579152276503-391494578b94?w=500&auto=format"}
                  alt={lab.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={lab.status === "active" ? "success" : "warning"}>
                    {lab.status === "active" ? "Active" : "Registering"}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{lab.name}</CardTitle>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {formatAddress(lab.address)}
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex justify-between items-center text-sm bg-gray-50/50 p-2 rounded-lg border">
                  <div className="text-center flex-1 border-r">
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Tests</div>
                    <div className="font-semibold">{lab.tests?.length || 0}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Rating</div>
                    <div className="font-semibold">{lab.rating || 'N/A'}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/lab/${labId}`, { state: { lab } })}
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteLab(labId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default LabsList;
