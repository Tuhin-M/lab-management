
import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Lab {
  _id: string;
  name: string;
  address: {
    city: string;
    state: string;
  };
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {labs.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">No labs found</h3>
          <p className="text-muted-foreground mt-2">Add your first lab to get started</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/lab-owner/add-lab")}
          >
            Add Lab
          </Button>
        </div>
      ) : (
        labs.map((lab) => (
          <Card key={lab._id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={lab.image || "/placeholder.svg"}
                alt={lab.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{lab.name}</CardTitle>
                <Badge 
                  variant={lab.status === "active" ? "default" : "outline"}
                  className={lab.status === "active" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"}
                >
                  {lab.status === "active" ? "Active" : "Pending"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {lab.address.city}, {lab.address.state}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-medium">Tests</div>
                  <div>{lab.tests?.length || 0} available</div>
                </div>
                <div>
                  <div className="font-medium">Rating</div>
                  <div>
                    {lab.rating} / 5
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t p-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/lab-owner/lab/${lab._id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" /> View
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/lab-owner/edit-lab/${lab._id}`)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDeleteLab(lab._id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default LabsList;
