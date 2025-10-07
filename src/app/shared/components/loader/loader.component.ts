import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader/loader.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-loader',
    standalone:false,
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    loading: boolean | undefined;

    constructor(private loaderService: LoaderService) {
        this.loaderService.isLoading.subscribe((res) => this.loading = res)
    }

    ngOnInit(): void {
    }

}
