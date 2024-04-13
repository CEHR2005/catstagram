import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterSchema: ZodSchema<any> = z.object({
  username: z.string(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

export const Register = () => {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast({
        title: "Success",
        description: "Registered successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue with your registration.",
      });
      console.error("Error during fetch operation: ", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("username")} placeholder="Username" />
      <Input {...form.register("email")} placeholder="Email" />
      <Input
        {...form.register("password")}
        placeholder="Password"
        type="password"
      />
      <Button type="submit">Register</Button>
    </form>
  );
};
