import TextInputFieldForForm from "@/components/common/TextInputFieldForForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { loginSchema } from "@/form_schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { userInfo } from "@/store/authentication.ts";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useSetRecoilState(userInfo);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const result = await axios.post("auth/login", data);
      setUser(result.data.data.user);
      await Cookies.set("access_token", result.data.data.access_token);
      toast.success(result.data.message);
      setIsLoading(false);
      navigate("/dashboard/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      setIsLoading(false);
    }
  };

  return (
      <div className="bg-background text-foreground h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <CardHeader>
            <CardTitle>{t("BesharaFactoryManagement")}</CardTitle>
            <CardDescription>{t("LoginToBesharaDashboard")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder={t("Username")}
                            label={t("Username")}
                            field={field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <TextInputFieldForForm
                            placeholder={t("Password")}
                            label={t("Password")}
                            field={field}
                            type="password"
                        />
                    )}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("PleaseWait")}
                        </>
                    ) : (
                        t("Login")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );
}
