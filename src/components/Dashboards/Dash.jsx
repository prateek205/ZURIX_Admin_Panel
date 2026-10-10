import { Link, useNavigate } from "react-router-dom";
import { useAdminProfileQuery } from "../../redux/AdminApi";

const Dash = () => {
  const { data: adminProfile, isLoading, isError } = useAdminProfileQuery();

  console.log("ADMIN_PROFILE:", adminProfile);

  const navigate = useNavigate()

  const cards = [
    {
      title: "Products",
      description: "Add, edit, and manage your product catalog.",
      path: "/products",
      number: "01",
    },
    {
      title: "Categories",
      description: "Organize products into store categories.",
      path: "/categories",
      number: "02",
    },
    {
      title: "Orders",
      description: "Review customer orders and their status.",
      path: "/orders",
      number: "03",
    },
    {
      title: "Customers",
      description: "View and manage your customer information.",
      path: "/customers",
      number: "04",
    },
    {
      title: "Coupons",
      description: "Manage discount codes and promotions.",
      path: "/coupons",
      number: "05",
    },
    {
      title: "Inventory",
      description: "Keep track of your available stock.",
      path: "/inventory",
      number: "06",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8f8f6] p-5 sm:p-8 lg:p-10 font-zurixFont">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black">
            Dashboard
          </h1>

          <p className="mt-2 text-2xl text-gray-500">
            Welcome back 👋{adminProfile?.data?.role}
          </p>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-black p-7 sm:p-10 text-white mb-8">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            Store Management
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl font-medium leading-snug">
            Everything your store needs,
            <br className="hidden sm:block" /> in one place.
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Manage products, categories, orders, customers, and coupons through
            your ZURIX admin workspace.
          </p>
        </div>

        <div className="absolute -right-10 -bottom-24 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80" />
        <div className="absolute -right-2 -bottom-16 h-48 w-48 rounded-full border border-white/10 sm:h-64 sm:w-64" />

        <div className="absolute right-8 top-8 hidden sm:block">
          <span className="text-4xl font-semibold tracking-[0.2em] text-white/10">
            ZURIX
          </span>
        </div>
      </div>

      {/* Management Cards */}
      <div className="mb-5">
        <h2 className="text-lg font-medium text-gray-900">Store Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Quick access to your administration modules.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <button
            key={item.number}
            type="button"
            onClick={() => navigate(item.path)}
            className="group flex min-h-44 flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 text-left transition duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs tracking-widest text-gray-400">
                  {item.number}
                </p>
                <h3 className="mt-3 text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition group-hover:border-black group-hover:bg-black group-hover:text-white">
                ↗
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-500">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 border-t border-gray-200 pt-5">
        <p className="text-xs text-gray-400">
          ZURIX Admin Panel · Store Management
        </p>
      </div>
    </section>
  );
};

export default Dash;
