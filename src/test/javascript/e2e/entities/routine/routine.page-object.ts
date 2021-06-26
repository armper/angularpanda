import { element, by, ElementFinder } from 'protractor';

export class RoutineComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-routine div table .btn-danger'));
  title = element.all(by.css('jhi-routine div h2#page-heading span')).first();
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

export class RoutineUpdatePage {
  pageTitle = element(by.id('jhi-routine-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  dateStartedInput = element(by.id('field_dateStarted'));
  dateEndedInput = element(by.id('field_dateEnded'));
  goalDateInput = element(by.id('field_goalDate'));
  startingBodyWeightInput = element(by.id('field_startingBodyWeight'));
  endingBodyWeightInput = element(by.id('field_endingBodyWeight'));

  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setDateStartedInput(dateStarted: string): Promise<void> {
    await this.dateStartedInput.sendKeys(dateStarted);
  }

  async getDateStartedInput(): Promise<string> {
    return await this.dateStartedInput.getAttribute('value');
  }

  async setDateEndedInput(dateEnded: string): Promise<void> {
    await this.dateEndedInput.sendKeys(dateEnded);
  }

  async getDateEndedInput(): Promise<string> {
    return await this.dateEndedInput.getAttribute('value');
  }

  async setGoalDateInput(goalDate: string): Promise<void> {
    await this.goalDateInput.sendKeys(goalDate);
  }

  async getGoalDateInput(): Promise<string> {
    return await this.goalDateInput.getAttribute('value');
  }

  async setStartingBodyWeightInput(startingBodyWeight: string): Promise<void> {
    await this.startingBodyWeightInput.sendKeys(startingBodyWeight);
  }

  async getStartingBodyWeightInput(): Promise<string> {
    return await this.startingBodyWeightInput.getAttribute('value');
  }

  async setEndingBodyWeightInput(endingBodyWeight: string): Promise<void> {
    await this.endingBodyWeightInput.sendKeys(endingBodyWeight);
  }

  async getEndingBodyWeightInput(): Promise<string> {
    return await this.endingBodyWeightInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
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

export class RoutineDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-routine-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-routine'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
