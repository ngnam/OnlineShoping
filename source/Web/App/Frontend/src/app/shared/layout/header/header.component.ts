import { Component, HostListener, Renderer2 } from "@angular/core";

@Component({ selector: "app-header", templateUrl: "./header.component.html", styleUrls: ["./header.component.scss"] })
export class HeaderComponent {
    isMobile = false;
    isNavMobile = false;
    isVisibled = false;
    constructor(private render: Renderer2) { }

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
        if (event.target.innerWidth <= 763) {
            this.isMobile = true;
            this.render.addClass(document.getElementsByTagName("body").item(0), "has-mobile-header");
        } else {
            this.isMobile = false;
            this.render.removeClass(document.getElementsByTagName("body").item(0), "has-mobile-header");
        }
    }

    showNavMenu(event: any) {
        this.isVisibled = !this.isVisibled;
        event.preventDefault();
    }

    showNavMobile(event: any) {
        this.isNavMobile = !this.isNavMobile;
        if (this.isNavMobile) {
            this.render.addClass(document.getElementsByTagName("body").item(0), "opened-drawer");
        } else {
            this.render.removeClass(document.getElementsByTagName("body").item(0), "opened-drawer");
        }
        event.preventDefault();
    }

    mouseenter() {
        this.isVisibled = true;
    }

    mouseleave() {
        this.isVisibled = false;
    }
}
