"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CountryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CountriesClientProps {
  data: CountryColumn[];
}

export default function CountriesClient({ data }: CountriesClientProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Countries (${data.length})`}
          description="Manage countries of origin for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/countries/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for Countries" />
      <Separator />
      <ApiList entityName="countries" entityIdName="countryId" />
    </>
  );
}
