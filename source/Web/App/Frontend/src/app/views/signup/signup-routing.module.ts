import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { ChangePassComponent } from './change-pass/change-pass.component';

const routes: Routes = [
    { path: "", component: SignupComponent },
    { path: "change-pass", component: ChangePassComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignupRoutingModule { }
