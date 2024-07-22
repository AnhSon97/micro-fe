import { Component, EventEmitter, Injector, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component';
import { SelectionType } from '@swimlane/ngx-datatable';
import { ActionType } from '../../defines';
import utils from '../../utils';
import _ from 'lodash';

@Component({
  selector: 'base-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends BaseComponent implements OnInit {

  allComplete: boolean;
  listColumn;
  messages = {
    emptyMessage: `
      <div class="align-items-center d-flex justify-content-center">
        <img src="assets/images/No data.png">
      </div>
    `
  }
  pageNumber: number = 1;
  SelectionType = SelectionType;
  listSelected = [];
  reloadTable = true;
  @ViewChild('pager') pager: any;
  @Input() action: any = {
    update: true,
    delete: true,
    view: true
  };
  @Input() rows: Array<any> = [];
  @Input('setListColumn') set setListColumn(value: any) {
    if (!value) {
      return;
    }
    if (localStorage.getItem(this.configTable?.name) != 'undefined' && localStorage.getItem(this.configTable?.name)) {
      const listLocal = localStorage.getItem(this.configTable?.name);
      const data = JSON.parse(listLocal || '[]');
      this.listColumn = value.map((item, index) => {
        item.activated = data[index]?.activated;
        return item;
      })
      return;
    }
    this.listColumn = value;
  }
  @Input() configTable: any = {
    total: 50,
    name: 'table-test',
    pageSize: 50,
    height: '550px'
  }
  @Input() keySelect: any = 'id';
  @Input() showingPage: boolean = true;
  @Input() showingExport: boolean = true;
  @Input() showingSelectColumn: boolean = true;
  @Input() showSelection: boolean = true;
  @Input() showMessage: boolean = true;
  @Input() isTranslate: boolean = false;
  @Output() pageEvent = new EventEmitter();
  @Output() actionEvent = new EventEmitter();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (!this.showMessage) {
      this.messages = {
        emptyMessage: ``
      }
    }
  }


  get ShowColumn() {
    return this.listColumn.filter(item => item.activated && item.type);
  }

  someComplete() {
    if (!this.rows?.length) {
      return;
    }
    return this.rows.filter(item => item.isSelected).length > 0 && !this.allComplete;
  }

  setAll(completed) {
    if (!this.rows?.length) {
      return;
    }
    this.allComplete = completed;
    if (completed) {
      this.rows.forEach(item => {
        item.isSelected = true;
        this.listSelected.push(item);
      });
    } else {
      this.rows.forEach(item => {
        item.isSelected = false;
        this.listSelected = this.listSelected.filter(i => i[this.keySelect] != item[this.keySelect]);
      });
    }
    this.listSelected = _.uniqBy(this.listSelected, (obj: any) => obj[this.keySelect]);
    this.allComplete = this.rows.every(i => i.isSelected);
  }

  handlerAction(row, type) {
    this.actionEvent.emit({
      type: type,
      data: row
    });
  }

  handlePageEvent(ev) {
    this.pageEvent.emit(ev);
    this.pageNumber = ev.page;
  }

  setPage(pageNumber) {
    this.pager?.selectPage?.(pageNumber);
  }

  selectActiveColumn(event) {
    event.stopPropagation();
    setTimeout(() => {
      const mapData = this.listColumn?.map(item => {
        return {
          name: item.name,
          activated: item.activated
        }
      });
      this.actionEvent.emit({
        type: ActionType.SELECT_COLUMN,
        columnSelected: mapData
      });
      localStorage.setItem(this.configTable?.name, JSON.stringify(mapData));
    }, 300);
  }

  activate(ev) {
    if (ev.type == 'dblclick') {
      if (ev?.row?.roleBaseOrigin == "workspace" || ev?.row?.roleBaseOrigin == "") {
        return;
      }
      this.actionEvent.emit({
        type: this.actionType.VIEW,
        data: ev.row
      });
    }
  }

  sortConfig(column, sort) {
    column.sort = !column.sort;
    if (column.sortApi) {
      this.actionEvent.emit({
        type: ActionType.SORT_API,
        column: column
      });
      return;
    }
    sort();
  }

  sortExtend(column) {
    this.actionEvent.emit({
      type: ActionType.SORT_EXTEND,
      column: column
    });
  }

  checkSort(column) {
    return column.sortable == null || column.sortable == undefined ? true : column.sortable;
  }

  toogle(event, row) {
    utils.checkboxToggle(event, row);
    this.select(row)
  }

  toogleAll(event, allRowsSelected, callback) {
    if (event.keyCode === 13) {
      this.setAll(!allRowsSelected)
    }
    utils.checkboxToggleAll(event, allRowsSelected, [callback])
  }

  select(item) {
    if (item?.isSelected) {
      this.listSelected.push(item);
    } else {
      this.listSelected = this.listSelected.filter(i => i[this.keySelect] != item[this.keySelect]);
    }
    this.listSelected = _.uniqBy(this.listSelected, (obj: any) => obj[this.keySelect]);
    this.allComplete = this.rows.every(i => i.isSelected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.rows?.currentValue?.length) {
      this.rows.forEach(row => {
        const select = this.listSelected.find(i => i[this.keySelect] == row[this.keySelect]);
        if (select) {
          row.isSelected = true;
        }
      });
      this.allComplete = this.rows.every(i => i.isSelected);
      return
    }
    this.reloadTable = false;
    setTimeout(() => {
      this.reloadTable = true;
    })
  }
  getDisplayRecordLimit() {
    return Math.min((this.pageNumber - 1) * this.configTable.pageSize + this.rows.length, this.configTable?.total)
  }
}
