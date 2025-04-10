
import { useState, useEffect } from "react";
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
import { fetchOrphans, addOrphan, updateOrphan, deleteOrphan } from "@/services/api";

interface Orphan {
  id: number;
  name: string;
  age: number;
  gender: string;
  date_joined: string;
  medical_condition: string;
  education_level: string;
  background?: string;
  is_adopted: boolean;
  photo_url?: string;
}

const Orphans = () => {
  const { toast } = useToast();
  const [orphans, setOrphans] = useState<Orphan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrphan, setSelectedOrphan] = useState<Orphan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medical_condition: "",
    education_level: "",
    background: "",
    is_adopted: false,
    photo_url: "",
  });

  useEffect(() => {
    loadOrphans();
  }, []);

  const loadOrphans = async () => {
    try {
      setLoading(true);
      const data = await fetchOrphans();
      setOrphans(data);
    } catch (error) {
      console.error("Error loading orphans:", error);
      toast({
        title: "Error",
        description: "Failed to load orphans data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrphans = orphans.filter(
    (orphan) =>
      orphan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphan.medical_condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orphan.education_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      medical_condition: "",
      education_level: "",
      background: "",
      is_adopted: false,
      photo_url: "",
    });
  };

  const handleAddOrphan = async () => {
    // Validate form
    if (!formData.name || !formData.age || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addOrphan({
        ...formData,
        age: parseInt(formData.age),
      });
      setIsAddDialogOpen(false);
      resetForm();
      loadOrphans();
      toast({
        title: "Success",
        description: "Orphan added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add orphan",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (orphan: Orphan) => {
    setSelectedOrphan(orphan);
    setFormData({
      name: orphan.name,
      age: orphan.age.toString(),
      gender: orphan.gender,
      medical_condition: orphan.medical_condition || "",
      education_level: orphan.education_level || "",
      background: orphan.background || "",
      is_adopted: orphan.is_adopted,
      photo_url: orphan.photo_url || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrphan = async () => {
    if (!selectedOrphan) return;

    try {
      await updateOrphan(selectedOrphan.id, {
        ...formData,
        age: parseInt(formData.age),
      });
      setIsEditDialogOpen(false);
      resetForm();
      loadOrphans();
      toast({
        title: "Success",
        description: "Orphan updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update orphan",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrphan = async (id: number) => {
    try {
      await deleteOrphan(id);
      loadOrphans();
      toast({
        title: "Deleted",
        description: "Orphan record has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete orphan",
        variant: "destructive",
      });
    }
  };

  const getAdoptionStatus = (isAdopted: boolean) => {
    return isAdopted ? "adopted" : "active";
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
                  value={formData.name}
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
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
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
                <Label htmlFor="medical_condition" className="text-right">
                  Health
                </Label>
                <Select
                  value={formData.medical_condition}
                  onValueChange={(value) => handleSelectChange("medical_condition", value)}
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
                <Label htmlFor="education_level" className="text-right">
                  Education
                </Label>
                <Input
                  id="education_level"
                  name="education_level"
                  placeholder="Education level"
                  className="col-span-3"
                  value={formData.education_level}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="background" className="text-right">
                  Background
                </Label>
                <Input
                  id="background"
                  name="background"
                  placeholder="Background information"
                  className="col-span-3"
                  value={formData.background}
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

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Orphan</DialogTitle>
              <DialogDescription>
                Update the details of the orphan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Full name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-age" className="text-right">
                  Age
                </Label>
                <Input
                  id="edit-age"
                  name="age"
                  type="number"
                  placeholder="Age"
                  className="col-span-3"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gender" className="text-right">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
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
                <Label htmlFor="edit-medical_condition" className="text-right">
                  Health
                </Label>
                <Select
                  value={formData.medical_condition}
                  onValueChange={(value) => handleSelectChange("medical_condition", value)}
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
                <Label htmlFor="edit-education_level" className="text-right">
                  Education
                </Label>
                <Input
                  id="edit-education_level"
                  name="education_level"
                  placeholder="Education level"
                  className="col-span-3"
                  value={formData.education_level}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-background" className="text-right">
                  Background
                </Label>
                <Input
                  id="edit-background"
                  name="background"
                  placeholder="Background information"
                  className="col-span-3"
                  value={formData.background}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is_adopted" className="text-right">
                  Adopted
                </Label>
                <Select
                  value={formData.is_adopted ? "true" : "false"}
                  onValueChange={(value) => handleSelectChange("is_adopted", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Adoption status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-dark" onClick={handleUpdateOrphan}>
                Update Orphan
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
                <TableHead>Education</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading orphans data...
                  </TableCell>
                </TableRow>
              ) : filteredOrphans.length > 0 ? (
                filteredOrphans.map((orphan) => (
                  <TableRow key={orphan.id}>
                    <TableCell className="font-medium">{orphan.name}</TableCell>
                    <TableCell>{orphan.age}</TableCell>
                    <TableCell>{orphan.gender}</TableCell>
                    <TableCell>{new Date(orphan.date_joined).toLocaleDateString()}</TableCell>
                    <TableCell>{orphan.medical_condition}</TableCell>
                    <TableCell>{orphan.education_level}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                          getAdoptionStatus(orphan.is_adopted)
                        )}`}
                      >
                        {getAdoptionStatus(orphan.is_adopted)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(orphan)}
                        >
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
