import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast.ts";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { User } from "@/types.ts";
const FormSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

const Post = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    const user = Cookies.get("user");
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    const userData: User = JSON.parse(user);
    console.log(user);
    if (!userData) {
      console.error("User data is missing");
      return;
    }
    formData.append("authorName", userData.username);
    formData.append("authorEmail", userData.email);
    formData.append("comment", data.comment);

    const inputElement = document.getElementById("picture") as HTMLInputElement;
    const file = inputElement.files ? inputElement.files[0] : null;

    if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error:",
        description: "File size must be less than 2MB",
      });
      return;
    }

    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      navigate("/");
      toast({
        title: "Success",
        description: "Post has been uploaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue with your submission.",
      });
      console.error("Error during fetch operation: ", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>comment</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Post;
