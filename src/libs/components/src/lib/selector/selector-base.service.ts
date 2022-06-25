import { ModalController, ModalOptions } from '@ionic/angular';
import { IErrorLogger } from '@sneat/logging';
import { ISelectItem } from './selector-interfaces';
import { ISelectorOptions } from './selector-options';

export class SelectorBaseService<T = ISelectItem> {
	constructor(
		private readonly component: any,
		private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}

	selectSingleInModal(options: ISelectorOptions<T>): Promise<T | null> {
		console.log('selectSingleInModal(), options:', options);
		return new Promise<T | null>((resolve, reject) => {
			this.selectInModal(options)
				.then(items => resolve(items?.length ? items[0] : null))
				.catch(reject);
		});
	}

	selectInModal(options: ISelectorOptions<T>): Promise<T[] | null> {
		console.log('selectInModal(), options:', options);
		// if (!options.items) {
		// 	return Promise.reject(new Error('items is required parameter'))
		// }


		const result = new Promise<T[] | null>((resolve, reject) => {
			if (!options.onSelected) {
				options = {
					...options,
					onSelected: (items: T[] | null): void => {
						this.modalController.dismiss(items).catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
						resolve(items);
					},
				};
			}
			const modalOptions: ModalOptions = {
				component: this.component,
				componentProps: {
					...options,
					mode: 'modal',
				},
				keyboardClose: true,
			};
			this.modalController.create(modalOptions)
				.then(
					modal => modal.present().catch(this.errorLogger.logErrorHandler('Failed to present modal')),
				).catch(this.errorLogger.logErrorHandler('Failed to create modal'));
		});

		return result;
	}
}
