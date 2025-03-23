import type React from "react";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/services/userService";
import { toast } from "sonner";

// Interface for all user data
interface SettingsProps {
  name: string;
  username: string;
  email: string;
  title: string;
  profileImage: string;
  isInstructor: boolean;
}

// Type for the form fields
type SettingsFormData = {
  name: string;
  username: string;
  email: string;
  title?: string;
};

// Validation schema for the main settings form
const settingsSchema = z.object({
  name: z.string().min(1, "Full name must be at least 1 character"),
  username: z.string().min(1, "Username must be at least 1 character"),
  email: z.string().email("Please enter a valid email address"),
  title: z.string().max(50, "title must be 50 characters or less").optional(),
});

// Password schema (unchanged)
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function Settings() {
  const [titleLength, settitleLength] = useState(0);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const user = useSelector((state: any) => state.auth.user);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.email?.split("@")[0] || "",
      email: user?.email || "",
      title: user?.title || "",
    },
  });

  const [userData, setUserData] = useState<SettingsProps>({
    name: user?.name || "",
    username: user?.email?.split("@")[0] || "",
    email: user?.email || "",
    title: user?.title || "",
    profileImage: user?.profileImageUrl || "",
    isInstructor: user?.role === "tutor" || false,
  });

  useEffect(() => {
    if (user) {
      const newUserData: SettingsProps = {
        name: user.name || "",
        username: user.email?.split("@")[0] || "",
        email: user.email || "",
        title: user.title || "",
        profileImage: user.profileImageUrl || "",
        isInstructor: user.role === "Mentor" || false,
      };
      setUserData(newUserData);
      form.reset({
        name: newUserData.name,
        username: newUserData.username,
        email: newUserData.email,
        title: newUserData.title,
      });
      settitleLength(user.title?.length || 0);
    }
  }, [user, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); 
      const previewUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        profileImage: previewUrl, 
      }));
    }
  };

  const dispatch = useDispatch();

  // Handle form submission with file
  const handleSaveChanges = async (data: SettingsFormData) => {
    console.log(selectedFile, 'selected');

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("title", data.title || "");
    if (selectedFile) {
      formData.append("profileImage", selectedFile); 
    }

    try {
      await updateProfile(formData, dispatch)
      console.log('profile updated');
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Error updating profile. Please try again!')
    }



  };

  // Password form (unchanged for brevity)
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const handlePasswordChange = (data: any) => {
    console.log("Password change requested:", data);
    setOpenPasswordDialog(false);
    passwordForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4">
      <h1 className="text-xl font-medium mb-6">Account settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="border rounded-md p-4 flex flex-col items-center">
          <div className="w-full max-w-[250px] aspect-square relative mb-4">
            <img
              src={userData.profileImage || "/placeholder.svg"}
              alt="Profile"
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
            <label className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Upload className="w-4 h-4 mr-2" />
              <span className="text-sm">Upload Photo</span>
            </label>
          </div>
          <p className="text-xs text-center text-gray-500">
            Image size should be under 1MB and <br /> image ratio needs to be 1:1
          </p>
        </div>

        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveChanges)} className="grid gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input  {...field} placeholder="Full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Your title, profession or small titlegraphy"
                        maxLength={50}
                        onChange={(e) => {
                          field.onChange(e);
                          settitleLength(e.target.value.length);
                        }}
                      />
                    </FormControl>
                    <span className="absolute right-3 top-2 text-xs text-gray-400">
                      {titleLength}/50
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!form.formState.isDirty && !selectedFile} 
                >
                  Save Changes
                </Button>
                <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" className="bg-blue-500 hover:bg-blue-600">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                        <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Current password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="New password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Confirm new password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit">Change Password</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}