import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SignupComponent } from './signup.component';
import { ChangePassComponent } from './change-pass/change-pass.component';

@NgModule({
    declarations: [SignupComponent, ChangePassComponent],
    imports: [
        CommonModule,
        SignupRoutingModule,
        SharedModule
    ]
})
export class SignupModule { }
