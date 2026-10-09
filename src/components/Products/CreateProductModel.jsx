import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useGetAllCategoryQuery } from "../../redux/CategoryApi";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  stock: "",
  size: [],
  colors: [],
};

const ProductCreateModal = ({ isOpen, onClose, onSave, isSaving = false }) => {
  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);

  const {
    data: categoryResponse,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetAllCategoryQuery();

  const categories = Array.isArray(categoryResponse?.data)
    ? categoryResponse.data
    : Array.isArray(categoryResponse?.data?.categories)
      ? categoryResponse.data.categories
      : [];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, selectedOptions } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Array.from(selectedOptions, (option) => option.value),
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("price", formData.price);
    payload.append("salePrice", formData.salePrice);
    payload.append("stock", formData.stock);

    formData.size.forEach((item) => payload.append("size", item));
    formData.colors.forEach((item) => payload.append("colors", item));
    images.forEach((file) => payload.append("images", file));

    const success = await onSave(payload);

    if (success) {
      setFormData(initialForm);
      setImages([]);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-black disabled:opacity-60";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Product</h2>
            <p className="mt-1 text-xs text-gray-500">
              Enter product details and upload images.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category *</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isCategoriesLoading || isCategoriesError}
                className={inputClass}
              >
                <option value="">
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : isCategoriesError
                      ? "Failed to load categories"
                      : "Select Category"}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {isCategoriesError && (
                <p className="mt-1 text-xs text-red-500">
                  Unable to load categories. Please try again.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Original Price *</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter original price"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                min="0"
                value={formData.salePrice}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter sale price"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Stock *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sizes *</label>
              <select
                name="size"
                multiple
                value={formData.size}
                onChange={handleMultiSelect}
                required
                className={`${inputClass} min-h-28`}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="X-Large">X-Large</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl (Windows) or Command (Mac) to select multiple.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Colors *</label>
              <select
                name="colors"
                multiple
                value={formData.colors}
                onChange={handleMultiSelect}
                required
                className={`${inputClass} min-h-28`}
              >
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Violet">Violet</option>
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Select one or more colors.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter product description"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Product Images *</label>
              <label className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 text-center transition hover:border-black">
                <FaCloudUploadAlt className="mb-2 text-2xl text-gray-500" />
                <span className="text-sm font-medium">
                  Click to upload images
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  Select one or multiple image files
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="mt-3 space-y-1">
                  {images.map((file, index) => (
                    <p
                      key={`${file.name}-${index}`}
                      className="truncate text-xs text-gray-600"
                    >
                      {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {isSaving ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreateModal;
