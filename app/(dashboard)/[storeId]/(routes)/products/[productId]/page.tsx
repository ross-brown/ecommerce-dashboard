import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";


export default async function ProductPage({
  params
}: {
  params: { productId: string, storeId: string; };
}) {

  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId
    },
    include: {
      images: true
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    }
  });

  const countries = await prismadb.country.findMany({
    where: {
      storeId: params.storeId
    }
  });


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          countries={countries}
        />
      </div>
    </div>
  );
}
