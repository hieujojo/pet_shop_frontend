import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProductDetail from "@/components/Products/ProductDetail";

const ProductDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params; 
  const id = resolvedParams.id;

  return (
    <>
      <Header />
      <ProductDetail product={{ id }} />
      <Footer />
    </>
  );
};

export default ProductDetailPage;