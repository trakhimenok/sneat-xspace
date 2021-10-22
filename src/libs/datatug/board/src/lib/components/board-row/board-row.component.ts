import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IBoardContext, IBoardRowDef } from '@sneat/datatug/models';

@Component({
	selector: 'datatug-board-row',
	templateUrl: './board-row.component.html',
	styleUrls: ['./board-row.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardRowComponent {
	@Input() boardRowDef: IBoardRowDef;
	@Input() boardContext: IBoardContext;
}
