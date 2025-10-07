import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ITableInterface } from '../../../core/interfaces/ITableInterface';
import { RequestStatusEnum, } from '../../../core/enums/request-status-enum';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-shared-table',
    standalone: false,
    templateUrl: './shared-table.component.html',
    styleUrl: './shared-table.component.scss'
})
export class SharedTableComponent implements OnInit {
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @Input() columnConfigs: ITableInterface[] = [];
    @Input() showCheckboxColumn: boolean = true; // New input to control checkbox visibility
    @Output() viewRowDetailsButton: EventEmitter<any> = new EventEmitter();
    @Output() actionClicked: EventEmitter<{ row: any; action: string }> = new EventEmitter();
    @Output() openResourceCliked: EventEmitter<any> = new EventEmitter();
    @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter(); // New output for selection changes
    
    public page = 1;
    @Input() collectionSize: number = 0;
    @Input() pageSize: number = 5;
    @Input() maxSize: number = 5;
    @Output() pageChaged = new EventEmitter<any>();
    @Output() pageChanged = new EventEmitter<number>();
    @Input() noDataMessage: string = "No data available.";
    pageNumber: number = 1;
    @Input() showPagination: boolean = true;
    @Input() isColumnSelectable: boolean = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    // Selection model for checkboxes
    selection = new SelectionModel<any>(true, []);
    
    RequestStatusEnum = RequestStatusEnum;
    
    // Updated displayedColumns getter
    get displayedColumns(): string[] {
        const columnKeys = this.columnConfigs.map(col => col.key);
        return this.isColumnSelectable
          ? ['select', ...columnKeys]
          : columnKeys;
      }
    
    ngOnInit(): void {
        // Selection change listener to emit selected rows
        this.selection.changed.subscribe(() => {
            this.selectionChanged.emit(this.selection.selected);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
    }

    /** Get all selected rows */
    getSelectedRows(): any[] {
        return this.selection.selected;
    }

    /** Clear all selections */
    clearSelection(): void {
        this.selection.clear();
    }

    /** Check if any rows are selected */
    hasSelection(): boolean {
        return this.selection.hasValue();
    }

    handleLinkClick(row: any): void {
        this.viewRowDetailsButton.emit(row);
    }
    
    openResource(row: any): void {
        this.openResourceCliked.emit(row);
    }
    
    handleActionClick(row: any, actionType: string): void {
        this.actionClicked.emit({ row, action: actionType });
    }

    onPageChange(page: number): void {
        this.pageNumber = page;
        this.pageChanged.emit(page);
    }
}