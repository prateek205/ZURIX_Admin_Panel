import React from "react";
import {
  BsX,
  BsPerson,
  BsEnvelope,
  BsTelephone,
  BsCalendar3,
  BsBag,
  BsCurrencyRupee,
  BsGeoAlt,
} from "react-icons/bs";

const CustomerModel = ({ isOpen, onClose, customer }) => {
  if (!isOpen || !customer) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price || 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isActive = String(customer.status || "").toLowerCase() === "active";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <h2
              id="customer-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Customer Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View customer account information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <BsX size={25} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Customer Profile */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-2xl font-semibold text-white">
              {customer.name?.charAt(0)?.toUpperCase() || <BsPerson />}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {customer.name || "Unknown Customer"}
              </h3>
              <p className="mt-1 break-all text-sm text-gray-500">
                {customer.email || "No email available"}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {customer.status || "Unknown"}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500">Customer ID</p>
              <p className="mt-1 break-all text-sm font-medium text-gray-800">
                {customer._id || customer.id || "—"}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BsBag size={19} />
              </div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {customer.orders ?? customer.totalOrders ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <BsCurrencyRupee size={19} />
              </div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="mt-1 text-xl font-bold text-gray-900">
                {formatPrice(customer.totalSpent)}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <BsCalendar3 size={19} />
              </div>
              <p className="text-sm text-gray-500">Joined Date</p>
              <p className="mt-1 text-base font-bold text-gray-900">
                {formatDate(customer.joinedAt || customer.createdAt)}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-900">
              Personal Information
            </h3>

            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 px-4">
              <div className="flex items-start gap-3 py-4">
                <BsPerson className="mt-1 text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {customer.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <BsEnvelope className="mt-1 text-gray-400" size={18} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="mt-1 break-all text-sm font-medium text-gray-800">
                    {customer.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <BsTelephone className="mt-1 text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {customer.phone || customer.mobileNumber || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 py-4">
                <BsGeoAlt className="mt-1 text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {customer.address || "No address available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerModel;
