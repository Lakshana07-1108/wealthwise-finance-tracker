
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Upload } from "lucide-react";
import * as React from "react";
import { useUser } from "@/hooks/use-auth";
import { useDoc } from "@/hooks/use-doc";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { UserProfile } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export default function SettingsPage() {
  const user = useUser();
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(`users/${user?.uid}`);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
    },
  });

  React.useEffect(() => {
    if (user && userProfile) {
        form.reset({
            name: userProfile.name || user.email?.split('@')[0] || '',
            email: user.email || "",
            avatar: userProfile.avatar || "",
        });
    } else if (user) {
        form.reset({
            name: user.email?.split('@')[0] || 'New User',
            email: user.email || "",
            avatar: "",
        });
    }
  }, [user, userProfile, form]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      form.setValue("avatar", downloadURL);
      
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { avatar: downloadURL }, { merge: true });

      toast({
        title: "Avatar Updated",
        description: "Your new profile picture has been saved.",
      });

    } catch (error) {
      console.error("Error uploading avatar: ", error);
       toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload your new avatar. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { name: values.name, email: values.email }, { merge: true });
      toast({
        title: "Profile Updated",
        description: "Your account details have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
          <CardDescription>
            Update your profile information. Changes will be reflected across
            the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                          <AvatarImage
                            src={field.value}
                            alt={form.getValues('name')}
                            data-ai-hint="profile picture"
                          />
                          <AvatarFallback>
                             {isUploading ? (
                                <Loader2 className="h-10 w-10 animate-spin" />
                            ) : (
                                <span className="text-3xl">{getInitials(form.getValues('name'))}</span>
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAvatarClick}>
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8" />
                          )}
                        </div>
                      </div>
                       <Button type="button" variant="outline" onClick={handleAvatarClick} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Change Picture"}
                      </Button>
                      <FormControl>
                        <Input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileChange} 
                          accept="image/png, image/jpeg, image/gif"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This email will be used for login and notifications.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isUploading || profileLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
