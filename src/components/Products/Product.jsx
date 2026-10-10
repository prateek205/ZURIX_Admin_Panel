import React, { useState, useEffect } from "react";

import {
  useAddProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/ProductApi";

import { FaEye, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { BsPencilSquare } from "react-icons/bs";
import { toast } from "react-toastify";

import ProductModal from "./ProductModel";
import ProductCreateModal from "./CreateProductModel";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const Product = () => {
  // Filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [colors, setColors] = useState("");
  const [size, setSize] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // View/Edit modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // RTK Query mutations
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();

  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();

  const [deleteProduct, { isLoading: isDeletingProduct }] =
    useDeleteProductMutation();

  // Open View/Edit modal
  const handleOpenModal = (product, mode) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // Close View/Edit modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Add product API
  const handleAddProduct = async (formData) => {
    try {
      await addProduct(formData).unwrap();

      toast.success("Product added successfully!");
      setIsAddModalOpen(false);

      // Show the first page after adding a product
      setCurrentPage(1);

      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add product.");

      return false;
    }
  };

  // Update product API
  const handleSaveProduct = async (updatedData) => {
    try {
      const productId = selectedProduct?._id || selectedProduct?.id;

      if (!productId) {
        toast.error("Product ID not found.");
        return false;
      }

      await updateProduct({
        id: productId,
        newData: updatedData,
      }).unwrap();

      toast.success("Product updated successfully!");
      handleCloseModal();

      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update product.");

      return false;
    }
  };

  // Delete product API
  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      toast.error("Product ID not found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await deleteProduct(productId).unwrap();

      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product.");
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
    sort,
    minPrice,
    maxPrice,
    category: category === "All" ? "" : category,
    colors,
    size,
    search,
    filter,
  });

  // Extract products from API response
  const products = Array.isArray(getAllProducts?.data)
    ? getAllProducts.data
    : Array.isArray(getAllProducts?.data?.products)
      ? getAllProducts.data.products
      : Array.isArray(getAllProducts?.products)
        ? getAllProducts.products
        : [];

  // Dynamic categories from products
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    filter,
    category,
    minPrice,
    maxPrice,
    sort,
    colors,
    size,
    itemsPerPage,
  ]);

  // Pagination calculations
  const totalProducts = products.length;

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

  // Get products for current page
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Keep current page valid when products are deleted
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);

    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

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
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  // Error state
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
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <span className="text-lg">+</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-black"
          >
            <option value="newest">Newest First</option>
            <option value="maxPrice">Price: Low to High</option>
            <option value="minPrice">Price: High to Low</option>
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
              {paginatedProducts.map((product, index) => {
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
                    {/* Index */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>

                    {/* Product Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={typeof image === "string" ? image : image.url}
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
                            {product.description
                              ? `${product.description.slice(0, 100)}...`
                              : "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        {categoryName}
                      </span>
                    </td>

                    {/* Original Price */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {formatPrice(product.price)}
                    </td>

                    {/* Sale Price */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-black">
                      {formatPrice(product.salePrice ?? product.price)}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.stock ?? product.quantity ?? 0}
                    </td>

                    {/* Status */}
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

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View Product */}
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

                        {/* Delete Product */}
                        <button
                          type="button"
                          title="Delete product"
                          disabled={isDeletingProduct}
                          onClick={() => handleDeleteProduct(productId)}
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {totalProducts === 0 && (
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

        {/* Table Footer and Pagination */}
        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Product count and page size */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {totalProducts === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to <span className="font-semibold text-gray-900">{endIndex}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {totalProducts}
              </span>{" "}
              products
            </p>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              aria-label="Products per page"
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-black"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>

          {/* Fetching indicator */}
          {isFetching && (
            <p className="text-xs text-gray-500">Updating product list...</p>
          )}

          {/* Pagination controls */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaChevronLeft size={10} />
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-lg px-3 text-xs font-medium transition ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* View/Edit Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        isSaving={isUpdatingProduct}
      />

      {/* Add Product Modal */}
      <ProductCreateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
        isSaving={isAddingProduct}
      />
    </section>
  );
};

export default Product;
