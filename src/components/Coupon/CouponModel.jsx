import React from "react";

const CouponModel = ({
  isOpen,
  onClose,
  coupon,
  formatPrice,
  formatDate,
  onEdit,
}) => {
  if (!isOpen || !coupon) return null;

  const expired =
    coupon.expireDate &&
    new Date(coupon.expireDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Coupon Details</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 rounded-xl bg-violet-50 p-5 text-center">
          <h3 className="text-xl font-bold tracking-wider text-gray-900">
            {coupon.code}
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            {coupon.discountType === "PERCENTAGE"
              ? `${coupon.discountValue}% off`
              : `${formatPrice(coupon.discountValue)} off`}
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Discount Type</span>
            <span className="font-medium text-gray-900">
              {coupon.discountType}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Minimum Order</span>
            <span className="font-medium text-gray-900">
              {formatPrice(coupon.minOrderAmount)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Maximum Discount</span>
            <span className="font-medium text-gray-900">
              {coupon.maxDiscount != null
                ? formatPrice(coupon.maxDiscount)
                : "—"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Start Date</span>
            <span className="font-medium text-gray-900">
              {formatDate(coupon.startDate)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Expiry Date</span>
            <span className="font-medium text-gray-900">
              {formatDate(coupon.expireDate)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Usage</span>
            <span className="font-medium text-gray-900">
              {coupon.usedCount ?? 0} / {coupon.usageLimit ?? 0}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Status</span>
            <span
              className={`font-medium ${
                coupon.isActive && !expired ? "text-green-600" : "text-gray-500"
              }`}
            >
              {expired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(coupon)}
              className="flex-1 rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              Edit Coupon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponModel;
