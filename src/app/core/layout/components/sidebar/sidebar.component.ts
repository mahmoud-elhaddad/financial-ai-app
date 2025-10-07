import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IUser } from 'src/app/core/interfaces/IUser';
import { LoginService } from 'src/app/core/services/login/login.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
    standalone: false
})
export class SidebarComponent {
    @Input() moveSideMenu: boolean = false;
    @Output() changeView = new EventEmitter<boolean>();

    showSideMenu: boolean = false;
    closeResult = '';
    userData: IUser;
    @ViewChild('logOut') logOutTpl!: TemplateRef<any>;
    constructor(
        public route: ActivatedRoute,
        public loginService: LoginService,
        private _translateService: TranslateService,
        private router: Router,
        private modalService: NgbModal

    ) {
        this.userData = JSON.parse(localStorage.getItem("user_data") || '{}');
    }
    ngOnInit(): void {



    }

    toggleSideMenu(state: boolean) {
        this.moveSideMenu = state;  // Update the state from header

    }



    openLogOut() {
        this.modalService.open(this.logOutTpl, { centered: true, backdrop: 'static' });
    }
    logout() {
        this.loginService.logout();
    }
    collapsSideMenu() {
        this.showSideMenu = !this.showSideMenu; // Toggle before emitting
        this.changeView.emit(this.showSideMenu);
    }

}
