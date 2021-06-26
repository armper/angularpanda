import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CycleComponentsPage, CycleDeleteDialog, CycleUpdatePage } from './cycle.page-object';

const expect = chai.expect;

describe('Cycle e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cycleComponentsPage: CycleComponentsPage;
  let cycleUpdatePage: CycleUpdatePage;
  let cycleDeleteDialog: CycleDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Cycles', async () => {
    await navBarPage.goToEntity('cycle');
    cycleComponentsPage = new CycleComponentsPage();
    await browser.wait(ec.visibilityOf(cycleComponentsPage.title), 5000);
    expect(await cycleComponentsPage.getTitle()).to.eq('Cycles');
    await browser.wait(ec.or(ec.visibilityOf(cycleComponentsPage.entities), ec.visibilityOf(cycleComponentsPage.noResult)), 1000);
  });

  it('should load create Cycle page', async () => {
    await cycleComponentsPage.clickOnCreateButton();
    cycleUpdatePage = new CycleUpdatePage();
    expect(await cycleUpdatePage.getPageTitle()).to.eq('Create or edit a Cycle');
    await cycleUpdatePage.cancel();
  });

  it('should create and save Cycles', async () => {
    const nbButtonsBeforeCreate = await cycleComponentsPage.countDeleteButtons();

    await cycleComponentsPage.clickOnCreateButton();

    await promise.all([
      cycleUpdatePage.setRepsInput('5'),
      cycleUpdatePage.setVolumeInput('5'),
      cycleUpdatePage.excerciseSelectLastOption(),
    ]);

    expect(await cycleUpdatePage.getRepsInput()).to.eq('5', 'Expected reps value to be equals to 5');
    expect(await cycleUpdatePage.getVolumeInput()).to.eq('5', 'Expected volume value to be equals to 5');

    await cycleUpdatePage.save();
    expect(await cycleUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await cycleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Cycle', async () => {
    const nbButtonsBeforeDelete = await cycleComponentsPage.countDeleteButtons();
    await cycleComponentsPage.clickOnLastDeleteButton();

    cycleDeleteDialog = new CycleDeleteDialog();
    expect(await cycleDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Cycle?');
    await cycleDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(cycleComponentsPage.title), 5000);

    expect(await cycleComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
