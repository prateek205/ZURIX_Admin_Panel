import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialProducts = [
  {
    id: 1,
    name: "ZURIX Basic T-Shirt",
    description: "Premium cotton t-shirt for casual wear.",
    category: "Men",
    price: 1299,
    salePrice: 999,
    stock: 50,
    status: "Active",
    image: "https://placehold.co/100x100/f5f5f5/222?text=T-Shirt",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    description: "Comfortable and perfect fit jeans for men.",
    category: "Men",
    price: 2499,
    salePrice: 1999,
    stock: 30,
    status: "Active",
    image: "https://placehold.co/100x100/f5f5f5/222?text=Jeans",
  },
  {
    id: 3,
    name: "ZURIX Handbag",
    description: "Stylish handbag for women.",
    category: "Women",
    price: 3499,
    salePrice: 2799,
    stock: 20,
    status: "Active",
    image: "https://placehold.co/100x100/f5f5f5/222?text=Bag",
  },
  {
    id: 4,
    name: "Running Sneakers",
    description: "Lightweight sneakers for everyday comfort.",
    category: "Shoes",
    price: 4999,
    salePrice: 3999,
    stock: 25,
    status: "Active",
    image: "https://placehold.co/100x100/f5f5f5/222?text=Shoes",
  },
  {
    id: 5,
    name: "Classic Sunglasses",
    description: "Minimal design with UV protection.",
    category: "Accessories",
    price: 1999,
    salePrice: 1499,
    stock: 15,
    status: "Inactive",
    image: "https://placehold.co/100x100/f5f5f5/222?text=Glasses",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const Product = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStatus = status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sort === "priceLow") {
      result = [...result].sort((a, b) => a.salePrice - b.salePrice);
    } else if (sort === "priceHigh") {
      result = [...result].sort((a, b) => b.salePrice - a.salePrice);
    } else {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, search, category, status, sort]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setStatus("All");
    setSort("newest");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this sample product?",
    );

    if (confirmed) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  };

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
          <div className="relative xl:col-span-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
          >
            <option value="newest">Newest First</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:border-black hover:text-black"
          >
            Reset Filters
          </button>
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
                  "Price",
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
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg border border-gray-100 bg-gray-50 object-cover"
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                      {product.category}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {formatPrice(product.price)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-black">
                    {formatPrice(product.salePrice)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="View product"
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-black hover:text-black"
                      >
                        ↗
                      </button>

                      <button
                        type="button"
                        title="Edit product"
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-black hover:text-black"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        title="Delete sample product"
                        onClick={() => handleDelete(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
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
            Showing {filteredProducts.length} of {products.length} products
          </p>

          <p className="text-xs text-gray-400">ZURIX Store Management</p>
        </div>
      </div>
    </section>
  );
};

export default Product;
