import prismadb from "@/lib/prismadb";
import CountryForm from "./components/country-form";


export default async function CountryPage({
  params
}: {
  params: { countryId: string; };
}) {

  const country = await prismadb.country.findUnique({
    where: {
      id: params.countryId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CountryForm initialData={country} />
      </div>
    </div>
  );
}
