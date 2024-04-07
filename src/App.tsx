import './App.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

const catPostSchema = z.object({
    image: z.string().nonempty({ message: "Image is required" }),
    authorName: z.string().nonempty({ message: "Author name is required" }),
    authorEmail: z.string().email({ message: "Invalid email address" }),
    comment: z.string().optional(),
});

function App() {
    const form = useForm({
        resolver: zodResolver(catPostSchema)
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <Input type="file" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.image && form.formState.errors.image.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.authorName && form.formState.errors.authorName.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="authorEmail"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Author Email</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.authorEmail && form.formState.errors.authorEmail.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.comment && form.formState.errors.comment.message}</FormMessage>
                    </FormItem>
                )}
            />
            <Button type="submit">Submit</Button>
        </form>
    );
}

export default App;