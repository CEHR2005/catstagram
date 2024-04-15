import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
type LoginData = {
  email: string;
  password: string;
};

const LoginSchema: ZodSchema<LoginData> = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
});

export const Login = () => {
  const navigate = useNavigate();
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const user = await response.json();

      // Сохраняем информацию о пользователе в куки
      Cookies.set("user", JSON.stringify(user));

      toast({
        title: "Success",
        description: "Logged in successfully.",
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue with your login.",
      });
      console.error("Error during fetch operation: ", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} placeholder="Email" />
      <Input
        {...form.register("password")}
        placeholder="Password"
        type="password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};
