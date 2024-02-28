import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import CountriesClient from "./components/client";
import { CountryColumn } from "./components/columns";

export default async function CountriesPage({
  params
}: { params: { storeId: string; }; }) {

  const countries = await prismadb.country.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedCountries: CountryColumn[] = countries.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CountriesClient data={formattedCountries} />
      </div>
    </div>
  );
}
