import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAddCategoryMutation } from "../../redux/CategoryApi";

const CategoryModel = ({ isOpen, onClose }) => {
  const [addCategory, { isLoading, isError }] = useAddCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      await addCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
      }).unwrap();

      toast.success("Category added successfully!");

      setFormData({
        name: "",
        description: "",
      });

      onClose?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add category.");
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-black";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Category
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Create a new product category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label
                htmlFor="categoryName"
                className="text-sm font-medium text-gray-700"
              >
                Category Name *
              </label>

              <input
                id="categoryName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="categoryDescription"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="categoryDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows={4}
                className={inputClass}
              />
            </div>

            {isError && (
              <p className="text-sm text-red-600">
                Unable to add category. Please try again.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPlus size={11} />
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CategoryModel;
