import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({ selector: "app-form", templateUrl: "./form.component.html" })
export class FormComponent {
    disabled = false;

    form: FormGroup = this.formBuilder.group({
        child: this.formBuilder.group({ string: [] }),
        number: [],
        string: []
    });

    model = {
        child: { string: "" },
        number: 0,
        string: ""
    };

    constructor(private readonly formBuilder: FormBuilder) { }

    submit() {
        alert("submit");
    }
}
