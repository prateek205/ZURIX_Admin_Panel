import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../../redux/ProductApi";
import { FaEye, FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import ProductModal from "./ProductModel";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const Product = () => {
  const navigate = useNavigate();

  // Filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [colors, setColors] = useState("");
  const [size, setSize] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();

  const handleSaveProduct = async (updatedData) => {
    try {
      const productId = selectedProduct?._id || selectedProduct?.id;

      await updateProduct({
        id: productId,
        ...updatedData,
      }).unwrap();

      toast.success("Product updated successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product.");
    }
  };

  // Get products from backend
  const {
    data: getAllProducts,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllProductsQuery({
    search,
    filter,
    category: category === "All" ? "" : category,
    minPrice,
    maxPrice,
    sort,
    colors: colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean),
    size: size
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  // Extract products from API response
  const products = Array.isArray(getAllProducts?.data)
    ? getAllProducts.data
    : Array.isArray(getAllProducts?.data?.products)
      ? getAllProducts.data.products
      : Array.isArray(getAllProducts?.products)
        ? getAllProducts.products
        : [];

  // Dynamic categories from API products
  const categories = [
    ...new Map(
      products
        .map((product) => {
          const productCategory = product?.category;

          if (
            productCategory &&
            typeof productCategory === "object" &&
            productCategory._id
          ) {
            return [
              productCategory._id,
              {
                value: productCategory._id,
                label: productCategory.name || "Unnamed Category",
              },
            ];
          }

          if (typeof productCategory === "string") {
            return [
              productCategory,
              {
                value: productCategory,
                label: productCategory,
              },
            ];
          }

          return null;
        })
        .filter(Boolean),
    ).values(),
  ];

  // Reset all filters
  const handleReset = () => {
    setSearch("");
    setFilter("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setColors("");
    setSize("");
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] p-6 font-zurixFont">
        <p className="text-sm text-gray-500">Loading products...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] p-6 font-zurixFont">
        <h1 className="text-3xl font-semibold text-black">Products</h1>
        <p className="mt-3 text-sm text-red-600">
          Failed to load products. Please try again.
        </p>
        <pre className="mt-3 overflow-auto text-xs text-gray-500">
          {JSON.stringify(error, null, 2)}
        </pre>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f8f6] p-4 font-zurixFont sm:p-6 lg:p-8">
      {/* Page Heading */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-400">
            Dashboard / Products
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your product catalog and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/products/add")}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <span className="text-lg">+</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name..."
            className="h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-black"
          />
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black"
          >
            <option value="All">All Categories</option>

            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {/* Colors Dropdown */}
          <select
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black"
          >
            <option value="">All Colors</option>
            <option value="Red">Red</option>
            <option value="Green">Green</option>
            <option value="Blue">Blue</option>
            <option value="Violet">Violet</option>
          </select>
          {/* Sizes Dropdown */}
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black"
          >
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="X-Large">X-Large</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black"
          >
            <option value="newest">Newest First</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f5f5f3]">
                {[
                  "#",
                  "Product",
                  "Category",
                  "Original Price",
                  "Sale Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => {
                const image = Array.isArray(product.images)
                  ? product.images[0]
                  : product.images;

                const productId = product._id || product.id;

                const categoryName =
                  product.category?.name ||
                  (typeof product.category === "string"
                    ? product.category
                    : "Uncategorized");

                const isActive =
                  product.status != null
                    ? String(product.status).toLowerCase() === "active"
                    : product.isActive !== false;

                return (
                  <tr
                    key={productId || index}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={product.images[0]?.url}
                            alt={product.name || "Product"}
                            className="h-14 w-14 rounded-lg border border-gray-100 bg-gray-50 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            No image
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                            {product.description.slice(0, 100) ||
                              "No description"}
                            ...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {categoryName}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatPrice(product.price)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-black">
                      {formatPrice(product.salePrice ?? product.price)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.stock ?? product.quantity ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View product"
                          onClick={() => handleOpenModal(product, "view")}
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                        >
                          <FaEye />
                        </button>

                        {/* Edit Product */}
                        <button
                          type="button"
                          title="Edit product"
                          onClick={() => handleOpenModal(product, "edit")}
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                        >
                          <BsPencilSquare />
                        </button>

                        <button
                          type="button"
                          title="Edit product"
                          onClick={() =>
                            navigate(`/products/edit/${productId}`)
                          }
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-base font-medium text-gray-800">
                      No products found
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-4 text-sm font-medium text-black underline underline-offset-4"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Showing {products.length} products.
          </p>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        isSaving={isUpdatingProduct}
      />
    </section>
  );
};

export default Product;
