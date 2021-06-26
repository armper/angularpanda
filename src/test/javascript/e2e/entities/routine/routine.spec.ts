import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RoutineComponentsPage, RoutineDeleteDialog, RoutineUpdatePage } from './routine.page-object';

const expect = chai.expect;

describe('Routine e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let routineComponentsPage: RoutineComponentsPage;
  let routineUpdatePage: RoutineUpdatePage;
  let routineDeleteDialog: RoutineDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Routines', async () => {
    await navBarPage.goToEntity('routine');
    routineComponentsPage = new RoutineComponentsPage();
    await browser.wait(ec.visibilityOf(routineComponentsPage.title), 5000);
    expect(await routineComponentsPage.getTitle()).to.eq('Routines');
    await browser.wait(ec.or(ec.visibilityOf(routineComponentsPage.entities), ec.visibilityOf(routineComponentsPage.noResult)), 1000);
  });

  it('should load create Routine page', async () => {
    await routineComponentsPage.clickOnCreateButton();
    routineUpdatePage = new RoutineUpdatePage();
    expect(await routineUpdatePage.getPageTitle()).to.eq('Create or edit a Routine');
    await routineUpdatePage.cancel();
  });

  it('should create and save Routines', async () => {
    const nbButtonsBeforeCreate = await routineComponentsPage.countDeleteButtons();

    await routineComponentsPage.clickOnCreateButton();

    await promise.all([
      routineUpdatePage.setNameInput('name'),
      routineUpdatePage.setDateStartedInput('2000-12-31'),
      routineUpdatePage.setDateEndedInput('2000-12-31'),
      routineUpdatePage.setGoalDateInput('2000-12-31'),
      routineUpdatePage.setStartingBodyWeightInput('5'),
      routineUpdatePage.setEndingBodyWeightInput('5'),
      // routineUpdatePage.userSelectLastOption(),
    ]);

    expect(await routineUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await routineUpdatePage.getDateStartedInput()).to.eq('2000-12-31', 'Expected dateStarted value to be equals to 2000-12-31');
    expect(await routineUpdatePage.getDateEndedInput()).to.eq('2000-12-31', 'Expected dateEnded value to be equals to 2000-12-31');
    expect(await routineUpdatePage.getGoalDateInput()).to.eq('2000-12-31', 'Expected goalDate value to be equals to 2000-12-31');
    expect(await routineUpdatePage.getStartingBodyWeightInput()).to.eq('5', 'Expected startingBodyWeight value to be equals to 5');
    expect(await routineUpdatePage.getEndingBodyWeightInput()).to.eq('5', 'Expected endingBodyWeight value to be equals to 5');

    await routineUpdatePage.save();
    expect(await routineUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await routineComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Routine', async () => {
    const nbButtonsBeforeDelete = await routineComponentsPage.countDeleteButtons();
    await routineComponentsPage.clickOnLastDeleteButton();

    routineDeleteDialog = new RoutineDeleteDialog();
    expect(await routineDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Routine?');
    await routineDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(routineComponentsPage.title), 5000);

    expect(await routineComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
