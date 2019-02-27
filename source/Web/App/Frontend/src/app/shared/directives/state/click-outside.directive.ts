import {
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Injectable,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    SimpleChanges,
    NgZone,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable()
@Directive({ selector: "[clickOutside]" })
export class ClickOutsideDirective implements OnInit, OnChanges, OnDestroy {

    @Input() clickOutsideEnabled: boolean = true;

    @Input() attachOutsideOnClick: boolean = false;
    @Input() delayClickOutsideInit: boolean = false;
    @Input() emitOnBlur: boolean = false;

    @Input() exclude: string = "";
    @Input() excludeBeforeClick: boolean = false;

    @Input() clickOutsideEvents: string = "";

    @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

    private nodesExcluded: HTMLElement[] = [];
    private events: string[] = ["click"];

    constructor(
        private el: ElementRef,
        private ngZone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object) {
        this._initOnClickBody = this._initOnClickBody.bind(this);
        this._onClickBody = this._onClickBody.bind(this);
        this._onWindowBlur = this._onWindowBlur.bind(this);
    }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) { return; }

        this._init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isPlatformBrowser(this.platformId)) { return; }

        if (changes["attachOutsideOnClick"] || changes["exclude"] || changes["emitOnBlur"]) {
            this._init();
        }
    }

    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) { return; }

        this._removeClickOutsideListener();
        this._removeAttachOutsideOnClickListener();
        this._removeWindowBlurListener();
    }

    private _init() {
        if (this.clickOutsideEvents !== "") {
            this.events = this.clickOutsideEvents.split(",").map(e => e.trim());
        }

        this._excludeCheck();

        if (this.attachOutsideOnClick) {
            this._initAttachOutsideOnClickListener();
        } else {
            this._initOnClickBody();
        }

        if (this.emitOnBlur) {
            this._initWindowBlurListener();
        }
    }

    private _initOnClickBody() {
        if (this.delayClickOutsideInit) {
            setTimeout(this._initClickOutsideListener.bind(this));
        } else {
            this._initClickOutsideListener();
        }
    }

    private _excludeCheck() {
        if (this.exclude) {
            try {
                const nodes = Array.from(document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
                if (nodes) {
                    this.nodesExcluded = nodes;
                }
            } catch (err) {
                console.error("[ng-click-outside] Check your exclude selector syntax.", err);
            }
        }
    }

    private _onClickBody(ev: Event) {
        if (!this.clickOutsideEnabled) { return; }

        if (this.excludeBeforeClick) {
            this._excludeCheck();
        }

        if (!this.el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
            this._emit(ev);

            if (this.attachOutsideOnClick) {
                this._removeClickOutsideListener();
            }
        }
    }

    /**
     * Resolves problem with outside click on iframe
     * @see https://github.com/arkon/ng-click-outside/issues/32
     */
    private _onWindowBlur(ev: Event) {
        setTimeout(() => {
            if (!document.hidden) {
                this._emit(ev);
            }
        });
    }

    private _emit(ev: Event) {
        if (!this.clickOutsideEnabled) { return; }

        this.ngZone.run(() => this.clickOutside.emit(ev));
    }

    private _shouldExclude(target: any): boolean {
        for (const excludedNode of this.nodesExcluded) {
            if (excludedNode.contains(target)) {
                return true;
            }
        }

        return false;
    }

    private _initClickOutsideListener() {
        this.ngZone.runOutsideAngular(() => {
            this.events.forEach(e => document.body.addEventListener(e, this._onClickBody));
        });
    }

    private _removeClickOutsideListener() {
        this.ngZone.runOutsideAngular(() => {
            this.events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
        });
    }

    private _initAttachOutsideOnClickListener() {
        this.ngZone.runOutsideAngular(() => {
            this.events.forEach(e => this.el.nativeElement.addEventListener(e, this._initOnClickBody));
        });
    }

    private _removeAttachOutsideOnClickListener() {
        this.ngZone.runOutsideAngular(() => {
            this.events.forEach(e => this.el.nativeElement.removeEventListener(e, this._initOnClickBody));
        });
    }

    private _initWindowBlurListener() {
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener("blur", this._onWindowBlur);
        });
    }

    private _removeWindowBlurListener() {
        this.ngZone.runOutsideAngular(() => {
            window.removeEventListener("blur", this._onWindowBlur);
        });
    }

}
