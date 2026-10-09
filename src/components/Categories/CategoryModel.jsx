import React, { useState } from "react";
import { FaTimes, FaPlus, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAddCategoryMutation } from "../../redux/CategoryApi";

const initialForm = {
  name: "",
  gender: "",
  image: "",
};

const CategoryModel = ({ isOpen, onClose }) => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.gender || !formData.image.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await addCategory({
        name: formData.name.trim(),
        gender: formData.gender,
        image: formData.image.trim(),
      }).unwrap();

      toast.success("Category added successfully!");
      setFormData(initialForm);
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
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Category
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Add a new product category.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            {/* Category Name */}
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
                placeholder="e.g. Dresses"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="categoryGender"
                className="text-sm font-medium text-gray-700"
              >
                Gender *
              </label>

              <select
                id="categoryGender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={`${inputClass} bg-white`}
              >
                <option value="">Select Gender</option>
                <option value="womens">Women's</option>
                <option value="mens">Men's</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            {/* Image URL */}

            {/* Image URL */}
            <div>
              <label
                htmlFor="categoryImage"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Image URL *
              </label>

              <div className="relative">
                <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="categoryImage"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/category.jpg"
                  required
                  className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* Image Preview */}
              {formData.image.trim() && (
                <div className="mt-3">
                  <p className="mb-2 text-xs text-gray-500">Image Preview</p>

                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="h-36 w-full rounded-lg border border-gray-200 bg-gray-50 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>
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
