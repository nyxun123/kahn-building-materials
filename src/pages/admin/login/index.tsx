import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLogin } from "@refinedev/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const { t } = useTranslation(["common", "admin"]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login({ email: data.email, password: data.password });
      if (result?.success) {
        toast.success(t("admin:login.success"));
      } else {
        throw new Error(result?.error?.message || t("admin:login.error"));
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error instanceof Error ? error.message : t("admin:login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>
          {t("admin:login.page_title")} | {t("title")}
        </title>
      </Helmet>

      <div className="max-w-md w-full space-y-8 rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
        <div>
          <h2 className="mt-3 text-center text-3xl font-extrabold text-slate-900">
            {t("admin:login.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            {t("admin:login.subtitle")}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                {t("admin:login.email")}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.email?.type === 'required' && (
                <p className="mt-1 text-sm text-rose-500">{t("admin:login.required")}</p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="mt-1 text-sm text-rose-500">{t("admin:login.email_invalid")}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                {t("admin:login.password")}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  {...register("password", { required: true })}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-rose-500">{t("admin:login.required")}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t("admin:login.logging_in") : t("admin:login.login_button")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
