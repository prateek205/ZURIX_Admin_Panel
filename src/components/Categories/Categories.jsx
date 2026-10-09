import React, { useState } from "react";
import { FaPlus, FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { useGetAllCategoryQuery } from "../../redux/CategoryApi";

const Categories = () => {
  const [search, setSearch] = useState("");

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

  const activeCategories = categories.filter(
    (category) => category.isActive !== false,
  );

  const inactiveCategories = categories.filter(
    (category) => category.isActive === false,
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] p-6 font-zurixFont">
        <p className="text-sm text-gray-500">Loading categories...</p>
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
            {filteredCategories.length} categories found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-[#f5f5f3]">
                {["#", "Category", "Status", "Actions"].map((heading) => (
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
              {filteredCategories.map((category, index) => {
                const categoryId = category._id || category.id;
                const isActive = category.isActive !== false;

                return (
                  <tr
                    key={categoryId || index}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                          {(category.name || "C").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {category.name || "Unnamed Category"}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            ID: {categoryId || "N/A"}
                          </p>
                        </div>
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

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View category"
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Edit category"
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-black hover:text-black"
                        >
                          <BsPencilSquare />
                        </button>

                        <button
                          type="button"
                          title="Delete category"
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:border-red-500 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCategories.length === 0 && (
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

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            Showing {filteredCategories.length} categories.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Categories;
