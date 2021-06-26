import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ExcerciseComponentsPage, ExcerciseDeleteDialog, ExcerciseUpdatePage } from './excercise.page-object';

const expect = chai.expect;

describe('Excercise e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let excerciseComponentsPage: ExcerciseComponentsPage;
  let excerciseUpdatePage: ExcerciseUpdatePage;
  let excerciseDeleteDialog: ExcerciseDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Excercises', async () => {
    await navBarPage.goToEntity('excercise');
    excerciseComponentsPage = new ExcerciseComponentsPage();
    await browser.wait(ec.visibilityOf(excerciseComponentsPage.title), 5000);
    expect(await excerciseComponentsPage.getTitle()).to.eq('Excercises');
    await browser.wait(ec.or(ec.visibilityOf(excerciseComponentsPage.entities), ec.visibilityOf(excerciseComponentsPage.noResult)), 1000);
  });

  it('should load create Excercise page', async () => {
    await excerciseComponentsPage.clickOnCreateButton();
    excerciseUpdatePage = new ExcerciseUpdatePage();
    expect(await excerciseUpdatePage.getPageTitle()).to.eq('Create or edit a Excercise');
    await excerciseUpdatePage.cancel();
  });

  it('should create and save Excercises', async () => {
    const nbButtonsBeforeCreate = await excerciseComponentsPage.countDeleteButtons();

    await excerciseComponentsPage.clickOnCreateButton();

    await promise.all([
      excerciseUpdatePage.typeSelectLastOption(),
      excerciseUpdatePage.setCurrentVolumeInput('5'),
      excerciseUpdatePage.setStartingVolumeInput('5'),
      excerciseUpdatePage.setGoalVolumeInput('5'),
      excerciseUpdatePage.routineSelectLastOption(),
    ]);

    expect(await excerciseUpdatePage.getCurrentVolumeInput()).to.eq('5', 'Expected currentVolume value to be equals to 5');
    expect(await excerciseUpdatePage.getStartingVolumeInput()).to.eq('5', 'Expected startingVolume value to be equals to 5');
    expect(await excerciseUpdatePage.getGoalVolumeInput()).to.eq('5', 'Expected goalVolume value to be equals to 5');

    await excerciseUpdatePage.save();
    expect(await excerciseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await excerciseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Excercise', async () => {
    const nbButtonsBeforeDelete = await excerciseComponentsPage.countDeleteButtons();
    await excerciseComponentsPage.clickOnLastDeleteButton();

    excerciseDeleteDialog = new ExcerciseDeleteDialog();
    expect(await excerciseDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Excercise?');
    await excerciseDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(excerciseComponentsPage.title), 5000);

    expect(await excerciseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
