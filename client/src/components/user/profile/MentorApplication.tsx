import React, { useState, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Upload, Linkedin, Github, Twitter, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mentorReq } from "@/services/userService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DotLoading } from "../common/Loading";

// Mock tech skills data
const TECH_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Angular",
  "Vue.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST API",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Firebase",
  "Supabase",
] as const;

// Languages
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Arabic",
  "Hindi",
  "Portuguese",
  "Italian",
  "Korean",
] as const;

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  dateOfBirth: z.date({ required_error: "Please select your date of birth." }),
  yearsOfExperience: z.string().min(1, { message: "Please enter your years of experience." }),
  currentCompany: z.string().min(1, { message: "Please enter your current company name." }),
  currentRole: z.string().min(1, { message: "Please enter your current role." }),
  durationAtCompany: z.string().min(1, { message: "Please enter how long you've been with the company." }),
  technicalSkills: z.array(z.string()).min(1, { message: "Please select at least one skill." }),
  primaryLanguage: z.string({ required_error: "Please select a primary language." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
  linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal("")),
  github: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid Twitter URL." }).optional().or(z.literal("")),
  instagram: z.string().url({ message: "Please enter a valid Instagram URL." }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const MentorApplicationPage: React.FC = () => {

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.auth.user)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: undefined as any, // TypeScript workaround for initial null date
      yearsOfExperience: "",
      currentCompany: "",
      currentRole: "",
      durationAtCompany: "",
      technicalSkills: [],
      primaryLanguage: "",
      bio: "",
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
    },
  });


 async function onSubmit(values: FormValues) {
    const formData = new FormData();

    // Append all text fields
    formData.append('name',user.name)
    formData.append("username", values.username);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);
    formData.append("dateOfBirth", values.dateOfBirth.toISOString());
    formData.append("yearsOfExperience", values.yearsOfExperience);
    formData.append("currentCompany", values.currentCompany);
    formData.append("currentRole", values.currentRole);
    formData.append("durationAtCompany", values.durationAtCompany);
    values.technicalSkills.forEach((skill) => formData.append("technicalSkills[]", skill)); // Array handling
    formData.append("primaryLanguage", values.primaryLanguage);
    formData.append("bio", values.bio);
    if (values.linkedin) formData.append("linkedin", values.linkedin);
    if (values.github) formData.append("github", values.github);
    if (values.twitter) formData.append("twitter", values.twitter);
    if (values.instagram) formData.append("instagram", values.instagram);

    // Append files if they exist
    if (selectedProfileImage) formData.append("profileImage", selectedProfileImage);
    if (resume) formData.append("resume", resume);

    // Log FormData for debugging (you can't console.log FormData directly, so we iterate)
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Here you would typically send the formData to your backend API
    try {
      setLoading(true)
    const response=  await mentorReq(formData)
    console.log(response,'from frontend apllicatoin');
      if(response?.status===201){
        setLoading(false)
        toast.success('request submited done')
        setTimeout(() => {
          navigate("/profile");
        }, 1500); 

      }else{
        setLoading(false)
        toast.error('somthing went wrong when submiting')
      }
    } catch (error) {
      
    }

    
    
  }

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      const newSkills = selectedSkills.filter((s) => s !== skill);
      setSelectedSkills(newSkills);
      form.setValue("technicalSkills", newSkills);
    } else {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      form.setValue("technicalSkills", newSkills);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

    

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-600">Become a Mentor</h1>
        <p className="text-gray-600 mt-2 text-center max-w-2xl">
          Share your knowledge and experience with aspiring developers. Fill out the application form below to join our
          mentorship program.
        </p>
      </div>

      <Card className="w-full max-w-4xl mx-auto border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-50 border-b border-emerald-100">
          <CardTitle className="text-emerald-700">Mentor Application Form</CardTitle>
          <CardDescription>Please provide all the required information to apply as a mentor</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Image Upload */}
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-200 mb-2">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-emerald-300" />
                      </div>
                    )}
                  </div>
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <span className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                      {profileImage ? "Change Profile Image" : "Upload Profile Image"}
                    </span>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfileImageChange}
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 1MB</p>
                </div>

                {/* Personal Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-emerald-700">Personal Information</h3>
                  <Separator className="bg-emerald-100" />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Professional Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-emerald-700">Professional Information</h3>
                  <Separator className="bg-emerald-100" />
                </div>

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationAtCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration at Current Company</FormLabel>
                      <FormControl>
                        <Input placeholder="2 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resume Upload */}
                <div className="md:col-span-2">
                  <Label htmlFor="resume" className="block text-sm font-medium mb-1">
                    Resume/CV
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="flex-1"
                    />
                    {resume && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {resume.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload your resume (PDF, DOC, or DOCX format)</p>
                </div>

                {/* Skills & Languages */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-emerald-700">Skills & Languages</h3>
                  <Separator className="bg-emerald-100" />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="technicalSkills"
                    render={() => (
                      <FormItem>
                        <FormLabel>Technical Skills</FormLabel>
                        <FormControl>
                          <div className="border rounded-md p-3 bg-white">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {selectedSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer"
                                  onClick={() => handleSkillSelect(skill)}
                                >
                                  {skill} ✕
                                </Badge>
                              ))}
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {TECH_SKILLS.map((skill) => (
                                  <div
                                    key={skill}
                                    className={cn(
                                      "px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors",
                                      selectedSkills.includes(skill)
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "hover:bg-gray-100"
                                    )}
                                    onClick={() => handleSkillSelect(skill)}
                                  >
                                    {skill}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>Select all the skills you are proficient in</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="primaryLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself, your experience, and why you want to be a mentor..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>This will be displayed on your mentor profile</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Social Media Links */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-emerald-700">Social Media Links</h3>
                  <Separator className="bg-emerald-100" />
                </div>

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0">
                            <Linkedin className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input placeholder="https://linkedin.com/in/username" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0">
                            <Github className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input placeholder="https://github.com/username" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0">
                            <Twitter className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input placeholder="https://twitter.com/username" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className="bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0">
                            <Instagram className="h-4 w-4 text-gray-500" />
                          </div>
                          <Input placeholder="https://instagram.com/username" className="rounded-l-none" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Submit Application
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorApplicationPage;