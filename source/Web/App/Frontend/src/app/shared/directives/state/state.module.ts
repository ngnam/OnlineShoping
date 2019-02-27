import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ClickOutsideDirective } from "./click-outside.directive";

@NgModule({
    declarations: [
        ClickOutsideDirective
    ],
    exports: [
        ClickOutsideDirective
    ],
    imports: [
        CommonModule
    ]
})
export class StateModule { }
