import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2
} from "@angular/core";

@Component({ selector: "app-layout", templateUrl: "./layout.component.html" })
export class LayoutComponent implements OnInit, OnDestroy {
    constructor(private render: Renderer2) { }
    ngOnInit(): void {
        this.render.setAttribute(document.getElementsByTagName("body").item(0), "class", "template-index no-touch page-loaded");
    }
    ngOnDestroy(): void {
        this.render.removeAttribute(document.getElementsByTagName("body").item(0), "class");
    }
}
