import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataGridComponent } from "./data-grid/data-grid.component";
import { CellPopoverComponent } from "./cell-popover/cell-popover.component";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { FormsModule } from "@angular/forms";

const exportedComponents = [
	DataGridComponent,
	CellPopoverComponent,
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		FormsModule,
		CodemirrorModule,
	],
	declarations: exportedComponents,
	exports: exportedComponents,
})
export class DatatugComponentsDatagridModule {
}
