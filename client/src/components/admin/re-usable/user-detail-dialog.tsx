"use client"

import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface UserDetailProps {
  user: any
  onStatusChange: (userId: string, newStatus: string) => void
  onEdit?: () => void
  getStatusColor: (status: string) => string
  formatDate?: (date: Date) => string
}

export function UserDetailDialog({
  user,
  onStatusChange,
  onEdit,
  getStatusColor,
  formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }),
}: UserDetailProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  if (!user) return null

  const isBlocked = user.status === "blocked" || user.status === "inactive"
  const newStatus = isBlocked ? "active" : user.status === "active" ? "blocked" : "inactive"

  return (
    <>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Detailed information about the user.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profileImageUrl || user.profileImage} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Role</Label>
              <p className="text-sm">{user.role || user.title || "Not Available"}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p className="text-sm">
                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
              </p>
            </div>
            <div>
              <Label>Join Date</Label>
              <p className="text-sm">{user.createdAt ? formatDate(user.createdAt) : "N/A"}</p>
            </div>
            {user.reviewTakenCount !== undefined && (
              <div>
                <Label>Reviews Taken</Label>
                <p className="text-sm">{user.reviewTakenCount || "0"}</p>
              </div>
            )}
            {user.primaryLanguage && (
              <div>
                <Label>Language</Label>
                <p className="text-sm">{user.primaryLanguage}</p>
              </div>
            )}
            {user.technicalSkills && (
              <div>
                <Label>Skills</Label>
                <ul className="list-disc list-inside text-sm">
                  {user.technicalSkills.map((skill: string, index: number) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            {user.location && (
              <div>
                <Label>Location</Label>
                <p className="text-sm">{user.location}</p>
              </div>
            )}
            {(user.phone || user.phoneNumber) && (
              <div>
                <Label>Phone</Label>
                <p className="text-sm">{user.phone || user.phoneNumber}</p>
              </div>
            )}
          </div>

          {(user.bio || user.title) && (
            <div>
              <Label>Bio</Label>
              <p className="text-sm">{user.bio || user.title}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t mt-4">
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">{isBlocked ? "Unblock User" : "Block User"}</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to {isBlocked ? "unblock" : "block"} this user?
                    {!isBlocked && " The user will no longer be able to access the platform."}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className={isBlocked ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}
                      onClick={() => onStatusChange(user._id, newStatus)}
                    >
                      {isBlocked ? "Unblock" : "Block"} User
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            {onEdit && (
              <Button variant="default" onClick={onEdit}>
                Edit User
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </>
  )
}
