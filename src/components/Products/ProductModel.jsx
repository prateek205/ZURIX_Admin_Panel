import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";

const ProductModal = ({
  product,
  isOpen,
  mode,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category:
          product.category?._id ||
          (typeof product.category === "string" ? product.category : ""),
        price: product.price ?? "",
        salePrice: product.salePrice ?? "",
        stock: product.stock ?? product.quantity ?? 0,
        size: Array.isArray(product.size) ? product.size.join(", ") : "",
        colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      });
      setIsEditMode(mode === "edit");
    }
  }, [product, mode, isOpen]);

  if (!isOpen || !product) return null;

  const productImage = Array.isArray(product.images)
    ? product.images[0]?.url
    : product.images;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      price: Number(formData.price),
      salePrice:
        formData.salePrice === "" ? undefined : Number(formData.salePrice),
      stock: Number(formData.stock),
      size: formData.size
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500";

  const fields = [
    { label: "Product Name", name: "name", type: "text" },
    { label: "Price", name: "price", type: "number" },
    { label: "Sale Price", name: "salePrice", type: "number" },
    { label: "Stock", name: "stock", type: "number" },
    { label: "Sizes (comma separated)", name: "size", type: "text" },
    { label: "Colors (comma separated)", name: "colors", type: "text" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Product" : "Product Details"}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {isEditMode
                ? "Update product information"
                : "View complete product information"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6">
            {/* Product Image */}
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Product Image
              </p>

              {productImage ? (
                <img
                  src={productImage}
                  alt={product.name || "Product"}
                  className="h-44 w-full rounded-xl border border-gray-200 bg-gray-50 object-contain p-3"
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
                  No product image available
                </div>
              )}
            </div>

            {/* Editable Fields */}
            {fields.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  min={field.type === "number" ? 0 : undefined}
                  required={["name", "price", "stock"].includes(field.name)}
                  className={inputClass}
                />
              </div>
            ))}

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={
                  product.category?.name || formData.category || "Uncategorized"
                }
                disabled
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">
                Category editing is not enabled in this modal.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={product.isActive === false ? "Inactive" : "Active"}
                disabled
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description ?? ""}
                onChange={handleChange}
                disabled={!isEditMode}
                className={inputClass}
              />
            </div>

            {/* Product ID */}
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400">
                Product ID: {product._id || product.id}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t bg-white px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>

            {isEditMode ? (
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                <FaEdit />
                Edit Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
