
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
import { Plus, Trash2 } from "lucide-react"

export function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("")
  const [courseLevel, setCourseLevel] = useState("")
  const [coursePrice, setCoursePrice] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseImage, setCourseImage] = useState("")
  const [courseModules, setCourseModules] = useState([
    { title: "", description: "", lessons: [{ title: "", duration: "" }] },
  ])

  const handleAddModule = () => {
    setCourseModules([...courseModules, { title: "", description: "", lessons: [{ title: "", duration: "" }] }])
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
  }

  const handleAddLesson = (moduleIndex: number) => {
    const updatedModules = [...courseModules]
    updatedModules[moduleIndex].lessons.push({ title: "", duration: "" })
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the course data to your backend
    console.log({
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      level: courseLevel,
      price: coursePrice,
      duration: courseDuration,
      image: courseImage,
      modules: courseModules,
    })
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
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter course description"
                  rows={5}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={courseCategory} onValueChange={setCourseCategory}>
                    <SelectTrigger id="category">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={courseLevel} onValueChange={setCourseLevel}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter duration"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Course Image URL</Label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  value={courseImage}
                  onChange={(e) => setCourseImage(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Add modules and lessons to your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {courseModules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="space-y-4 border p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Module {moduleIndex + 1}</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveModule(moduleIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`module-title-${moduleIndex}`}>Module Title</Label>
                    <Input
                      id={`module-title-${moduleIndex}`}
                      placeholder="Enter module title"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`module-description-${moduleIndex}`}>Module Description</Label>
                    <Textarea
                      id={`module-description-${moduleIndex}`}
                      placeholder="Enter module description"
                      rows={3}
                      value={module.description}
                      onChange={(e) => handleModuleChange(moduleIndex, "description", e.target.value)}
                    />
                  </div>
                  <Separator className="my-4" />
                  <h4 className="text-md font-medium">Lessons</h4>
                  <div className="space-y-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="grid gap-4 md:grid-cols-5 items-center">
                        <div className="md:col-span-3">
                          <Label htmlFor={`lesson-title-${moduleIndex}-${lessonIndex}`} className="sr-only">
                            Lesson Title
                          </Label>
                          <Input
                            id={`lesson-title-${moduleIndex}-${lessonIndex}`}
                            placeholder="Lesson title"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`lesson-duration-${moduleIndex}-${lessonIndex}`} className="sr-only">
                            Duration (minutes)
                          </Label>
                          <Input
                            id={`lesson-duration-${moduleIndex}-${lessonIndex}`}
                            placeholder="Duration (min)"
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "duration", e.target.value)}
                          />
                        </div>
                        <div>
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
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleAddLesson(moduleIndex)} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Lesson
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddModule} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Module
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
        <Button variant="outline">Save as Draft</Button>
        <Button onClick={handleSubmit}>Create Course</Button>
      </div>
    </div>
  )
}

