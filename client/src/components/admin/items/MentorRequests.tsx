import { useEffect, useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getMentorApplicationRequest, updateMentorApplicationStatus } from "@/services/adminService";
import { toast } from "sonner";

interface IMentorRequest {
  _id: string;
  userId: string;
  profileImage?: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  yearsOfExperience: number;
  currentCompany: string;
  currentRole: string;
  durationAtCompany: string;
  resume: string;
  technicalSkills: string[];
  primaryLanguage: string;
  bio: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  status: string;
  createdAt: string;
}

export function MentorRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<IMentorRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mentorRequests, setMentorRequests] = useState<IMentorRequest[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(5);
  const [rejectionReason, setRejectionReason] = useState("");

  // Add debounced search term state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debouncing effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Wait 300ms after typing stops

    return () => {
      clearTimeout(handler); // Clear timeout if searchTerm changes before delay
    };
  }, [searchTerm]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Fetch data with search and status filters
  useEffect(() => {
    const fetchMentorRequests = async () => {
      try {
        const { mentorApplications, total, totalPages } = await getMentorApplicationRequest(
          currentPage,
          itemsPerPage,
          debouncedSearchTerm,
          statusFilter
        );
        setMentorRequests(mentorApplications);
        setTotalPages(totalPages);
        setTotalItems(total);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchMentorRequests();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, statusFilter]);

  const indexOfFirstDisplay = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastDisplay = Math.min(currentPage * itemsPerPage, totalItems);

  const handleViewDetails = (request: IMentorRequest) => {
    setSelectedRequest(request);
  };

  const handleStatusChange = async (requestId: string, newStatus: string, message?: string) => {
    try {
      await updateMentorApplicationStatus(requestId, newStatus, message);
      setMentorRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
      );

      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }

      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Mentor Requests</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Application Management</CardTitle>
          <CardDescription>Review and manage mentor applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Submission Date</TableHead>
                  <TableHead className="hidden md:table-cell">Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentorRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No applications found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  mentorRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={request.profileImage} alt={request.name} />
                            <AvatarFallback>
                              {request.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.name}</div>
                            <div className="text-sm text-muted-foreground">{request.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.yearsOfExperience} years</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            request.status === "Approved"
                              ? "bg-emerald-500 text-white"
                              : request.status === "Pending"
                                ? "bg-yellow-500 text-black"
                                : "bg-red-500 text-white"
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Mentor Application Details</DialogTitle>
                              <DialogDescription>Review the mentor application.</DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="grid gap-6 py-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedRequest.profileImage} alt={selectedRequest.name} />
                                    <AvatarFallback>
                                      {selectedRequest.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-bold">{selectedRequest.name}</h3>
                                    <p className="text-muted-foreground">{selectedRequest.email}</p>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label>Submission Date</Label>
                                    <p className="text-sm">
                                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <p className="text-sm">
                                      <Badge
                                        className={
                                          selectedRequest.status === "Approved"
                                            ? "bg-emerald-500 text-white"
                                            : selectedRequest.status === "Pending"
                                              ? "bg-yellow-500 text-black"
                                              : "bg-red-500 text-white"
                                        }
                                      >
                                        {selectedRequest.status}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Years of Experience</Label>
                                    <p className="text-sm">{selectedRequest.yearsOfExperience} years</p>
                                  </div>
                                  <div>
                                    <Label>Current Role</Label>
                                    <p className="text-sm">{selectedRequest.currentRole}</p>
                                  </div>
                                  <div>
                                    <Label>Current Company</Label>
                                    <p className="text-sm">{selectedRequest.currentCompany}</p>
                                  </div>
                                  <div>
                                    <Label>Duration at Company</Label>
                                    <p className="text-sm">{selectedRequest.durationAtCompany}</p>
                                  </div>
                                  <div>
                                    <Label>Phone Number</Label>
                                    <p className="text-sm">{selectedRequest.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <Label>Date of Birth</Label>
                                    <p className="text-sm">
                                      {new Date(selectedRequest.dateOfBirth).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label>Technical Skills</Label>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {selectedRequest.technicalSkills.map((skill) => (
                                      <Badge key={skill} variant="outline">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label>Primary Language</Label>
                                  <p className="text-sm">{selectedRequest.primaryLanguage}</p>
                                </div>

                                <div>
                                  <Label>Bio</Label>
                                  <p className="text-sm">{selectedRequest.bio}</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                  <div>
                                    <Label>Resume</Label>
                                    <p className="text-sm">
                                      <a
                                        href={selectedRequest.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-500 hover:underline"
                                      >
                                        View Resume
                                      </a>
                                    </p>
                                  </div>
                                  {selectedRequest.linkedin && (
                                    <div>
                                      <Label>LinkedIn</Label>
                                      <p className="text-sm">
                                        <a
                                          href={selectedRequest.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-500 hover:underline"
                                        >
                                          View LinkedIn
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                  {selectedRequest.github && (
                                    <div>
                                      <Label>GitHub</Label>
                                      <p className="text-sm">
                                        <a
                                          href={selectedRequest.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-500 hover:underline"
                                        >
                                          View GitHub
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                  {selectedRequest.twitter && (
                                    <div>
                                      <Label>Twitter</Label>
                                      <p className="text-sm">
                                        <a
                                          href={selectedRequest.twitter}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-500 hover:underline"
                                        >
                                          View Twitter
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                  {selectedRequest.instagram && (
                                    <div>
                                      <Label>Instagram</Label>
                                      <p className="text-sm">
                                        <a
                                          href={selectedRequest.instagram}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-500 hover:underline"
                                        >
                                          View Instagram
                                        </a>
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
                                  {selectedRequest.status === "Pending" && (
                                    <>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button className="hover:bg-red-600 hover:text-white" variant="outline">
                                            Reject
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                          <DialogHeader>
                                            <DialogTitle>Reject Application</DialogTitle>
                                            <DialogDescription>
                                              Please provide a reason for rejecting this mentor application.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            <Label htmlFor="rejection-reason" className="mb-2 block">
                                              Rejection Reason
                                            </Label>
                                            <Input
                                              id="rejection-reason"
                                              placeholder="Enter reason for rejection"
                                              value={rejectionReason}
                                              onChange={(e) => setRejectionReason(e.target.value)}
                                              className="mb-4"
                                            />
                                          </div>
                                          <div className="flex justify-end gap-2 pt-4">
                                            <DialogClose asChild>
                                              <Button variant="outline" onClick={() => setRejectionReason("")}>
                                                Cancel
                                              </Button>
                                            </DialogClose>
                                            <Button
                                              variant="destructive"
                                              onClick={() => {
                                                handleStatusChange(selectedRequest._id, "Rejected", rejectionReason);
                                                setRejectionReason("");
                                              }}
                                              disabled={!rejectionReason.trim()}
                                            >
                                              Confirm Rejection
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button className="bg-emerald-500 hover:bg-emerald-700" variant="default">
                                            Approve
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                          <DialogHeader>
                                            <DialogTitle>Approve Application</DialogTitle>
                                            <DialogDescription>
                                              Are you sure you want to approve this mentor application?
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="flex justify-end gap-2 pt-4">
                                            <DialogClose asChild>
                                              <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <DialogClose asChild>
                                              <Button
                                                className="bg-emerald-500 hover:bg-emerald-700"
                                                onClick={() =>
                                                  handleStatusChange(
                                                    selectedRequest._id,
                                                    "Approved",
                                                    "Congratulations! Your mentor application has been approved."
                                                  )
                                                }
                                              >
                                                Confirm Approval
                                              </Button>
                                            </DialogClose>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}
                                  {selectedRequest.status !== "Pending" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline">Reset to Pending</Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>Reset Status</DialogTitle>
                                          <DialogDescription>
                                            Are you sure you want to reset this application status to Pending?
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-2 pt-4">
                                          <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                          </DialogClose>
                                          <DialogClose asChild>
                                            <Button
                                              variant="default"
                                              onClick={() =>
                                                handleStatusChange(
                                                  selectedRequest._id,
                                                  "Pending",
                                                  "Your application status has been reset to pending for further review."
                                                )
                                              }
                                            >
                                              Confirm Reset
                                            </Button>
                                          </DialogClose>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstDisplay} to {indexOfLastDisplay} of {totalItems} applications
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (page === 2 && currentPage > 3) {
                  return (
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                  return (
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}