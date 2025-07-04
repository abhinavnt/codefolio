import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Plus, Trash2, Upload } from "lucide-react"
import { addNewCourse } from "@/services/adminService"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

type Lesson = {
  title: string
  duration: string
  video: string
}

type Module = {
  title: string
  description: string
  video: string
  lessons: Lesson[]
}

type LessonError = {
  title?: string
  duration?: string
}

type ModuleError = {
  title?: string
  description?: string
  lessons?: LessonError[]
}

type FormErrors = {
  courseTitle?: string
  courseDescription?: string
  courseCategory?: string
  courseLevel?: string
  coursePrice?: string
  courseDuration?: string
  courseImage?: string
  modules?: ModuleError[]
  learningPoints?: string
  targetedAudience?: string
  courseRequirements?: string
}

export function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("")
  const [courseLevel, setCourseLevel] = useState("")
  const [coursePrice, setCoursePrice] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseImage, setCourseImage] = useState<File | null>(null)
  const [courseModules, setCourseModules] = useState<Module[]>([
    { title: "", description: "", video: "", lessons: [{ title: "", duration: "", video: "" }] },
  ])
  const [status, setStatus] = useState<"draft" | "published">("draft")

  const [errors, setErrors] = useState<FormErrors>({})

  //  input strings for comma-separated fields
  const [learningPointsRaw, setLearningPointsRaw] = useState("")
  const [targetedAudienceRaw, setTargetedAudienceRaw] = useState("")
  const [courseRequirementsRaw, setCourseRequirementsRaw] = useState("")

  const validateField = (field: string, value: string | File | null, required = true): string => {
    
    if (field === "courseImage") {
      if (required && !value) {
        return "Course image is required"
      }
      if (value instanceof File) {
   
        if (value.size > 5 * 1024 * 1024) {
      
          return "Image size must be less than 5MB"
        }
        if (!value.type.startsWith("image/")) {
          return "Only image files are allowed"
        }
      }
      return ""
    }

    // Handle other fields 
    if (required && (!value || (typeof value === "string" && value.trim() === ""))) {
      return "This field is required"
    }

    if (field === "coursePrice" && typeof value === "string" && value) {
      const price = Number.parseFloat(value)
      if (isNaN(price) || price < 0) {
        return "Price must be a valid positive number"
      }
    }

    if (field === "courseDuration" && typeof value === "string" && value) {
      const duration = Number.parseFloat(value)
      if (isNaN(duration) || duration <= 0) {
        return "Duration must be a valid positive number"
      }
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Parse raw inputs into arrays
    const learningPoints = learningPointsRaw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")

    const targetedAudience = targetedAudienceRaw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")

    const courseRequirements = courseRequirementsRaw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")

    // Validate all fields
    const newErrors: FormErrors = {}

    // Basic tab validation
    newErrors.courseTitle = validateField("courseTitle", courseTitle)
    newErrors.courseDescription = validateField("courseDescription", courseDescription)
    newErrors.courseCategory = validateField("courseCategory", courseCategory)
    newErrors.courseLevel = validateField("courseLevel", courseLevel)
    newErrors.coursePrice = validateField("coursePrice", coursePrice)
    newErrors.courseDuration = validateField("courseDuration", courseDuration)
    newErrors.courseImage = validateField("courseImage", courseImage)

    newErrors.learningPoints = validateField("learningPoints", learningPointsRaw)
    newErrors.targetedAudience = validateField("targetedAudience", targetedAudienceRaw)
    newErrors.courseRequirements = validateField("courseRequirements", courseRequirementsRaw)

    // Content tab validation
    newErrors.modules = courseModules.map((module, index) => {
      const moduleError: ModuleError = {
        title: validateField(`module-${index}-title`, module.title),
        description: validateField(`module-${index}-description`, module.description),
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          title: validateField(`lesson-${index}-${lessonIndex}-title`, lesson.title),
          duration: validateField(`lesson-${index}-${lessonIndex}-duration`, lesson.duration),
        })),
      }
      return moduleError
    })

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((error) => {
      if (typeof error === "string" && error !== "") return true
      if (Array.isArray(error)) {
        return error.some(
          (moduleError) =>
            (moduleError.title && moduleError.title !== "") ||
            (moduleError.description && moduleError.description !== "") ||
            (moduleError.lessons &&
              moduleError.lessons.some(
                (lessonError) =>
                  (lessonError.title && lessonError.title !== "") ||
                  (lessonError.duration && lessonError.duration !== ""),
              )),
        )
      }
      return false
    })

    if (!hasErrors) {
      try {
        const formData = new FormData()

        formData.append("title", courseTitle)
        formData.append("description", courseDescription)
        formData.append("category", courseCategory)
        formData.append("level", courseLevel)
        formData.append("price", coursePrice)
        formData.append("duration", courseDuration)

        if (courseImage) {
          formData.append("image", courseImage)
        }

        formData.append("modules", JSON.stringify(courseModules))

        formData.append("learningPoints", JSON.stringify(learningPoints))
        formData.append("targetedAudience", JSON.stringify(targetedAudience))
        formData.append("courseRequirements", JSON.stringify(courseRequirements))
        formData.append("status",status)
        for (const [key, value] of formData.entries()) {
          
        }

        const response = await addNewCourse(formData)

        if (response) {
          
          toast.success("course add success")
        }
        return response
      } catch (error) {
        console.error("Error submitting course:", error)
        throw error
      }
    } else {
      console.log("Form has validation errors")
    }
  }

  const handleCourseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCourseTitle(value)
    setErrors((prev) => ({
      ...prev,
      courseTitle: validateField("courseTitle", value),
    }))
  }

  const handleCourseDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCourseDescription(value)
    setErrors((prev) => ({
      ...prev,
      courseDescription: validateField("courseDescription", value),
    }))
  }

  const handleCourseCategoryChange = (value: string) => {
    setCourseCategory(value)
    setErrors((prev) => ({
      ...prev,
      courseCategory: validateField("courseCategory", value),
    }))
  }

  const handleCourseLevelChange = (value: string) => {
    setCourseLevel(value)
    setErrors((prev) => ({
      ...prev,
      courseLevel: validateField("courseLevel", value),
    }))
  }

  const handleCoursePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCoursePrice(value)
    setErrors((prev) => ({
      ...prev,
      coursePrice: validateField("coursePrice", value),
    }))
  }

  const handleCourseDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCourseDuration(value)
    setErrors((prev) => ({
      ...prev,
      courseDuration: validateField("courseDuration", value),
    }))
  }

  const handleCourseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setCourseImage(file)
    setErrors((prev) => ({
      ...prev,
      courseImage: validateField("courseImage", file),
    }))
  }

  const handleAddModule = () => {
    setCourseModules([
      ...courseModules,
      { title: "", description: "", video: "", lessons: [{ title: "", duration: "", video: "" }] },
    ])
  }

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...courseModules]
    updatedModules.splice(index, 1)
    setCourseModules(updatedModules)
  }

  const handleModuleChange = (index: number, field: string, value: string) => {
    const updatedModules = [...courseModules]
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value,
    }
    setCourseModules(updatedModules)

    setErrors((prev) => {
      const newModuleErrors = [...(prev.modules || [])]
      if (!newModuleErrors[index]) {
        newModuleErrors[index] = {}
      }

      newModuleErrors[index] = {
        ...newModuleErrors[index],
        [field === "title" ? "title" : "description"]: validateField(`module-${index}-${field}`, value),
      }

      return {
        ...prev,
        modules: newModuleErrors,
      }
    })
  }

  const handleAddLesson = (moduleIndex: number) => {
    const updatedModules = [...courseModules]
    updatedModules[moduleIndex].lessons.push({ title: "", duration: "", video: "" })
    setCourseModules(updatedModules)
  }

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...courseModules]
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1)
    setCourseModules(updatedModules)
  }

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const updatedModules = [...courseModules]
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    }
    setCourseModules(updatedModules)

    setErrors((prev) => {
      const newModuleErrors = [...(prev.modules || [])]
      if (!newModuleErrors[moduleIndex]) {
        newModuleErrors[moduleIndex] = { lessons: [] }
      }

      if (!newModuleErrors[moduleIndex].lessons) {
        newModuleErrors[moduleIndex].lessons = []
      }

      if (!newModuleErrors[moduleIndex].lessons![lessonIndex]) {
        newModuleErrors[moduleIndex].lessons![lessonIndex] = {}
      }

      newModuleErrors[moduleIndex].lessons![lessonIndex] = {
        ...newModuleErrors[moduleIndex].lessons![lessonIndex],
        [field]: validateField(`lesson-${moduleIndex}-${lessonIndex}-${field}`, value),
      }

      return {
        ...prev,
        modules: newModuleErrors,
      }
    })
  }

  const handleLearningPointsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setLearningPointsRaw(value)
    setErrors((prev) => ({
      ...prev,
      learningPoints: validateField("learningPoints", value),
    }))
  }

  const handleTargetedAudienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTargetedAudienceRaw(value)
    setErrors((prev) => ({
      ...prev,
      targetedAudience: validateField("targetedAudience", value),
    }))
  }

  const handleCourseRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setCourseRequirementsRaw(value)
    setErrors((prev) => ({
      ...prev,
      courseRequirements: validateField("courseRequirements", value),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Add New Course</h2>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Course Information</CardTitle>
              <CardDescription>Enter the basic details of your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={courseTitle}
                  onChange={handleCourseTitleChange}
                  className={errors.courseTitle ? "border-red-500" : ""}
                />
                {errors.courseTitle && <p className="text-sm text-red-500">{errors.courseTitle}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  rows={5}
                  value={courseDescription}
                  onChange={handleCourseDescriptionChange}
                  className={errors.courseDescription ? "border-red-500" : ""}
                />
                {errors.courseDescription && <p className="text-sm text-red-500">{errors.courseDescription}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningPoints">Learning Points</Label>
                <Textarea
                  id="learningPoints"
                  placeholder="Enter learning points (comma-separated)"
                  rows={3}
                  value={learningPointsRaw}
                  onChange={handleLearningPointsChange}
                  className={errors.learningPoints ? "border-red-500" : ""}
                />
                {errors.learningPoints && <p className="text-sm text-red-500">{errors.learningPoints}</p>}
                <p className="text-xs text-muted-foreground">
                  Enter comma-separated learning points (e.g., "Point 1, Point 2")
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetedAudience">Targeted Audience</Label>
                <Textarea
                  id="targetedAudience"
                  placeholder="Enter targeted audience (comma-separated)"
                  rows={3}
                  value={targetedAudienceRaw}
                  onChange={handleTargetedAudienceChange}
                  className={errors.targetedAudience ? "border-red-500" : ""}
                />
                {errors.targetedAudience && <p className="text-sm text-red-500">{errors.targetedAudience}</p>}
                <p className="text-xs text-muted-foreground">Enter comma-separated target audience groups</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseRequirements">Course Requirements</Label>
                <Textarea
                  id="courseRequirements"
                  placeholder="Enter course requirements (comma-separated)"
                  rows={3}
                  value={courseRequirementsRaw}
                  onChange={handleCourseRequirementsChange}
                  className={errors.courseRequirements ? "border-red-500" : ""}
                />
                {errors.courseRequirements && <p className="text-sm text-red-500">{errors.courseRequirements}</p>}
                <p className="text-xs text-muted-foreground">Enter comma-separated course requirements</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={courseCategory} onValueChange={handleCourseCategoryChange}>
                    <SelectTrigger id="category" className={errors.courseCategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.courseCategory && <p className="text-sm text-red-500">{errors.courseCategory}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={courseLevel} onValueChange={handleCourseLevelChange}>
                    <SelectTrigger id="level" className={errors.courseLevel ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.courseLevel && <p className="text-sm text-red-500">{errors.courseLevel}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={coursePrice}
                    onChange={handleCoursePriceChange}
                    className={errors.coursePrice ? "border-red-500" : ""}
                  />
                  {errors.coursePrice && <p className="text-sm text-red-500">{errors.coursePrice}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter duration"
                    value={courseDuration}
                    onChange={handleCourseDurationChange}
                    className={errors.courseDuration ? "border-red-500" : ""}
                  />
                  {errors.courseDuration && <p className="text-sm text-red-500">{errors.courseDuration}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Course Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className={`flex-1 ${errors.courseImage ? "border-red-500" : ""}`}
                    onChange={handleCourseImageChange}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" /> Upload
                  </Button>
                </div>
                {errors.courseImage && <p className="text-sm text-red-500">{errors.courseImage}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="min-h-[500px]">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Add weekly modules and lessons to your course.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-6 flex-1">
                {courseModules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="space-y-4 border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Week {moduleIndex + 1}</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveModule(moduleIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`module-title-${moduleIndex}`}>Week Title</Label>
                      <Input
                        id={`module-title-${moduleIndex}`}
                        placeholder="Enter week title"
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
                        className={errors.modules?.[moduleIndex]?.title ? "border-red-500" : ""}
                      />
                      {errors.modules?.[moduleIndex]?.title && (
                        <p className="text-sm text-red-500">{errors.modules[moduleIndex].title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`module-description-${moduleIndex}`}>Week Description</Label>
                      <Textarea
                        id={`module-description-${moduleIndex}`}
                        placeholder="Enter week description"
                        rows={3}
                        value={module.description}
                        onChange={(e) => handleModuleChange(moduleIndex, "description", e.target.value)}
                        className={errors.modules?.[moduleIndex]?.description ? "border-red-500" : ""}
                      />
                      {errors.modules?.[moduleIndex]?.description && (
                        <p className="text-sm text-red-500">{errors.modules[moduleIndex].description}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {/* <Label htmlFor={`module-video-${moduleIndex}`}>Upload Week Video</Label>
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleVideoChange(moduleIndex, e.dataTransfer.files[0])
                          }
                        }}
                        onClick={() => document.getElementById(`module-video-${moduleIndex}`)?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Drag and drop your video here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {module.video ? `Selected: ${module.video}` : "MP4, MOV, or WebM formats (max 500MB)"}
                        </p>
                        <Input
                          id={`module-video-${moduleIndex}`}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleVideoChange(moduleIndex, e.target.files[0])
                            }
                          }}
                        />
                      </div> */}
                    </div>
                    <Separator className="my-4" />
                    <h4 className="text-md font-medium">Lessons</h4>
                    <div className="space-y-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="space-y-3 border border-muted p-3 rounded-md">
                          <div className="grid gap-4 md:grid-cols-5 items-center">
                            <div className="md:col-span-3">
                              <Label htmlFor={`lesson-title-${moduleIndex}-${lessonIndex}`}>Lesson Title</Label>
                              <Input
                                id={`lesson-title-${moduleIndex}-${lessonIndex}`}
                                placeholder="Lesson title"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)}
                                className={`mt-1 ${errors.modules?.[moduleIndex]?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}`}
                              />
                              {errors.modules?.[moduleIndex]?.lessons?.[lessonIndex]?.title && (
                                <p className="text-sm text-red-500">
                                  {errors.modules[moduleIndex].lessons![lessonIndex].title}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`lesson-duration-${moduleIndex}-${lessonIndex}`}>Duration (min)</Label>
                              <Input
                                id={`lesson-duration-${moduleIndex}-${lessonIndex}`}
                                placeholder="Duration"
                                type="number"
                                value={lesson.duration}
                                onChange={(e) =>
                                  handleLessonChange(moduleIndex, lessonIndex, "duration", e.target.value)
                                }
                                className={`mt-1 ${errors.modules?.[moduleIndex]?.lessons?.[lessonIndex]?.duration ? "border-red-500" : ""}`}
                              />
                              {errors.modules?.[moduleIndex]?.lessons?.[lessonIndex]?.duration && (
                                <p className="text-sm text-red-500">
                                  {errors.modules[moduleIndex].lessons![lessonIndex].duration}
                                </p>
                              )}
                            </div>
                            <div className="flex items-end justify-end h-full">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                                disabled={module.lessons.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {/* <Label htmlFor={`lesson-video-${moduleIndex}-${lessonIndex}`}>Upload Lesson Video</Label>
                            <div
                              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  handleLessonVideoChange(moduleIndex, lessonIndex, e.dataTransfer.files[0])
                                }
                              }}
                              onClick={() =>
                                document.getElementById(`lesson-video-${moduleIndex}-${lessonIndex}`)?.click()
                              }
                            >
                              <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground mb-1">
                                Drag and drop video or click to browse
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lesson.video ? `Selected: ${lesson.video}` : "MP4, MOV, or WebM formats"}
                              </p>
                              <Input
                                id={`lesson-video-${moduleIndex}-${lessonIndex}`}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleLessonVideoChange(moduleIndex, lessonIndex, e.target.files[0])
                                  }
                                }}
                              />
                            </div> */}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => handleAddLesson(moduleIndex)} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Lesson
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={handleAddModule} className="w-full mt-6">
                <Plus className="h-4 w-4 mr-2" /> Add Week
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Configure additional settings for your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instructor">Assign Instructor</Label>
                <Select>
                  <SelectTrigger id="instructor">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-james-wilson">Dr. James Wilson</SelectItem>
                    <SelectItem value="prof-sarah-martinez">Prof. Sarah Martinez</SelectItem>
                    <SelectItem value="dr-robert-chen">Dr. Robert Chen</SelectItem>
                    <SelectItem value="prof-lisa-johnson">Prof. Lisa Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollment-limit">Enrollment Limit</Label>
                <Input
                  id="enrollment-limit"
                  type="number"
                  placeholder="Enter enrollment limit (leave empty for unlimited)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {status === "draft" ? "Save as Draft" : "Save as Published"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setStatus("draft")}>Save as Draft</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatus("published")}>Save as Published</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
        <Button onClick={handleSubmit}>Create Course</Button>
      </div>
    </div>
  )
}

