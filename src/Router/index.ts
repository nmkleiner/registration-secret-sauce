import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { ExcelRoutes } from '../../../excel-registration-front/src/Modules/Excel/Router/routes';
import { OnwardRoutes } from '../../../excel-registration-front/src/Modules/Onward/Router/routes';
import { useProduct } from '../../../excel-registration-front/src/Core/Composables/program/useProduct';
import { TaglitProduct } from '../../../excel-registration-front/src/Core/Infrastructure/API/taglit-product.enum';

let routes: Array<RouteRecordRaw>;

if (window.location.host.includes('excel')) {
  useProduct().setProduct(TaglitProduct.EXCEL);
  routes = ExcelRoutes;
} else if (window.location.host.includes('onward')) {
  useProduct().setProduct(TaglitProduct.ONWARD);
  routes = OnwardRoutes;
} else {
  useProduct().setProduct(TaglitProduct.EXCEL);
  routes = ExcelRoutes;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// @ts-ignore
export default router;
