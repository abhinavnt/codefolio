"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Upload } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"

interface Task {
  _id?: string
  title: string
  description: string
  video: string
  lessons: string[]
  duration: string
  status?: "active" | "inactive"
}

type FormErrors = {
  courseTitle?: string
  courseDescription?: string
  courseCategory?: string
  courseLevel?: string
  coursePrice?: string
  courseDuration?: string
  courseImage?: string
  tasks?: Array<{
    title?: string
    description?: string
    lessons?: Array<{ title?: string }>
  }>
  learningPoints?: string
  targetedAudience?: string
  courseRequirements?: string
}

export function EditCourse() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("")
  const [courseLevel, setCourseLevel] = useState("")
  const [coursePrice, setCoursePrice] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseImage, setCourseImage] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [learningPointsRaw, setLearningPointsRaw] = useState("")
  const [targetedAudienceRaw, setTargetedAudienceRaw] = useState("")
  const [courseRequirementsRaw, setCourseRequirementsRaw] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const fetchCourseAndTasks = async () => {
      try {
        const response = await axiosInstance.get(`/api/course/courses/${id}/edit`)
        const { course, tasks } = response.data
        console.log(course,"course tasks",response.data);
        
        setCourseTitle(course.title)
        setCourseDescription(course.description)
        setCourseCategory(course.category)
        setCourseLevel(course.level)
        setCoursePrice(course.price)
        setCourseDuration(course.duration)
        setExistingImage(course.image)
        setTasks(tasks.map((task: Task) => ({
          _id: task._id,
          title: task.title,
          description: task.description,
          video: task.video,
          lessons: task.lessons || [],
          duration: task.duration,
          status: task.status,
        })))
        setLearningPointsRaw(course.learningPoints.join(", "))
        setTargetedAudienceRaw(course.targetedAudience.join(", "))
        setCourseRequirementsRaw(course.courseRequirements.join(", "))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching course and tasks:", error)
        setLoading(false)
        toast.error("Failed to load course data")
      }

    };
    fetchCourseAndTasks()
  }, [id])

  const validateField = (field: string, value: string | File | null, required = true): string => {
    if (field === "courseImage") {
      if (value instanceof File) {
        if (value.size > 5 * 1024 * 1024) return "Image size must be less than 5MB"
        if (!value.type.startsWith("image/")) return "Only image files are allowed"
      }
      return ""
    }
    if (required && (!value || (typeof value === "string" && value.trim() === ""))) {
      return "This field is required"
    }
    if (field === "coursePrice" && typeof value === "string" && value) {
      const price = Number.parseFloat(value)
      if (isNaN(price) || price < 0) return "Price must be a valid positive number"
    }
    if (field === "courseDuration" && typeof value === "string" && value) {
      const duration = Number.parseFloat(value)
      if (isNaN(duration) || duration <= 0) return "Duration must be a valid positive number"
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const learningPoints = learningPointsRaw.split(",").map(item => item.trim()).filter(item => item !== "")
    const targetedAudience = targetedAudienceRaw.split(",").map(item => item.trim()).filter(item => item !== "")
    const courseRequirements = courseRequirementsRaw.split(",").map(item => item.trim()).filter(item => item !== "")

    const newErrors: FormErrors = {}
    newErrors.courseTitle = validateField("courseTitle", courseTitle)
    newErrors.courseDescription = validateField("courseDescription", courseDescription)
    newErrors.courseCategory = validateField("courseCategory", courseCategory)
    newErrors.courseLevel = validateField("courseLevel", courseLevel)
    newErrors.coursePrice = validateField("coursePrice", coursePrice)
    newErrors.courseDuration = validateField("courseDuration", courseDuration)
    newErrors.learningPoints = validateField("learningPoints", learningPointsRaw)
    newErrors.targetedAudience = validateField("targetedAudience", targetedAudienceRaw)
    newErrors.courseRequirements = validateField("courseRequirements", courseRequirementsRaw)
    newErrors.tasks = tasks.map((task, index) => ({
      title: validateField(`task-${index}-title`, task.title),
      description: validateField(`task-${index}-description`, task.description),
      lessons: task.lessons.map((lesson, lessonIndex) => ({
        title: validateField(`lesson-${index}-${lessonIndex}-title`, lesson),
      })),
    }))

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((error) => {
        if (typeof error === "string" && error !== "") return true;
        if (Array.isArray(error)) {
          return error.some((taskError) => {
            return (
              (taskError.title && taskError.title !== "") ||
              (taskError.description && taskError.description !== "") || 
              (Array.isArray(taskError.lessons) && taskError.lessons.some((lessonError) => lessonError.title && lessonError.title !== "")) // Check lessons safely
            );
          });
        }
        return false;
      });

    if (!hasErrors) {
      const formData = new FormData()
      const updatedCourse = {
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        level: courseLevel,
        price: coursePrice,
        duration: courseDuration,
        image: existingImage,
        learningPoints,
        targetedAudience,
        courseRequirements,
      }
      formData.append("course", JSON.stringify(updatedCourse))
      formData.append("tasks", JSON.stringify(tasks))
      if (courseImage) formData.append("image", courseImage)

      try {
        const response = await axiosInstance.put(`/api/course/courses/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        if (response.status === 200) {
          toast.success("Course updated successfully")
          navigate("/admin/courses")
        }
      } catch (error) {
        console.error("Error updating course:", error)
        toast.error("Failed to update course")
      }
    }
  }

  const handleTaskChange = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = [...tasks]
    updatedTasks[index] = { ...updatedTasks[index], [field]: value }
    setTasks(updatedTasks)
    setErrors(prev => {
      const newTaskErrors = [...(prev.tasks || [])]
      newTaskErrors[index] = {
        ...newTaskErrors[index],
        [field]: validateField(`task-${index}-${field}`, value),
      }
      return { ...prev, tasks: newTaskErrors }
    })
  }

  const handleLessonChange = (taskIndex: number, lessonIndex: number, value: string) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].lessons[lessonIndex] = value
    setTasks(updatedTasks)
    setErrors(prev => {
      const newTaskErrors = [...(prev.tasks || [])]
      if (!newTaskErrors[taskIndex]) newTaskErrors[taskIndex] = { lessons: [] }
      if (!newTaskErrors[taskIndex].lessons) newTaskErrors[taskIndex].lessons = []
      newTaskErrors[taskIndex].lessons![lessonIndex] = {
        title: validateField(`lesson-${taskIndex}-${lessonIndex}-title`, value),
      }
      return { ...prev, tasks: newTaskErrors }
    })
  }

  const handleAddTask = () => {
    setTasks([...tasks, { title: "", description: "", video: "", lessons: [""], duration: "" }])
  }

  const handleRemoveTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index)
    setTasks(updatedTasks)
  }

  const handleAddLesson = (taskIndex: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].lessons.push("")
    setTasks(updatedTasks)
  }

  const handleRemoveLesson = (taskIndex: number, lessonIndex: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].lessons.splice(lessonIndex, 1)
    setTasks(updatedTasks)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Edit Course</h2>
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
              <CardDescription>Edit the basic details of your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={courseTitle}
                  onChange={(e) => {
                    setCourseTitle(e.target.value)
                    setErrors(prev => ({ ...prev, courseTitle: validateField("courseTitle", e.target.value) }))
                  }}
                  className={errors.courseTitle ? "border-red-500" : ""}
                />
                {errors.courseTitle && <p className="text-sm text-red-500">{errors.courseTitle}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  value={courseDescription}
                  onChange={(e) => {
                    setCourseDescription(e.target.value)
                    setErrors(prev => ({ ...prev, courseDescription: validateField("courseDescription", e.target.value) }))
                  }}
                  className={errors.courseDescription ? "border-red-500" : ""}
                />
                {errors.courseDescription && <p className="text-sm text-red-500">{errors.courseDescription}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="learningPoints">Learning Points</Label>
                <Textarea
                  id="learningPoints"
                  value={learningPointsRaw}
                  onChange={(e) => {
                    setLearningPointsRaw(e.target.value)
                    setErrors(prev => ({ ...prev, learningPoints: validateField("learningPoints", e.target.value) }))
                  }}
                  className={errors.learningPoints ? "border-red-500" : ""}
                />
                {errors.learningPoints && <p className="text-sm text-red-500">{errors.learningPoints}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetedAudience">Targeted Audience</Label>
                <Textarea
                  id="targetedAudience"
                  value={targetedAudienceRaw}
                  onChange={(e) => {
                    setTargetedAudienceRaw(e.target.value)
                    setErrors(prev => ({ ...prev, targetedAudience: validateField("targetedAudience", e.target.value) }))
                  }}
                  className={errors.targetedAudience ? "border-red-500" : ""}
                />
                {errors.targetedAudience && <p className="text-sm text-red-500">{errors.targetedAudience}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseRequirements">Course Requirements</Label>
                <Textarea
                  id="courseRequirements"
                  value={courseRequirementsRaw}
                  onChange={(e) => {
                    setCourseRequirementsRaw(e.target.value)
                    setErrors(prev => ({ ...prev, courseRequirements: validateField("courseRequirements", e.target.value) }))
                  }}
                  className={errors.courseRequirements ? "border-red-500" : ""}
                />
                {errors.courseRequirements && <p className="text-sm text-red-500">{errors.courseRequirements}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={courseCategory} onValueChange={(value) => {
                    setCourseCategory(value)
                    setErrors(prev => ({ ...prev, courseCategory: validateField("courseCategory", value) }))
                  }}>
                    <SelectTrigger id="category" className={errors.courseCategory ? "border-red-500" : ""}>
                      <SelectValue />
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
                  <Select value={courseLevel} onValueChange={(value) => {
                    setCourseLevel(value)
                    setErrors(prev => ({ ...prev, courseLevel: validateField("courseLevel", value) }))
                  }}>
                    <SelectTrigger id="level" className={errors.courseLevel ? "border-red-500" : ""}>
                      <SelectValue />
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
                    value={coursePrice}
                    onChange={(e) => {
                      setCoursePrice(e.target.value)
                      setErrors(prev => ({ ...prev, coursePrice: validateField("coursePrice", e.target.value) }))
                    }}
                    className={errors.coursePrice ? "border-red-500" : ""}
                  />
                  {errors.coursePrice && <p className="text-sm text-red-500">{errors.coursePrice}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={courseDuration}
                    onChange={(e) => {
                      setCourseDuration(e.target.value)
                      setErrors(prev => ({ ...prev, courseDuration: validateField("courseDuration", e.target.value) }))
                    }}
                    className={errors.courseDuration ? "border-red-500" : ""}
                  />
                  {errors.courseDuration && <p className="text-sm text-red-500">{errors.courseDuration}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Course Image</Label>
                {existingImage && (
                  <img src={existingImage} alt="Current course image" className="w-32 h-32 object-cover mb-2" />
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCourseImage(e.target.files ? e.target.files[0] : null)}
                  className={errors.courseImage ? "border-red-500" : ""}
                />
                {errors.courseImage && <p className="text-sm text-red-500">{errors.courseImage}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Edit tasks and lessons for your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="space-y-4 border p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Task {taskIndex + 1}</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveTask(taskIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`task-title-${taskIndex}`}>Task Title</Label>
                    <Input
                      id={`task-title-${taskIndex}`}
                      value={task.title}
                      onChange={(e) => handleTaskChange(taskIndex, "title", e.target.value)}
                      className={errors.tasks?.[taskIndex]?.title ? "border-red-500" : ""}
                    />
                    {errors.tasks?.[taskIndex]?.title && (
                      <p className="text-sm text-red-500">{errors.tasks[taskIndex].title}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`task-description-${taskIndex}`}>Task Description</Label>
                    <Textarea
                      id={`task-description-${taskIndex}`}
                      value={task.description}
                      onChange={(e) => handleTaskChange(taskIndex, "description", e.target.value)}
                      className={errors.tasks?.[taskIndex]?.description ? "border-red-500" : ""}
                    />
                    {errors.tasks?.[taskIndex]?.description && (
                      <p className="text-sm text-red-500">{errors.tasks[taskIndex].description}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`task-video-${taskIndex}`}>Video URL</Label>
                    <Input
                      id={`task-video-${taskIndex}`}
                      value={task.video}
                      onChange={(e) => handleTaskChange(taskIndex, "video", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`task-duration-${taskIndex}`}>Duration</Label>
                    <Input
                      id={`task-duration-${taskIndex}`}
                      value={task.duration}
                      onChange={(e) => handleTaskChange(taskIndex, "duration", e.target.value)}
                    />
                  </div>
                  <Separator />
                  <h4 className="text-md font-medium">Lessons</h4>
                  {task.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center space-x-2">
                      <Input
                        value={lesson}
                        onChange={(e) => handleLessonChange(taskIndex, lessonIndex, e.target.value)}
                        className={errors.tasks?.[taskIndex]?.lessons?.[lessonIndex]?.title ? "border-red-500" : ""}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveLesson(taskIndex, lessonIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {errors.tasks?.[taskIndex]?.lessons?.[lessonIndex]?.title && (
                        <p className="text-sm text-red-500">{errors.tasks[taskIndex].lessons![lessonIndex].title}</p>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => handleAddLesson(taskIndex)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Lesson
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Configure additional settings (not editable in this version).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings like visibility and enrollment limits are not implemented in this edit form.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/admin/courses")}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  )
}