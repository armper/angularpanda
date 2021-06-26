import { element, by, ElementFinder } from 'protractor';

export class ExcerciseComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-excercise div table .btn-danger'));
  title = element.all(by.css('jhi-excercise div h2#page-heading span')).first();
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

export class ExcerciseUpdatePage {
  pageTitle = element(by.id('jhi-excercise-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  typeSelect = element(by.id('field_type'));
  currentVolumeInput = element(by.id('field_currentVolume'));
  startingVolumeInput = element(by.id('field_startingVolume'));
  goalVolumeInput = element(by.id('field_goalVolume'));

  routineSelect = element(by.id('field_routine'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setTypeSelect(type: string): Promise<void> {
    await this.typeSelect.sendKeys(type);
  }

  async getTypeSelect(): Promise<string> {
    return await this.typeSelect.element(by.css('option:checked')).getText();
  }

  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.all(by.tagName('option')).last().click();
  }

  async setCurrentVolumeInput(currentVolume: string): Promise<void> {
    await this.currentVolumeInput.sendKeys(currentVolume);
  }

  async getCurrentVolumeInput(): Promise<string> {
    return await this.currentVolumeInput.getAttribute('value');
  }

  async setStartingVolumeInput(startingVolume: string): Promise<void> {
    await this.startingVolumeInput.sendKeys(startingVolume);
  }

  async getStartingVolumeInput(): Promise<string> {
    return await this.startingVolumeInput.getAttribute('value');
  }

  async setGoalVolumeInput(goalVolume: string): Promise<void> {
    await this.goalVolumeInput.sendKeys(goalVolume);
  }

  async getGoalVolumeInput(): Promise<string> {
    return await this.goalVolumeInput.getAttribute('value');
  }

  async routineSelectLastOption(): Promise<void> {
    await this.routineSelect.all(by.tagName('option')).last().click();
  }

  async routineSelectOption(option: string): Promise<void> {
    await this.routineSelect.sendKeys(option);
  }

  getRoutineSelect(): ElementFinder {
    return this.routineSelect;
  }

  async getRoutineSelectedOption(): Promise<string> {
    return await this.routineSelect.element(by.css('option:checked')).getText();
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

export class ExcerciseDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-excercise-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-excercise'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
