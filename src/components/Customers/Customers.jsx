import React, { useState } from "react";
import {
  BiSearch,
  BiUser,
  BiUserCheck,
  BiUserX,
  BiShoppingBag,
} from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { LuSlidersHorizontal } from "react-icons/lu";
import CustomerModel from "./CustomerModel";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Temporary data for UI preview
  const customers = [
    {
      _id: "CUS-1001",
      name: "Prateek Bahad",
      email: "prateek@example.com",
      phone: "9090909090",
      orders: 4,
      totalSpent: 5999,
      status: "Active",
      joinedAt: "Oct 09, 2026",
    },
    {
      _id: "CUS-1002",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "9876543210",
      orders: 3,
      totalSpent: 4299,
      status: "Active",
      joinedAt: "Oct 07, 2026",
    },
    {
      _id: "CUS-1003",
      name: "Priya Patil",
      email: "priya@example.com",
      phone: "9876501234",
      orders: 0,
      totalSpent: 0,
      status: "Inactive",
      joinedAt: "Oct 05, 2026",
    },
    {
      _id: "CUS-1004",
      name: "Amit Verma",
      email: "amit@example.com",
      phone: "9988776655",
      orders: 2,
      totalSpent: 2499,
      status: "Active",
      joinedAt: "Oct 03, 2026",
    },
    {
      _id: "CUS-1005",
      name: "Sneha Deshmukh",
      email: "sneha@example.com",
      phone: "9098765432",
      orders: 1,
      totalSpent: 1499,
      status: "Inactive",
      joinedAt: "Oct 01, 2026",
    },
  ];

  // Search and filter
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone.includes(search) ||
      customer._id.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: BiUser,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Customers",
      value: customers.filter((c) => c.status === "Active").length,
      icon: BiUserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive Customers",
      value: customers.filter((c) => c.status === "Inactive").length,
      icon: BiUserX,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Total Orders",
      value: customers.reduce((total, c) => total + c.orders, 0),
      icon: BiShoppingBag,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your registered customers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BiUser size={20} />
          <span>Customer Management</span>
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

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Customers
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customer profiles and purchase activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <BiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none transition focus:border-gray-400 sm:w-64"
              />
            </div>

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
                <option value="All">All Customers</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Phone</th>
                <th className="px-5 py-4 font-semibold">Orders</th>
                <th className="px-5 py-4 font-semibold">Total Spent</th>
                <th className="px-5 py-4 font-semibold">Joined Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="transition hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600">
                        {customer.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">{customer.phone}</td>

                  <td className="px-5 py-4 text-gray-700">{customer.orders}</td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                    {formatPrice(customer.totalSpent)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {customer.joinedAt}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(customer)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    >
                      <BsEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <BiUser size={30} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-700">
                      No customers found
                    </p>
                    <p className="mt-1 text-sm">
                      Try another search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">
            {filteredCustomers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-800">{customers.length}</span>{" "}
          customers
        </div>
      </div>

      {/* Basic View Customer Popup */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-700">
                {selectedCustomer.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {selectedCustomer.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedCustomer.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Customer ID</span>
                <span className="break-all text-right font-medium text-gray-800">
                  {selectedCustomer._id}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-800">
                  {selectedCustomer.phone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Total Orders</span>
                <span className="font-medium text-gray-800">
                  {selectedCustomer.orders}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Total Spent</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(selectedCustomer.totalSpent)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-gray-800">
                  {selectedCustomer.status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Joined Date</span>
                <span className="font-medium text-gray-800">
                  {selectedCustomer.joinedAt}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <CustomerModel
        isOpen={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </section>
  );
};

export default Customers;
