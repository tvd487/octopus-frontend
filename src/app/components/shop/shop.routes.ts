import { Routes } from "@angular/router";
import { AuthGuard } from "../../core/guard/auth.guard";
import { CheckoutGuard } from "../../core/guard/checkout.guard";
import { BrandResolver } from "../../shared/resolver/brand.resolver";
import { ProductResolver } from "../../shared/resolver/product.resolver";
import { BrandComponent } from "./brand/brand.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { CollectionComponent } from "./collection/collection.component";
import { CompareComponent } from "./compare/compare.component";
import { ProductComponent } from "./product/product.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { CategoryComponent } from "./category/category.component";
import { CategoryResolver } from "../../shared/resolver/category.resolver";
import { OrderTrackingComponent } from "./order-tracking/order-tracking.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";

export const shop: Routes = [
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: "collections",
    component: CollectionComponent
  },
  {
    path: 'product/:slug',
    component: ProductComponent,
    resolve: {
      data: ProductResolver
    }
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'compare',
    component: CompareComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard]
  },
  {
    path: 'order/tracking',
    component: OrderTrackingComponent
  },
  {
    path: 'order/details',
    component: OrderDetailsComponent
  },
  {
    path: 'brand/:slug',
    component: BrandComponent,
    resolve: {
      data: BrandResolver
    }
  },
  {
    path: 'category/:slug',
    component: CategoryComponent,
    resolve: {
      data: CategoryResolver
    }
  },
]
