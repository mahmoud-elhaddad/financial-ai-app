import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';

@Component({
  selector: 'app-breadcrumbs',
  standalone: false,
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
 @Input() breadcrumbs: IBreadcrumbItem[] | undefined;
  @Input() size: SizeEnum | undefined;
  @Input() divider: string | undefined;
  @Output() onClickEvent=new EventEmitter<IBreadcrumbItem>();

  getBreadcrumbSize() {
    return {
      'breadcrumb-medium': this.size === SizeEnum.Medium,
      'breadcrumb-small': this.size === SizeEnum.Small,
      'breadcrumb-large': this.size === SizeEnum.Large,
    };
  }

  onBreadcrumbClick(breadcrumb: IBreadcrumbItem): void {
    if (!breadcrumb.disabled) {
      this.onClickEvent.emit(breadcrumb);
    }
  }
}

