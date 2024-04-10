import './App.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {Label} from "@/components/ui/label.tsx";
import {ImageGallery} from "@/components/ui/Gallery.tsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Routes, Route } from 'react-router-dom'
const FormSchema = z.object({
    authorName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    authorEmail: z.string().email({
        message: "Please enter a valid email address.",
    }),
    comment: z.string().min(2, {
        message: "Comment must be at least 2 characters.",
    }),
})

function App() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            authorName: "",
            authorEmail: "",
            comment: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const formData = new FormData();
        formData.append('authorName', data.authorName);
        formData.append('authorEmail', data.authorEmail);
        formData.append('comment', data.comment);

        const inputElement = document.getElementById('picture') as HTMLInputElement;
        const file = inputElement.files ? inputElement.files[0] : null;

        if (file && file.size > 2 * 1024 * 1024) {
            toast({
                title: "Error:",
                description: "File size must be less than 2MB",
            })
            return;
        }

        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result);
            toast({
                title: "Success",
                description: "Post has been uploaded.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an issue with your submission.",
            });
            console.error('Error during fetch operation: ', error);
        }
    }

  return (
      <Routes>
          <Route path="/" element={
              <>
                  <header>
                      <NavigationMenu>
                          <NavigationMenuList>
                              <NavigationMenuItem>
                                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                                  <NavigationMenuContent>
                                      <NavigationMenuLink href="/about">Link</NavigationMenuLink>
                                  </NavigationMenuContent>
                              </NavigationMenuItem>
                          </NavigationMenuList>
                      </NavigationMenu>
                  </header>


                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                          <FormField
                              control={form.control}
                              name="authorName"
                              render={({field}) => (
                                  <FormItem>
                                      <FormLabel>authorName</FormLabel>
                                      <FormControl>
                                          <Input placeholder="" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                      </FormDescription>
                                      <FormMessage/>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="authorEmail"
                              render={({field}) => (
                                  <FormItem>
                                      <FormLabel>authorEmail</FormLabel>
                                      <FormControl>
                                          <Input placeholder="" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                      </FormDescription>
                                      <FormMessage/>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="comment"
                              render={({field}) => (
                                  <FormItem>
                                      <FormLabel>comment</FormLabel>
                                      <FormControl>
                                          <Input placeholder="" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                      </FormDescription>
                                      <FormMessage/>
                                  </FormItem>
                              )}
                          />
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="picture">Picture</Label>
                              <Input id="picture" type="file"/>
                          </div>
                          <Button type="submit">Submit</Button>
                      </form>
                  </Form>
                  <ImageGallery/></>
          }>

          </Route>
          <Route path="/about" element={
              <h1>About</h1>
          }>

          </Route>
      </Routes>
  )
}

export default App
