import React, { useState, useEffect } from "react";
import { useGetAllOrdersQuery } from "../../redux/OrdersApi";

import {
  BiCheckCircle,
  BiPackage,
  BiSearch,
  BiShoppingBag,
} from "react-icons/bi";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { BsEye } from "react-icons/bs";
import { LuSlidersHorizontal } from "react-icons/lu";
import OrderViewModal from "./OrderModel";

const Orders = () => {
  const {
    data: getAllOrders,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Extract orders from API response
  const orders = Array.isArray(getAllOrders?.order) ? getAllOrders.order : [];

  // Search and filter orders
  const search = searchTerm.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const orderId = String(order?._id || order?.orderId || "");

    const customerName = order?.shippingAddress?.fullName || "Customer";

    const email = order?.user?.email || "—";

    const status = String(order?.orderStatus || "Pending");

    const matchesSearch =
      orderId.toLowerCase().includes(search) ||
      customerName.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Reset to first page when search, status, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Pagination calculations
  const totalOrders = filteredOrders.length;

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = Math.min(startIndex + itemsPerPage, totalOrders);

  // Orders for the current page
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Keep page valid if the order list changes
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

  // Statistics from API data
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: BiShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Orders",
      value: orders.filter(
        (order) => String(order?.orderStatus).toLowerCase() === "pending",
      ).length,
      icon: BiPackage,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Processing",
      value: orders.filter(
        (order) => String(order?.orderStatus).toLowerCase() === "processing",
      ).length,
      icon: BiPackage,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Delivered",
      value: orders.filter(
        (order) => String(order?.orderStatus).toLowerCase() === "delivered",
      ).length,
      icon: BiCheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700",
      processing: "bg-violet-50 text-violet-700",
      shipped: "bg-blue-50 text-blue-700",
      delivered: "bg-green-50 text-green-700",
      cancelled: "bg-red-50 text-red-700",
      confirm: "bg-green-50 text-green-700",
    };

    return (
      styles[String(status || "").toLowerCase()] || "bg-gray-100 text-gray-700"
    );
  };

  const formatStatus = (status) => {
    const normalized = String(status || "Pending")
      .toLowerCase()
      .replace(/_/g, " ");

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const getPaymentStyle = (status) => {
    return String(status || "").toLowerCase() === "paid"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";
  };

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

        <p className="mt-4 text-sm text-red-600">
          Failed to load orders.{" "}
          {error?.data?.message || error?.error || "Please try again."}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BiShoppingBag size={18} />
          <span>Order Management</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header, Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>

            <p className="mt-1 text-sm text-gray-500">
              View and manage customer purchases.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <BiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search order or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-gray-400 sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <LuSlidersHorizontal
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm outline-none focus:border-gray-400 sm:w-44"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="CONFIRM">Confirmed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.map((order) => {
                const orderId = order?._id || order?.orderId;

                const customerName =
                  order?.shippingAddress?.fullName || "Customer";

                const email = order?.user?.email || "—";

                const status = order?.orderStatus || "Pending";

                const paymentStatus = order?.paymentStatus || "Pending";

                const itemCount = Array.isArray(order?.items)
                  ? order.items.reduce(
                      (total, item) => total + (Number(item?.quantity) || 0),
                      0,
                    )
                  : 0;

                return (
                  <tr key={orderId} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {String(orderId || "—").slice(-8)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {customerName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">{email}</p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(order?.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">{itemCount}</td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(order?.totalAmount)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="text-gray-700">
                          {order?.paymentMethod || "—"}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStyle(
                            paymentStatus,
                          )}`}
                        >
                          {formatStatus(paymentStatus)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                          status,
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        title="View order"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:bg-gray-100"
                      >
                        <BsEye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {totalOrders === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <BiPackage size={30} className="mb-3 text-gray-300" />

                      <p className="font-medium text-gray-700">
                        No orders found
                      </p>

                      <p className="mt-1 text-sm">
                        Try changing your search or status filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer and Pagination */}
        <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Order Count and Page Size */}
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {totalOrders === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to <span className="font-semibold text-gray-900">{endIndex}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalOrders}</span>{" "}
              filtered orders
            </p>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              aria-label="Orders per page"
              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none focus:border-black"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>

          {/* Page Controls */}
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

      {/* Order View Modal */}
      <OrderViewModal
        isOpen={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </section>
  );
};

export default Orders;
