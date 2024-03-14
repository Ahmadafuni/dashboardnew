import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { loginSchema } from "@/form_schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log(data);
  }
  return (
    <div className="bg-background text-foreground h-screen flex items-center justify-center">
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Beshara</CardTitle>
          <CardDescription>Login to Beshara dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder={"jhon.doe"}
                    label={"Username"}
                    field={field}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <TextInputFieldForForm
                    placeholder={"Password"}
                    label={"Password"}
                    field={field}
                    type="password"
                  />
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="ml-auto">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        {/* <CardFooter>
          <p className="text-center w-full">
            Forgot password? Please contact with your manager.
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
}
