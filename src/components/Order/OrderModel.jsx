import React from "react";
import { BsX, BsBoxSeam, BsPerson, BsGeoAlt } from "react-icons/bs";

const OrderViewModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

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

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    const value = String(status || "Pending")
      .toLowerCase()
      .replace(/_/g, " ");

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

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

  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="order-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              Order Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Order ID: {order._id || order.orderId || "—"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <BsX size={25} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-5 sm:p-7">
          {/* Status and date */}
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                  order.orderStatus,
                )}`}
              >
                {formatStatus(order.orderStatus)}
              </span>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Customer and shipping address */}
          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BsPerson className="text-gray-600" size={19} />
                <h3 className="font-semibold text-gray-900">
                  Customer Information
                </h3>
              </div>

              <p className="text-sm font-medium text-gray-800">
                {address.fullName || "Customer"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Mobile: {address.mobileNumber || "—"}
              </p>
              <p className="mt-2 break-all text-sm text-gray-500">
                User ID:{" "}
                {typeof order.user === "string"
                  ? order.user
                  : order.user?._id || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="mb-4 flex items-center gap-2">
                <BsGeoAlt className="text-gray-600" size={19} />
                <h3 className="font-semibold text-gray-900">
                  Shipping Address
                </h3>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                {address.address || "—"}
                <br />
                {[address.city, address.state, address.pincode]
                  .filter(Boolean)
                  .join(", ")}
                <br />
                {address.country || ""}
              </p>
            </div>
          </div>

          {/* Order items */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4">
              <BsBoxSeam size={19} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Order Items ({items.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[450px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Product ID</th>
                    <th className="px-5 py-3 font-semibold">Quantity</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {typeof item.productId === "object"
                          ? item.productId?._id || "—"
                          : item.productId || "—"}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {item.quantity ?? 0}
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-5 py-6 text-center text-gray-500"
                      >
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-4 font-semibold text-gray-900">
                Payment Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-800">
                    {order.paymentMethod || "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-medium text-gray-800">
                    {formatStatus(order.paymentStatus)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-500">Razorpay Order ID</p>
                  <p className="mt-1 break-all text-xs text-gray-700">
                    {order.razorpayOrderId || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Razorpay Payment ID</p>
                  <p className="mt-1 break-all text-xs text-gray-700">
                    {order.razorpayPaymentId || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="mb-4 font-semibold text-gray-900">
                Price Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Shipping Charges</span>
                  <span className="text-gray-800">
                    {formatPrice(order.shippingCharges)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Coupon Discount</span>
                  <span className="text-green-700">
                    -{formatPrice(order.couponDiscount)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
