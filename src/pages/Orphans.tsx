
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Eye, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Orphan {
  id: number;
  name: string;
  age: number;
  gender: string;
  joinDate: string;
  healthStatus: string;
  guardianInfo?: string;
  status: "active" | "pending" | "adopted";
}

// Sample data
const orphansData: Orphan[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 8,
    gender: "Female",
    joinDate: "2023-10-15",
    healthStatus: "Good",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Lee",
    age: 6,
    gender: "Male",
    joinDate: "2023-11-02",
    healthStatus: "Excellent",
    status: "active",
  },
  {
    id: 3,
    name: "Emma Williams",
    age: 10,
    gender: "Female",
    joinDate: "2023-11-20",
    healthStatus: "Good",
    status: "pending",
  },
  {
    id: 4,
    name: "David Brown",
    age: 5,
    gender: "Male",
    joinDate: "2023-12-01",
    healthStatus: "Fair",
    status: "active",
  },
  {
    id: 5,
    name: "Olivia Davis",
    age: 9,
    gender: "Female",
    joinDate: "2023-09-28",
    healthStatus: "Good",
    status: "adopted",
  },
  {
    id: 6,
    name: "James Wilson",
    age: 7,
    gender: "Male",
    joinDate: "2023-10-05",
    healthStatus: "Good",
    status: "active",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    age: 11,
    gender: "Female",
    joinDate: "2023-08-15",
    healthStatus: "Excellent",
    status: "active",
  },
  {
    id: 8,
    name: "Benjamin Garcia",
    age: 4,
    gender: "Male",
    joinDate: "2023-11-10",
    healthStatus: "Fair",
    status: "pending",
  },
];

const Orphans = () => {
  const { toast } = useToast();
  const [orphans, setOrphans] = useState<Orphan[]>(orphansData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOrphan, setNewOrphan] = useState({
    name: "",
    age: "",
    gender: "",
    healthStatus: "",
    guardianInfo: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredOrphans = orphans.filter(
    (orphan) =>
      orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrphan({ ...newOrphan, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOrphan({ ...newOrphan, [name]: value });
  };

  const handleAddOrphan = () => {
    // Validate form
    if (!newOrphan.name || !newOrphan.age || !newOrphan.gender || !newOrphan.healthStatus) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...orphans.map((o) => o.id)) + 1;
    const currentDate = new Date().toISOString().split("T")[0];

    const orphanToAdd: Orphan = {
      id: newId,
      name: newOrphan.name,
      age: parseInt(newOrphan.age),
      gender: newOrphan.gender,
      joinDate: currentDate,
      healthStatus: newOrphan.healthStatus,
      guardianInfo: newOrphan.guardianInfo,
      status: "active",
    };

    setOrphans([...orphans, orphanToAdd]);
    setNewOrphan({
      name: "",
      age: "",
      gender: "",
      healthStatus: "",
      guardianInfo: "",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Orphan added successfully",
    });
  };

  const handleDeleteOrphan = (id: number) => {
    setOrphans(orphans.filter((orphan) => orphan.id !== id));
    toast({
      title: "Deleted",
      description: "Orphan record has been deleted",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary-light text-primary";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "adopted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer
      title="Orphans"
      description="Manage orphan records in the system"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search orphans..."
            className="pl-8 max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Orphan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Orphan</DialogTitle>
              <DialogDescription>
                Enter the details of the orphan to add to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  className="col-span-3"
                  value={newOrphan.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age"
                  className="col-span-3"
                  value={newOrphan.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <Select
                  value={newOrphan.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="healthStatus" className="text-right">
                  Health
                </Label>
                <Select
                  value={newOrphan.healthStatus}
                  onValueChange={(value) => handleSelectChange("healthStatus", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Health status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guardianInfo" className="text-right">
                  Guardian
                </Label>
                <Input
                  id="guardianInfo"
                  name="guardianInfo"
                  placeholder="Guardian information (optional)"
                  className="col-span-3"
                  value={newOrphan.guardianInfo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-dark" onClick={handleAddOrphan}>
                Add Orphan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrphans.length > 0 ? (
                filteredOrphans.map((orphan) => (
                  <TableRow key={orphan.id}>
                    <TableCell className="font-medium">{orphan.name}</TableCell>
                    <TableCell>{orphan.age}</TableCell>
                    <TableCell>{orphan.gender}</TableCell>
                    <TableCell>{new Date(orphan.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{orphan.healthStatus}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                          orphan.status
                        )}`}
                      >
                        {orphan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteOrphan(orphan.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orphans found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Orphans;
