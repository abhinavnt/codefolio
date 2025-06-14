"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector, useAppDispatch } from "@/redux/store"
import type { RootState } from "@/redux/store"
import { updateMentorProfile } from "@/redux/features/auth/MentorVerify"
import type { IMentor } from "@/types/mentor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export function ProfileSettings() {
  const dispatch = useAppDispatch()
  const { mentor, status } = useAppSelector((state: RootState) => state.mentor)
  

  const [formData, setFormData] = useState<Partial<IMentor>>(mentor || {})
  const [newSkill, setNewSkill] = useState("")
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [formChanged, setFormChanged] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // Update local state when Redux state changes
  useEffect(() => {
    if (mentor) {
      setFormData(mentor)
      setFormChanged(false)
    }
  }, [mentor])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, profileImage: imageUrl })
      setFormChanged(true)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setFormData({ ...formData, resume: file.name })
      setFormChanged(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormChanged(true)

    // Validate field
    validateField(name, value)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: Number.parseInt(value) || 0 })
    setFormChanged(true)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: new Date(value) })
    setFormChanged(true)
  }

  const handleAddSkill = () => {
    if (newSkill && !formData.technicalSkills?.includes(newSkill)) {
      setFormData({
        ...formData,
        technicalSkills: [...(formData.technicalSkills || []), newSkill],
      })
      setNewSkill("")
      setFormChanged(true)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills?.filter((s) => s !== skill) || [],
    })
    setFormChanged(true)
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break
      case "linkedin":
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(value)) {
          newErrors.linkedin = "Please enter a valid LinkedIn URL"
        } else {
          delete newErrors.linkedin
        }
        break
      case "github":
        if (value && !/^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/.test(value)) {
          newErrors.github = "Please enter a valid GitHub URL"
        } else {
          delete newErrors.github
        }
        break
      case "twitter":
        if (value && !/^https?:\/\/(www\.)?twitter\.com\/[\w-]+\/?$/.test(value)) {
          newErrors.twitter = "Please enter a valid Twitter URL"
        } else {
          delete newErrors.twitter
        }
        break
      case "instagram":
        if (value && !/^https?:\/\/(www\.)?instagram\.com\/[\w-]+\/?$/.test(value)) {
          newErrors.instagram = "Please enter a valid Instagram URL"
        } else {
          delete newErrors.instagram
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const validateForm = () => {
    // Validate all required fields and URLs
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email || "")) newErrors.email = "Please enter a valid email address"

    // Validate social media URLs only if provided (not required)
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL"
    }
    if (formData.github && !/^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/.test(formData.github)) {
      newErrors.github = "Please enter a valid GitHub URL"
    }
    if (formData.twitter && !/^https?:\/\/(www\.)?twitter\.com\/[\w-]+\/?$/.test(formData.twitter)) {
      newErrors.twitter = "Please enter a valid Twitter URL"
    }
    if (formData.instagram && !/^https?:\/\/(www\.)?instagram\.com\/[\w-]+\/?$/.test(formData.instagram)) {
      newErrors.instagram = "Please enter a valid Instagram URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenConfirmDialog = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setConfirmDialogOpen(true)
  }

  const handleSubmit = async () => {
    const submitData = new FormData()
    

    Object.entries(formData).forEach(([key, value]) => {
      

      if (key === "technicalSkills") {
        submitData.append(key, JSON.stringify(value))
      } else if (key === "dateOfBirth" && value instanceof Date) {
        submitData.append(key, value.toISOString())
      } else if (value !== undefined && value !== null) {
        submitData.append(key, String(value))
      }
    })

    // Append files if they exist
    if (profileImageFile) submitData.append("profileImage", profileImageFile)
    if (resumeFile) submitData.append("resume", resumeFile)
    

    // Close the dialog first
    setConfirmDialogOpen(false)

    try {
      await dispatch(updateMentorProfile(submitData)).unwrap()
      setFormChanged(false)
      setProfileImageFile(null)
      setResumeFile(null)
    } catch (err) {
      console.error("Failed to update profile:", err)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading profile data...</div>
  }

  if (!mentor) {
    return <div className="flex justify-center p-8">No mentor profile found.</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your mentor profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOpenConfirmDialog} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.profileImage} alt={formData.name} />
                  <AvatarFallback className="text-4xl">{formData.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <label htmlFor="profile-image-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById("profile-image-upload")?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </Button>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                        onChange={handleDateChange}
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location || ""} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role</Label>
                <Input id="currentRole" name="currentRole" value={formData.currentRole || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationAtCompany">Duration at Company</Label>
                <Input
                  id="durationAtCompany"
                  name="durationAtCompany"
                  value={formData.durationAtCompany || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience || 0}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryLanguage">Primary Language</Label>
                <Select
                  value={formData.primaryLanguage || ""}
                  onValueChange={(value) => {
                    setFormData({ ...formData, primaryLanguage: value })
                    setFormChanged(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ""}
                  onValueChange={(value: "active" | "inactive") => {
                    setFormData({ ...formData, status: value })
                    setFormChanged(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <div className="flex items-center gap-2">
                  <Input id="resume" name="resume" value={formData.resume || ""} onChange={handleChange} disabled />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => document.getElementById("resume-upload")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technical Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.technicalSkills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-xs rounded-full hover:bg-gray-200 h-4 w-4 inline-flex items-center justify-center"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio || ""} onChange={handleChange} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin || ""}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className={errors.linkedin ? "border-red-500" : ""}
                />
                {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github || ""}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className={errors.github ? "border-red-500" : ""}
                />
                {errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter || ""}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className={errors.twitter ? "border-red-500" : ""}
                />
                {errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={formData.instagram || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className={errors.instagram ? "border-red-500" : ""}
                />
                {errors.instagram && <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={String(status) === "loading" || !formChanged}
              >
                {String(status) === "loading" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>Are you sure you want to save these changes to your profile?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} className="sm:mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={String(status) === "loading"}
            >
              {String(status) === "loading" ? "Saving..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

