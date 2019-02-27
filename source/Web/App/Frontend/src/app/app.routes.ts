import { Routes } from "@angular/router";
import { AuthenticationGuard } from "./shared/guards/authentication.guard";
import { LayoutMainComponent } from "./shared/layout/layout-main.component";
import { LayoutComponent } from "./shared/layout/layout.component";

export const routes: Routes = [
    {
        children: [
            { path: "", redirectTo: "/home", pathMatch: "full" },
            { path: "home", loadChildren: "./views/home/home.module#HomeModule" },
            // new feature
            { path: "login", loadChildren: "./views/login/login.module#LoginModule" },
            { path: "signup", loadChildren: "./views/signup/signup.module#SignupModule" },
            { path: "about", loadChildren: "./views/about/about.module#AboutModule" },
            { path: "faq", loadChildren: "./views/faq/faq.module#FaqModule" },
            { path: "cart", loadChildren: "./views/cart/cart.module#CartModule" },
            // end new feature
        ],
        component: LayoutComponent,
        path: ""
    },
    {
        canActivate: [AuthenticationGuard],
        children: [
            { path: "dashboard", loadChildren: "./views/admin/dashboard/dashboard.module#DashboardModule" },
            { path: "product", loadChildren: "./views/admin/product/product.module#ProductModule" },
            { path: "config", loadChildren: "./views/admin/config/config.module#ConfigModule" },
            { path: "order", loadChildren: "./views/admin/order/order.module#OrderModule" },
            { path: "user", loadChildren: "./views/admin/user/user.module#UserModule" },
            { path: "", redirectTo: "/admin/product", pathMatch: "full" },
        ],
        component: LayoutMainComponent,
        path: "admin"
    },

    { path: "**", redirectTo: "" }
];
