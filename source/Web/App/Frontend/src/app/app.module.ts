import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { SharedModule } from "./shared/shared.module";
import { LayoutModule } from "./shared/layout/layout.module";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        LayoutModule,
        SharedModule,
    ]
})
export class AppModule { }
