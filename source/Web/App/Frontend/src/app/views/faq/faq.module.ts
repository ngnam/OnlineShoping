import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';

@NgModule({
    declarations: [FaqComponent],
    imports: [
        CommonModule,
        FaqRoutingModule,
        SharedModule
    ]
})
export class FaqModule { }
