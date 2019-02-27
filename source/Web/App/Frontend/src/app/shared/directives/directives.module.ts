import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidationModule } from "./validation/validation.module";
import { StateModule } from "./state/state.module";

@NgModule({
    exports: [
        ValidationModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidationModule,
        StateModule
    ]
})
export class DirectivesModule { }
