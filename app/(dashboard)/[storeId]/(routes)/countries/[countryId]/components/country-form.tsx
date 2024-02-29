"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { Country } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { isValidCountryCode } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3).regex(/^[a-zA-Z\-'\s]+$/, {
    message: "Name must be a valid country"
  }),
  value: z.string().min(2).max(2, { message: "Country code must be only 2 letters" }),
});

type CountryFormValues = z.infer<typeof formSchema>;

interface CountryFormProps {
  initialData: Country | null;
}

export default function CountryForm({ initialData }: CountryFormProps) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit country" : "Create country";
  const description = initialData ? "Edit a country" : "Add a country";
  const toastMessage = initialData ? "Country updated" : "Country created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    }
  });

  async function onSubmit(data: CountryFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/countries/${params.countryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/countries`, data);
      }
      router.push(`/${params.storeId}/countries`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/countries/${params.countryId}`);
      router.refresh();
      router.push(`/${params.storeId}/countries`);
      toast.success("Country deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products using this country.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two-Letter Country Code*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4 w-72">
                      <Input
                        disabled={loading}
                        placeholder="Country value"
                        {...field}
                      />
                      {isValidCountryCode(field.value)
                        ? (
                          <ReactCountryFlag
                            countryCode={field.value}
                            svg
                            style={{ width: "5rem", height: "2.5rem" }}
                          />
                        ) : (
                          <div className="w-[5rem] h-[2.5rem] invisible" />)
                      }
                    </div>
                  </FormControl>
                  <a
                    href="https://www.iban.com/country-codes"
                    target="_blank"
                    className="text-xs hover:underline text-muted-foreground"
                  >
                    *List of Codes Here
                  </a>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
