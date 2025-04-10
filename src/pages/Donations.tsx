
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: number;
  donor: string;
  email?: string;
  phone?: string;
  amount: number;
  date: string;
  type: "money" | "supplies" | "other";
  description?: string;
}

// Sample data
const donationsData: Donation[] = [
  {
    id: 1,
    donor: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    amount: 500,
    date: "2023-12-01",
    type: "money",
  },
  {
    id: 2,
    donor: "ABC Corporation",
    email: "donations@abccorp.com",
    amount: 1000,
    date: "2023-11-28",
    type: "money",
  },
  {
    id: 3,
    donor: "City Council",
    email: "council@cityname.gov",
    amount: 1500,
    date: "2023-11-20",
    type: "money",
  },
  {
    id: 4,
    donor: "Local Grocery Store",
    phone: "555-987-6543",
    amount: 0,
    date: "2023-11-15",
    type: "supplies",
    description: "Food supplies for the month"
  },
  {
    id: 5,
    donor: "Mary Johnson",
    email: "mary.j@example.com",
    phone: "555-765-4321",
    amount: 250,
    date: "2023-11-10",
    type: "money",
  },
  {
    id: 6,
    donor: "Anonymous",
    amount: 1000,
    date: "2023-11-05",
    type: "money",
  },
  {
    id: 7,
    donor: "Local Charity Group",
    email: "info@charitygroup.org",
    amount: 0,
    date: "2023-10-29",
    type: "other",
    description: "Clothes and toys for children"
  },
];

const Donations = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>(donationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donor: "",
    email: "",
    phone: "",
    amount: "",
    type: "money",
    description: "",
  });

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDonation({ ...newDonation, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDonation({ ...newDonation, [name]: value });
  };

  const handleAddDonation = () => {
    // Validate form
    if (!newDonation.donor || (newDonation.type === "money" && !newDonation.amount)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...donations.map((d) => d.id)) + 1;
    const currentDate = new Date().toISOString().split("T")[0];

    const donationToAdd: Donation = {
      id: newId,
      donor: newDonation.donor,
      email: newDonation.email || undefined,
      phone: newDonation.phone || undefined,
      amount: newDonation.type === "money" ? parseFloat(newDonation.amount) : 0,
      date: currentDate,
      type: newDonation.type as "money" | "supplies" | "other",
      description: newDonation.description || undefined,
    };

    setDonations([donationToAdd, ...donations]);
    setNewDonation({
      donor: "",
      email: "",
      phone: "",
      amount: "",
      type: "money",
      description: "",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Donation added successfully",
    });
  };

  const handleDeleteDonation = (id: number) => {
    setDonations(donations.filter((donation) => donation.id !== id));
    toast({
      title: "Deleted",
      description: "Donation record has been deleted",
    });
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "money":
        return "bg-green-100 text-green-800";
      case "supplies":
        return "bg-blue-100 text-blue-800";
      case "other":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer
      title="Donations"
      description="Manage and track all donations to the orphanage"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search donations..."
            className="pl-8 max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Donation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Donation</DialogTitle>
              <DialogDescription>
                Enter the details of the donation to record in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="donor" className="text-right">
                  Donor
                </Label>
                <Input
                  id="donor"
                  name="donor"
                  placeholder="Donor name"
                  className="col-span-3"
                  value={newDonation.donor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="col-span-3"
                  value={newDonation.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  className="col-span-3"
                  value={newDonation.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newDonation.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="money">Money</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newDonation.type === "money" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    className="col-span-3"
                    value={newDonation.amount}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Additional details"
                  className="col-span-3"
                  value={newDonation.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-dark" onClick={handleAddDonation}>
                Add Donation
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
                <TableHead>Donor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.donor}</TableCell>
                    <TableCell>
                      {donation.email && <div>{donation.email}</div>}
                      {donation.phone && <div>{donation.phone}</div>}
                      {!donation.email && !donation.phone && "-"}
                    </TableCell>
                    <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeStyle(
                          donation.type
                        )}`}
                      >
                        {donation.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {donation.type === "money" ? (
                        <span className="font-semibold">${donation.amount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteDonation(donation.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No donations found
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

export default Donations;
