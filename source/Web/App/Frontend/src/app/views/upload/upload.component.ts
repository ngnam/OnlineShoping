import { Component } from "@angular/core";
import { FileService } from "../../services/file.service";

@Component({ selector: "app-upload", templateUrl: "./upload.component.html" })
export class UploadComponent {
    progress: number = 0;

    constructor(private fileService: FileService) { }

    upload(files: FileList) {
        this.fileService.upload(files).subscribe((progress: number) => {
            this.progress = progress;
        });
    }
}
