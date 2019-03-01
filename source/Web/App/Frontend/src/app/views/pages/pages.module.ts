import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DesignGiftComponent } from './design-gift/design-gift.component';
import { HouseSpecialsComponent } from './house-specials/house-specials.component';
import { BoardroomComponent } from './boardroom/boardroom.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule
    ],
    declarations: [DesignGiftComponent, HouseSpecialsComponent, BoardroomComponent, CartComponent, ContactComponent]
})
export class PagesModule {
}
