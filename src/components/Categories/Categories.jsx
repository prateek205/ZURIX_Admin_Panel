import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useGetAllCategoryQuery } from "../../redux/CategoryApi";
import CategoryModel from "./CategoryModel";

const Categories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch categories from backend
  const {
    data: getAllCategory,
    isLoading,
    isError,
    error,
  } = useGetAllCategoryQuery();

  // Extract categories from API response
  const categories = Array.isArray(getAllCategory?.data)
    ? getAllCategory.data
    : Array.isArray(getAllCategory?.data?.categories)
      ? getAllCategory.data.categories
      : Array.isArray(getAllCategory?.categories)
        ? getAllCategory.categories
        : [];

  // Search categories
  const filteredCategories = categories.filter((category) =>
    (category?.name || "").toLowerCase().includes(search.toLowerCase().trim()),
  );

  // Summary counts
  const activeCategories = categories.filter(
    (category) => category.isActive !== false,
  );

  const inactiveCategories = categories.filter(
    (category) => category.isActive === false,
  );

  // Pagination calculations
  const totalCategories = filteredCategories.length;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCategories);

  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to first page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  // Keep the current page valid if the category list changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Generate page numbers
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

  // Loading state
  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] p-6 font-zurixFont">
        <h1 className="text-3xl font-semibold text-black">Categories</h1>

        <p className="mt-3 text-sm text-red-600">
          Failed to load categories. Please try again.
        </p>

        <pre className="mt-3 overflow-auto text-xs text-gray-500">
          {JSON.stringify(error, null, 2)}
        </pre>
      </section>
    );
  }

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
            Organize and manage your product categories.
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
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f5f5f3]">
                {["#", "Category", "Status"].map((heading) => (
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
                const categoryId = category._id || category.id;
                const isActive = category.isActive !== false;

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
                  </tr>
                );
              })}

              {totalCategories === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-16 text-center">
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
          {/* Showing count */}
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

      {/* Add Category Modal */}
      <CategoryModel
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </section>
  );
};

export default Categories;
