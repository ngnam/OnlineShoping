import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from "./contact/contact.component";
import { BoardroomComponent } from "./boardroom/boardroom.component";
import { CartComponent } from "./cart/cart.component";
import { HouseSpecialsComponent } from "./house-specials/house-specials.component";
import { DesignGiftComponent } from "./design-gift/design-gift.component";

const routes: Routes = [
    {path: "", redirectTo: "/contact", pathMatch: "full"},
    {path: "contact", component: ContactComponent},
    {path: "boardroom", component: BoardroomComponent},
    {path: "cart", component: CartComponent},
    {path: "house-specials", component: HouseSpecialsComponent},
    {path: "mixology-bar", component: DesignGiftComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
