import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/AuthService";
import { useCartsStore } from "@/store/CartsService";
import { useOrdersStore } from "@/store/OrdersService";

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
  history: createWebHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "Not Found",
      component: () => import("@/views/Errors/404.vue"),
    },
    {
      path: "/",
      name: "CustomerView",
      component: () => import("@/layouts/CustomerHeader.vue"),
      children: [
        {
          path: "",
          name: "HomeView",
          component: () => import("@/views/Customer/Home/HomeView.vue"),
          children: [
            {
              path: "category/:id",
              name: "ListingView",
              component: () => import("@/views/Customer/Home/ListingView.vue"),
              children: [
                {
                  path: "product/:productid",
                  name: "ProductView",
                  component: () =>
                    import("@/views/Customer/Home/ProductView.vue"),
                },
              ],
            },
          ],
        },
        {
          path: "cart",
          name: "CartView",
          component: () => import("@/views/Customer/Cart/CartView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "order",
          name: "OrdersView",
          component: () => import("@/views/Customer/Order/OrdersView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "order/:id",
          name: "OrderView",
          component: () => import("@/views/Customer/Order/OrderView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "profile",
          name: "ProfileView",
          component: () => import("@/views/Customer/Profile/ProfileView.vue"),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: "/checkout",
      name: "CheckoutView",
      component: () => import("@/layouts/CheckoutHeader.vue"),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "details",
          name: "DetailsView",
          component: () =>
            import("@/views/Customer/Checkout/CheckoutDetailsView.vue"),
          meta: {
            requiresCartItems: true,
          },
        },
        {
          path: "payments",
          name: "PaymentsView",
          component: () =>
            import("@/views/Customer/Checkout/CheckoutPaymentView.vue"),
          meta: {
            requiresCartItems: true,
            requiresDetails: true,
          },
        },
        {
          path: "confirmation",
          name: "ConfirmationView",
          component: () =>
            import("@/views/Customer/Checkout/CheckoutConfirmationView.vue"),
          meta: {
            //
          },
        },
      ],
    },
    {
      path: "/admin",
      name: "AdministratorView",
      component: () => import("@/layouts/AdminHeader.vue"),
      children: [
        {
          path: "",
          name: "AdminDashboard",
          component: () =>
            import("@/views/Administrator/Dashboard/DashboardView.vue"),
        },
        {
          path: "users",
          name: "AdminUsers",
          component: () => import("@/views/Administrator/Users/UsersView.vue"),
        },
        {
          path: "products",
          name: "AdminProducts",
          component: () =>
            import("@/views/Administrator/Products/ProductsView.vue"),
        },
        {
          path: "categories",
          name: "AdminCategories",
          component: () =>
            import("@/views/Administrator/Categories/CategoriesView.vue"),
        },
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: "/auth",
      name: "Authentication",
      component: () => import("@/layouts/TopHeader.vue"),
      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("@/views/Auth/LoginView.vue"),
        },
        {
          path: "Register",
          name: "Register",
          component: () => import("@/views/Auth/RegisterView.vue"),
        },
      ],
      meta: {
        requiresSignout: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/") {
    next({
      path: "/category/1",
      replace: true,
    });

    return;
  }

  const authStore = useAuthStore();
  const cartsStore = useCartsStore();
  const ordersStore = useOrdersStore();

  if (to.path !== "/auth/login" && to.path !== "/auth/register") {
    try {
      await authStore.getUser();
    } catch (error) {}
  }


  const metaHandlers = {
    requiresAuth: async () => {
      if (authStore.status === false) {
        next({
          path: "/auth/login",
          replace: true,
        });
        return;
      }
    },
    requiresSignout: async () => {
      if (authStore.status) {
        next({
          path: "/",
          replace: true,
        });
        return;
      }
    },
    requiresAdmin: async () => {
      try {
        await authStore.getUser();
      } catch (error) {}
      if (authStore.user.role.id !== 1) {
        next({
          path: "/:pathMatch(.*)*",
          replace: true,
        });
        return;
      }
    },
    requiresCartItems: async () => {
      try {
        await cartsStore.getCart();
      } catch (error) {}
      if (cartsStore.cart.cartItemCount <= 0) {
        next({
          path: "/cart",
          replace: true,
        });
        return;
      }
    },
    requiresDetails: async () => {
      const isNull =
        ordersStore.firstName === null ||
        ordersStore.lastName === null ||
        ordersStore.address === null ||
        ordersStore.postalCode === null ||
        ordersStore.city === null;
      if (isNull) {
        next({
          path: "/checkout/details",
          replace: true,
        });
        return;
      }
    },
  };

  const metaKeys = Object.keys(to.meta);
  for (const key of metaKeys) {
    if (metaHandlers[key]) {
      await metaHandlers[key]();
    }
  }

  next();

  // if (to.meta.requiresAuth && !authStore.status) {
  //   next({
  //     path: "/auth/login",
  //     replace: true,
  //   });
  // } else if (to.meta.requiresSignout && authStore.status) {
  //   next({
  //     path: "/",
  //     replace: true,
  //   });
  // } else if (to.meta.requiresAdmin && authStore?.user?.role.id != 1) {
  //   next({
  //     path: "/:pathMatch(.*)*",
  //     replace: true,
  //   });
  // } else if (to.meta.requiresCartItems && cartsStore.cart.cartItemCount <= 0) {
  //   next({
  //     path: "/cart",
  //     replace: true,
  //   });
  // } else if (to.meta.requiresDetails && isNull) {
  //   next({
  //     path: "/checkout/details",
  //     replace: true,
  //   });
  // } else {
  //   next();
  // }
});

export default router;
