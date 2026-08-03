import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { passwordChangeSchema, PasswordChangeValues } from "@/lib/configs/schemas-zod/form/password-change-schema"
import { usersApi } from "@/api/users/users.api"
import { useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { isAxiosError } from "axios"

export function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: PasswordChangeValues) {
    setIsLoading(true)
    try {
      await usersApi.changePassword(values)
      toast.success("Mot de passe modifié avec succès")
      form.reset()
    } catch (error: unknown) {
      const errorMessage = isAxiosError(error) ? error.response?.data?.message : null;
      toast.error(errorMessage || "Erreur lors de la modification du mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 ">
          <Lock className="h-5 w-5 text-primary" />
          Sécurité
        </CardTitle>
        <CardDescription>
          Modifiez votre mot de passe pour sécuriser votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancien mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Modifier le mot de passe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
