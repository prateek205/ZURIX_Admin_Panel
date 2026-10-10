import React, { useEffect, useState } from "react";

import {
  BiSearch,
  BiSolidCoupon,
  BiCheckCircle,
  BiXCircle,
  BiPlus,
  BiCalendar,
} from "react-icons/bi";

import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import { useGetAllCouponsQuery } from "../../redux/Coupon";
import CouponModel from "./CouponModel";

const Coupon = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [coupons, setCoupons] = useState([]);

  const { data: getAllCoupons, isLoading, isError } = useGetAllCouponsQuery();

  useEffect(() => {
    if (!getAllCoupons) return;

    const apiCoupons = Array.isArray(getAllCoupons.data)
      ? getAllCoupons.data
      : Array.isArray(getAllCoupons.coupons)
        ? getAllCoupons.coupons
        : Array.isArray(getAllCoupons)
          ? getAllCoupons
          : [];

    setCoupons(apiCoupons);
  }, [getAllCoupons]);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    startDate: "",
    expireDate: "",
    usageLimit: "",
    isActive: true,
  });

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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

  const isExpired = (coupon) =>
    coupon.expireDate &&
    new Date(coupon.expireDate).getTime() < new Date().setHours(0, 0, 0, 0);

  // Search and status filter
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = (coupon.code || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const active = Boolean(coupon.isActive) && !isExpired(coupon);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && active) ||
      (statusFilter === "Inactive" && !active);

    return matchesSearch && matchesStatus;
  });

  // Statistics from API data
  const activeCount = coupons.filter(
    (coupon) => coupon.isActive && !isExpired(coupon),
  ).length;

  const inactiveCount = coupons.length - activeCount;

  const totalUses = coupons.reduce(
    (total, coupon) => total + Number(coupon.usedCount || 0),
    0,
  );

  const stats = [
    {
      title: "Total Coupons",
      value: getAllCoupons?.count ?? coupons.length,
      icon: BiSolidCoupon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Coupons",
      value: activeCount,
      icon: BiCheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Inactive / Expired",
      value: inactiveCount,
      icon: BiXCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Total Redemptions",
      value: totalUses,
      icon: BiCalendar,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      startDate: "",
      expireDate: "",
      usageLimit: "",
      isActive: true,
    });
  };

  const openCreateModal = () => {
    setSelectedCoupon(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);

    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "PERCENTAGE",
      discountValue: coupon.discountValue ?? "",
      minOrderAmount: coupon.minOrderAmount ?? "",
      maxDiscount: coupon.maxDiscount ?? "",
      startDate: coupon.startDate?.slice(0, 10) || "",
      expireDate: coupon.expireDate?.slice(0, 10) || "",
      usageLimit: coupon.usageLimit ?? "",
      isActive: Boolean(coupon.isActive),
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Local preview only. Connect create/update mutations to persist changes.
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      code: formData.code.trim().toUpperCase(),
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount),
      maxDiscount:
        formData.discountType === "PERCENTAGE"
          ? Number(formData.maxDiscount)
          : Number(formData.discountValue),
      usageLimit: Number(formData.usageLimit),
      usedCount: selectedCoupon?.usedCount || 0,
    };

    if (selectedCoupon) {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon._id === selectedCoupon._id
            ? { ...coupon, ...payload }
            : coupon,
        ),
      );
    } else {
      setCoupons((prev) => [
        ...prev,
        { ...payload, _id: `local-${Date.now()}` },
      ]);
    }

    setShowModal(false);
    setSelectedCoupon(null);
  };

  // Local preview only. Connect a delete mutation to persist deletion.
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    setCoupons((prev) => prev.filter((coupon) => coupon._id !== id));
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gray-50 p-8">
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="text-sm text-gray-500">Loading coupons...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
          <BiSolidCoupon size={34} className="mx-auto mb-3 text-red-400" />
          <h2 className="text-lg font-semibold text-gray-900">
            Failed to load coupons
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Check the API response and try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage discount coupons for your store.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          <BiPlus size={20} />
          Create Coupon
        </button>
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

      {/* Coupon Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Coupons</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage discount codes and redemption limits.
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search coupon code..."
                className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-gray-400 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400"
            >
              <option value="All">All Coupons</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive / Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Coupon Code</th>
                <th className="px-5 py-4 font-semibold">Discount</th>
                <th className="px-5 py-4 font-semibold">Min. Order</th>
                <th className="px-5 py-4 font-semibold">Validity</th>
                <th className="px-5 py-4 font-semibold">Usage</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map((coupon) => {
                const expired = isExpired(coupon);
                const usedCount = Number(coupon.usedCount || 0);
                const usageLimit = Number(coupon.usageLimit || 0);

                return (
                  <tr key={coupon._id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <BiSolidCoupon size={21} />
                        </div>
                        <div>
                          <p className="font-bold tracking-wide text-gray-900">
                            {coupon.code}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {coupon.discountType === "PERCENTAGE"
                              ? "Percentage discount"
                              : "Fixed discount"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue)}

                      {coupon.discountType === "PERCENTAGE" && (
                        <p className="mt-1 text-xs font-normal text-gray-500">
                          Max {formatPrice(coupon.maxDiscount)}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {formatPrice(coupon.minOrderAmount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      <p>{formatDate(coupon.startDate)}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        to {formatDate(coupon.expireDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {usedCount} / {usageLimit}
                      </p>
                      <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{
                            width: `${
                              usageLimit > 0
                                ? Math.min((usedCount / usageLimit) * 100, 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          coupon.isActive && !expired
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {expired
                          ? "Expired"
                          : coupon.isActive
                            ? "Active"
                            : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="View coupon"
                          onClick={() => setSelectedCoupon(coupon)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <BsEye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit coupon"
                          onClick={() => openEditModal(coupon)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <BsPencilSquare size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete coupon"
                          onClick={() => handleDelete(coupon._id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <BsTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCoupons.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    <BiSolidCoupon
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">
                      No coupons found
                    </p>
                    <p className="mt-1 text-sm">
                      Try another search or create a new coupon.
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
            {filteredCoupons.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-800">
            {getAllCoupons?.count ?? coupons.length}
          </span>{" "}
          coupons
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure discount and coupon validity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Coupon Code *
                  </label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. WELCOME10"
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm uppercase outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-500"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="1"
                    max={
                      formData.discountType === "PERCENTAGE" ? 100 : undefined
                    }
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Order Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleChange}
                    min="0"
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                {formData.discountType === "PERCENTAGE" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Maximum Discount (₹) *
                    </label>
                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleChange}
                      min="1"
                      required
                      className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Usage Limit *
                  </label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    min="1"
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleChange}
                    min={formData.startDate || undefined}
                    required
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-500"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-black"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-800">
                    Activate coupon
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Allow customers to use this coupon when valid.
                  </span>
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  {selectedCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Coupon Modal */}
      {selectedCoupon && !showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCoupon(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Coupon Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCoupon(null)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-violet-50 p-5 text-center">
              <BiSolidCoupon
                size={32}
                className="mx-auto mb-2 text-violet-600"
              />
              <h3 className="text-xl font-bold tracking-wider text-gray-900">
                {selectedCoupon.code}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {selectedCoupon.discountType === "PERCENTAGE"
                  ? `${selectedCoupon.discountValue}% off`
                  : `${formatPrice(selectedCoupon.discountValue)} off`}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Minimum Order</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(selectedCoupon.minOrderAmount)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Maximum Discount</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(selectedCoupon.maxDiscount)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium text-gray-900">
                  {formatDate(selectedCoupon.startDate)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Expiry Date</span>
                <span className="font-medium text-gray-900">
                  {formatDate(selectedCoupon.expireDate)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium text-gray-900">
                  {selectedCoupon.usedCount ?? 0} /{" "}
                  {selectedCoupon.usageLimit ?? 0}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    selectedCoupon.isActive && !isExpired(selectedCoupon)
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {isExpired(selectedCoupon)
                    ? "Expired"
                    : selectedCoupon.isActive
                      ? "Active"
                      : "Inactive"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCoupon(null)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <CouponModel
        isOpen={Boolean(selectedCoupon) && !showModal}
        coupon={selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
        onEdit={(coupon) => openEditModal(coupon)}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />
    </section>
  );
};

export default Coupon;
