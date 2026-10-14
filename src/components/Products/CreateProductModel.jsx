import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useGetAllCategoryQuery } from "../../redux/CategoryApi";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  size: [],
  colors: [],
  variants: [],
};

const SIZE_OPTIONS = ["Small", "Medium", "Large", "X-Large"];
const COLOR_OPTIONS = ["Red", "Green", "Blue", "Violet"];

// Create every color-size combination while preserving existing stock.
const buildVariantMatrix = (colors, sizes, existingVariants = []) => {
  return colors.flatMap((color) =>
    sizes.map((size) => {
      const existing = existingVariants.find(
        (variant) => variant.color === color && variant.size === size,
      );

      return {
        color,
        size,
        stock: existing ? existing.stock : "",
      };
    }),
  );
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
    const selectedValues = Array.from(
      selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: selectedValues,
      };

      const colors = name === "colors" ? selectedValues : prev.colors;

      const sizes = name === "size" ? selectedValues : prev.size;

      updated.variants = buildVariantMatrix(colors, sizes, prev.variants);

      return updated;
    });
  };

  const handleVariantStockChange = (color, size, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.color === color && variant.size === size
          ? { ...variant, stock: value }
          : variant,
      ),
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.colors.length || !formData.size.length) {
      alert("Please select at least one color and one size.");
      return;
    }

    if (!formData.variants.length) {
      alert("Please configure stock for the selected variants.");
      return;
    }

    const invalidVariant = formData.variants.find(
      (variant) =>
        variant.stock === "" ||
        variant.stock === null ||
        !Number.isInteger(Number(variant.stock)) ||
        Number(variant.stock) < 0,
    );

    if (invalidVariant) {
      alert(
        `Enter a valid non-negative stock quantity for ${invalidVariant.color} / ${invalidVariant.size}.`,
      );
      return;
    }

    const variants = formData.variants.map((variant) => ({
      color: variant.color,
      size: variant.size,
      stock: Number(variant.stock),
    }));

    const totalStock = variants.reduce(
      (total, variant) => total + variant.stock,
      0,
    );

    const payload = new FormData();

    payload.append("name", formData.name.trim());
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    payload.append("price", formData.price);
    payload.append("salePrice", formData.salePrice);

    // The backend receives variants as a JSON string.
    payload.append("variants", JSON.stringify(variants));

    // Optional compatibility field for existing code.
    payload.append("stock", String(totalStock));

    // Preserve compatibility with existing frontend/backend fields.
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

  const totalStock = formData.variants.reduce(
    (total, variant) => total + (Number(variant.stock) || 0),
    0,
  );

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
              Enter product details, variant stock, and images.
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
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter original price"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sale Price *</label>
              <input
                type="number"
                name="salePrice"
                min="0"
                step="0.01"
                value={formData.salePrice}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter sale price"
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
                {SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
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
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Select one or more colors.
              </p>
            </div>

            {/* Stock input for every color-size combination */}
            <div className="sm:col-span-2">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Variant Inventory
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the available quantity for each color and size.
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                  Total stock: <strong>{totalStock}</strong>
                </div>
              </div>

              {formData.variants.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Color</th>
                        <th className="px-4 py-3 font-medium">Size</th>
                        <th className="px-4 py-3 font-medium">
                          Stock Quantity
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {formData.variants.map((variant) => (
                        <tr key={`${variant.color}-${variant.size}`}>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: variant.color.toLowerCase(),
                                }}
                              />
                              {variant.color}
                            </span>
                          </td>

                          <td className="px-4 py-3">{variant.size}</td>

                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              required
                              value={variant.stock}
                              onChange={(e) =>
                                handleVariantStockChange(
                                  variant.color,
                                  variant.size,
                                  e.target.value,
                                )
                              }
                              className="w-full max-w-36 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-black"
                              placeholder="Quantity"
                              aria-label={`${variant.color} ${variant.size} stock`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
                  Select at least one color and one size to configure inventory.
                </div>
              )}
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
