import React, { useState } from "react";

import { BiSearch, BiUser, BiUserCheck, BiCalendar } from "react-icons/bi";

import { BsEye } from "react-icons/bs";
import { LuSlidersHorizontal } from "react-icons/lu";

import { useGetAllCustomersQuery } from "../../redux/CustomerApi";
import CustomerModel from "./CustomerModel";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers from the backend API
  const {
    data: customerResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllCustomersQuery();

  // Extract actual customer data from the API response
  const customers = Array.isArray(customerResponse?.data)
    ? customerResponse.data
    : [];

  // Search and registration filter
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (customer.name || "").toLowerCase().includes(search) ||
      (customer.email || "").toLowerCase().includes(search) ||
      (customer._id || "").toLowerCase().includes(search);

    const createdAt = customer.createdAt ? new Date(customer.createdAt) : null;

    const isValidDate = createdAt && !Number.isNaN(createdAt.getTime());

    const now = new Date();

    const matchesRegistration =
      registrationFilter === "All" ||
      (isValidDate &&
        registrationFilter === "This Month" &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear());

    return matchesSearch && matchesRegistration;
  });

  // Calculate statistics from real API data
  const currentMonthCustomers = customers.filter((customer) => {
    if (!customer.createdAt) return false;

    const date = new Date(customer.createdAt);

    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const latestRegistration = customers.reduce((latest, customer) => {
    if (!customer.createdAt) return latest;

    const date = new Date(customer.createdAt);

    if (Number.isNaN(date.getTime())) return latest;

    return !latest || date > latest ? date : latest;
  }, null);

  const stats = [
    {
      title: "Total Customers",
      value: customerResponse?.count ?? customers.length,
      icon: BiUser,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Joined This Month",
      value: currentMonthCustomers,
      icon: BiUserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Search Results",
      value: filteredCustomers.length,
      icon: BiSearch,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Latest Registration",
      value: latestRegistration
        ? latestRegistration.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
      icon: BiCalendar,
      color: "bg-orange-50 text-orange-600",
    },
  ];

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
      <section className="min-h-screen bg-gray-50 p-6">
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="text-sm text-gray-500">Loading customers...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
          <BiUser size={36} className="mx-auto mb-3 text-red-400" />

          <h2 className="text-lg font-semibold text-gray-900">
            Failed to load customers
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error?.data?.message ||
              error?.error ||
              "Something went wrong while fetching customers."}
          </p>

          <button
            type="button"
            onClick={refetch}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

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
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h2 className="mt-2 break-words text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`shrink-0 rounded-lg p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer profiles and registration details.
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
                placeholder="Search name, email or ID..."
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
                value={registrationFilter}
                onChange={(e) => setRegistrationFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm outline-none focus:border-gray-400 sm:w-44"
              >
                <option value="All">All Registrations</option>
                <option value="This Month">Joined This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>

                <th className="px-5 py-4 font-semibold">Customer ID</th>

                <th className="px-5 py-4 font-semibold">Joined Date</th>

                <th className="px-5 py-4 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => {
                const initials = (customer.name || "C")
                  .trim()
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={customer._id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">
                            {customer.name || "Unnamed Customer"}
                          </p>

                          <p className="mt-1 break-all text-xs text-gray-500">
                            {customer.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      <span className="break-all">{customer._id}</span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(customer.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        title="View customer details"
                        aria-label={`View ${customer.name || "customer"} details`}
                        onClick={() => setSelectedCustomer(customer)}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                      >
                        <BsEye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <BiUser size={30} className="mx-auto mb-3 text-gray-300" />

                    <p className="font-medium text-gray-700">
                      No customers found
                    </p>

                    <p className="mt-1 text-sm">
                      Try another search or registration filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-gray-200 px-5 py-4 text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-800">
            {filteredCustomers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-800">
            {customerResponse?.count ?? customers.length}
          </span>{" "}
          customers
        </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerModel
        isOpen={Boolean(selectedCustomer)}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </section>
  );
};

export default Customers;
