import { element, by, ElementFinder } from 'protractor';

export class CycleComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-cycle div table .btn-danger'));
  title = element.all(by.css('jhi-cycle div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class CycleUpdatePage {
  pageTitle = element(by.id('jhi-cycle-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  repsInput = element(by.id('field_reps'));
  volumeInput = element(by.id('field_volume'));

  excerciseSelect = element(by.id('field_excercise'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setRepsInput(reps: string): Promise<void> {
    await this.repsInput.sendKeys(reps);
  }

  async getRepsInput(): Promise<string> {
    return await this.repsInput.getAttribute('value');
  }

  async setVolumeInput(volume: string): Promise<void> {
    await this.volumeInput.sendKeys(volume);
  }

  async getVolumeInput(): Promise<string> {
    return await this.volumeInput.getAttribute('value');
  }

  async excerciseSelectLastOption(): Promise<void> {
    await this.excerciseSelect.all(by.tagName('option')).last().click();
  }

  async excerciseSelectOption(option: string): Promise<void> {
    await this.excerciseSelect.sendKeys(option);
  }

  getExcerciseSelect(): ElementFinder {
    return this.excerciseSelect;
  }

  async getExcerciseSelectedOption(): Promise<string> {
    return await this.excerciseSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class CycleDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-cycle-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-cycle'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
