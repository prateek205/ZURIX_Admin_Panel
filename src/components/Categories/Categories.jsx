import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBoxes,
  FaTimes,
} from "react-icons/fa";

import { useGetAllCategoryQuery } from "../../redux/CategoryApi";
import { useGetAllProductsQuery } from "../../redux/ProductApi";
import CategoryModel from "./CategoryModel";

const Categories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch categories
  const {
    data: getAllCategory,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoryError,
  } = useGetAllCategoryQuery();

  // Fetch products and their variant inventory
  const {
    data: getAllProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetAllProductsQuery({});

  const categories = Array.isArray(getAllCategory?.data)
    ? getAllCategory.data
    : Array.isArray(getAllCategory?.data?.categories)
      ? getAllCategory.data.categories
      : Array.isArray(getAllCategory?.categories)
        ? getAllCategory.categories
        : [];

  const products = Array.isArray(getAllProducts?.data)
    ? getAllProducts.data
    : Array.isArray(getAllProducts?.data?.products)
      ? getAllProducts.data.products
      : Array.isArray(getAllProducts?.products)
        ? getAllProducts.products
        : [];

  // Calculate inventory for every category
  const categoryInventory = useMemo(() => {
    const inventoryMap = new Map();

    categories.forEach((category) => {
      const categoryId = String(category._id || category.id);

      inventoryMap.set(categoryId, {
        productCount: 0,
        totalStock: 0,
        variants: [],
        products: [],
      });
    });

    products.forEach((product) => {
      const categoryId = String(
        product?.category?._id ||
          product?.category?.id ||
          product?.category ||
          "",
      );

      const inventory = inventoryMap.get(categoryId);

      if (!inventory) return;

      inventory.productCount += 1;
      inventory.products.push(product);

      // Use variant stock when available.
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          const stock = Math.max(0, Number(variant.stock) || 0);

          inventory.totalStock += stock;

          inventory.variants.push({
            productName: product.name || "Unnamed Product",
            color: variant.color || "N/A",
            size: variant.size || "N/A",
            stock,
          });
        });
      } else {
        // Compatibility with products created before variant inventory.
        inventory.totalStock += Math.max(0, Number(product.stock) || 0);
      }
    });

    return inventoryMap;
  }, [categories, products]);

  const filteredCategories = categories.filter((category) =>
    (category?.name || "").toLowerCase().includes(search.toLowerCase().trim()),
  );

  const activeCategories = categories.filter(
    (category) => category.isActive !== false,
  );

  const inactiveCategories = categories.filter(
    (category) => category.isActive === false,
  );

  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCategories);

  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

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

  if (isCategoriesLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (isCategoriesError) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] p-6 font-zurixFont">
        <h1 className="text-3xl font-semibold text-black">Categories</h1>

        <p className="mt-3 text-sm text-red-600">
          Failed to load categories. Please try again.
        </p>

        <pre className="mt-3 overflow-auto text-xs text-gray-500">
          {JSON.stringify(categoryError, null, 2)}
        </pre>
      </section>
    );
  }

  const selectedCategoryId = selectedCategory
    ? String(selectedCategory._id || selectedCategory.id)
    : "";

  const selectedInventory = selectedCategoryId
    ? categoryInventory.get(selectedCategoryId)
    : null;

  return (
    <section className="min-h-screen bg-[#f8f8f6] p-4 font-zurixFont sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-gray-400">
            Dashboard / Categories
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Organize categories and monitor product inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <FaPlus size={12} />
          Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Categories</p>
          <h2 className="mt-3 text-3xl font-semibold text-black">
            {categories.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active Categories</p>
          <h2 className="mt-3 text-3xl font-semibold text-black">
            {activeCategories.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Inactive Categories</p>
          <h2 className="mt-3 text-3xl font-semibold text-black">
            {inactiveCategories.length}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none transition focus:border-black"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold text-gray-900">All Categories</h2>

          <p className="text-xs text-gray-500">
            {totalCategories} categories found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f5f5f3]">
                {[
                  "#",
                  "Category",
                  "Products",
                  "Total Stock",
                  "Status",
                  "Inventory",
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
              {paginatedCategories.map((category, index) => {
                const categoryId = String(category._id || category.id || "");

                const isActive = category.isActive !== false;
                const inventory = categoryInventory.get(categoryId);

                return (
                  <tr
                    key={categoryId || index}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {category.name || "Unnamed Category"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          ID: {categoryId || "N/A"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {isProductsLoading
                        ? "Loading..."
                        : inventory?.productCount || 0}
                    </td>

                    <td className="px-5 py-4">
                      {isProductsLoading ? (
                        <span className="text-xs text-gray-400">
                          Loading...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-800">
                          <FaBoxes className="text-gray-500" />
                          {inventory?.totalStock || 0} units
                        </span>
                      )}
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
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        disabled={isProductsLoading || isProductsError}
                        className="whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-800 transition hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        View Inventory
                      </button>
                    </td>
                  </tr>
                );
              })}

              {totalCategories === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="font-medium text-gray-800">
                      No categories found
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Try searching with another category name.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {totalCategories === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to <span className="font-semibold text-gray-900">{endIndex}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {totalCategories}
              </span>{" "}
              categories
            </p>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-black"
              aria-label="Categories per page"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>

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

      {/* Inventory Details Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedCategory.name} Inventory
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Stock breakdown by product, color, and size.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                aria-label="Close inventory"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Products</p>
                <p className="mt-2 text-2xl font-semibold">
                  {selectedInventory?.productCount || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Total Units</p>
                <p className="mt-2 text-2xl font-semibold">
                  {selectedInventory?.totalStock || 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Low-stock Variants</p>
                <p className="mt-2 text-2xl font-semibold">
                  {
                    (selectedInventory?.variants || []).filter(
                      (variant) => variant.stock <= 5,
                    ).length
                  }
                </p>
                <p className="mt-1 text-xs text-gray-400">5 units or fewer</p>
              </div>
            </div>

            <div className="px-5 pb-6 sm:px-6">
              {isProductsError ? (
                <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  Unable to load product inventory. Please try again.
                </p>
              ) : !selectedInventory?.products?.length ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                  <FaBoxes className="mx-auto mb-3 text-3xl text-gray-300" />
                  <p className="font-medium text-gray-800">
                    No products in this category
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Inventory will appear here when products are assigned to
                    this category.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {selectedInventory.products.map((product, index) => {
                    const variants = Array.isArray(product.variants)
                      ? product.variants
                      : [];

                    return (
                      <div
                        key={product._id || product.id || index}
                        className="overflow-hidden rounded-xl border border-gray-200"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 px-4 py-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {product.name || "Unnamed Product"}
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                              {variants.length} color-size variants
                            </p>
                          </div>

                          <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-800">
                            {variants.length > 0
                              ? variants.reduce(
                                  (total, variant) =>
                                    total +
                                    Math.max(0, Number(variant.stock) || 0),
                                  0,
                                )
                              : Math.max(0, Number(product.stock) || 0)}{" "}
                            units
                          </span>
                        </div>

                        {variants.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[420px] text-left text-sm">
                              <thead className="text-xs uppercase text-gray-500">
                                <tr>
                                  <th className="px-4 py-3 font-medium">
                                    Color
                                  </th>
                                  <th className="px-4 py-3 font-medium">
                                    Size
                                  </th>
                                  <th className="px-4 py-3 font-medium">
                                    Available Stock
                                  </th>
                                  <th className="px-4 py-3 font-medium">
                                    Status
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-gray-100">
                                {variants.map((variant, variantIndex) => {
                                  const stock = Math.max(
                                    0,
                                    Number(variant.stock) || 0,
                                  );

                                  return (
                                    <tr
                                      key={
                                        variant._id ||
                                        `${variant.color}-${variant.size}-${variantIndex}`
                                      }
                                    >
                                      <td className="px-4 py-3">
                                        <span className="inline-flex items-center gap-2">
                                          <span
                                            className="h-3 w-3 rounded-full border border-gray-300"
                                            style={{
                                              backgroundColor: (
                                                variant.color || ""
                                              ).toLowerCase(),
                                            }}
                                          />
                                          {variant.color || "N/A"}
                                        </span>
                                      </td>

                                      <td className="px-4 py-3">
                                        {variant.size || "N/A"}
                                      </td>

                                      <td className="px-4 py-3 font-medium">
                                        {stock}
                                      </td>

                                      <td className="px-4 py-3">
                                        <span
                                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                            stock === 0
                                              ? "bg-red-50 text-red-600"
                                              : stock <= 5
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-green-50 text-green-700"
                                          }`}
                                        >
                                          {stock === 0
                                            ? "Out of stock"
                                            : stock <= 5
                                              ? "Low stock"
                                              : "In stock"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="px-4 py-4 text-sm text-gray-500">
                            This is an older product without variant-level
                            stock. Total recorded stock:{" "}
                            {Math.max(0, Number(product.stock) || 0)}.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      <CategoryModel
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </section>
  );
};

export default Categories;
