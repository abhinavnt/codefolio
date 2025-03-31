"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import ShadCN Pagination components
import { FilterSidebar } from "./Filter-sidebar";
import { MentorCard } from "./Mentor-card";
import { fetchMentors } from "@/redux/features/MentorSlice";
import type { RootState, AppDispatch } from "@/redux/store";

export default function MentorListing() {
  const dispatch = useDispatch<AppDispatch>();
  const { mentors, pagination, loading, error } = useSelector((state: RootState) => state.mentors);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState<{
    rating?: number;
    technicalSkills?: string[];
    priceRange?: [number, number];
  }>({});

  useEffect(() => {
    dispatch(fetchMentors({ page: pagination.page, search: searchQuery, filters }));

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, pagination.page, searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchMentors({ page: 1, search: searchQuery, filters }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    dispatch(fetchMentors({ page: 1, search: searchQuery, filters: newFilters }));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchMentors({ page, search: searchQuery, filters }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 lg:w-72 flex-shrink-0`}>
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mentors</h1>
            <Button variant="outline" size="icon" className="md:hidden" onClick={toggleFilters}>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </div>

          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-emerald-500 hover:bg-emerald-600" type="submit">
              Search
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Error loading mentors: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <MentorCard
                key={index}
                mentor={{
                  id: mentor._id,
                  name: mentor.name,
                  title: mentor.currentRole,
                  rating: mentor.reviewTakenCount || 0,
                  reviews: mentor.reviewTakenCount || 0,
                  imageUrl: mentor.profileImage || "/placeholder.svg",
                  expertise: mentor.title?.[0] || "Mentor",
                }}
              />
            ))}
          </div>
        )}

        {mentors.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No mentors found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {pagination.total > 0 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={pagination.page === page}
                      className={pagination.page === page ? "bg-emerald-500 text-white" : ""}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}