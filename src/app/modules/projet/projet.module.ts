import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

//modules
import { ProjetRoutingModule } from './projet-routing.module';

//directives
import { DisplayMouseOverDirective } from './directives/display-mouse-over.directive';

//components
import { ProjetInitComponent } from './projet-init.component';
import { AdminComponent } from './components/admin/admin.component';
// import { ProjetFormComponent } from './components/projet/form/projet-form.component';
// import { PartenaireFormComponent } from './components/projet/form/partenaire-form.component';
// import { ProjetTravailleurFormComponent } from './components/projet/form/p-travailleur-form.component';
// import { PListComponent } from './components/projet/p-list/p-list.component';
// import { MissionFormComponent } from './components/mission/form/mission-form.component';
// import { MissionTravailleurFormComponent } from './components/mission/form/m-travailleur-form.component';
import { TravailleurFormComponent } from './components/person/form/travailleur-form.component';
import { SListUserComponent } from './components/suiveuse/list-user/list-user.component';
import { CalendarComponent } from './components/suiveuse/calendar/calendar.component';
//news
import { SalariesComponent } from './components/admin/salarie/salaries.component';
import { AntennesComponent } from './components/admin/salarie/antennes/antennes.component';
import { AntenneFormComponent } from './components/admin/salarie/antennes/antenne-form.component';
import { FonctionsComponent } from './components/admin/salarie/fonctions/fonctions.component';
import { FonctionFormComponent } from './components/admin/salarie/fonctions/fonction-form.component';
import { PersonnesComponent } from './components/admin/salarie/personnes/personnes.component';
import { PersonneFormComponent } from './components/admin/salarie/personnes/personne-form.component';
import { SalarieFormComponent } from './components/admin/salarie/personnes/personne/salarie-form.component';
import { AdminProjetComponent } from './components/admin/admin-projet/admin-projet.component';
import { LocalisationsComponent } from './components/admin/admin-projet/localisation/localisations.component';
import { LocalisationService } from './components/admin/admin-projet/localisation/localisation.service';
import { LocalisationFormComponent } from './components/admin/admin-projet/localisation/localisation-form.component';
import { LocalisationInfoComponent } from './components/admin/admin-projet/localisation/info.component';
import { LocalisationControlComponent } from './controls/localisation-control/localisation-control.component';
import { OrganismeControlComponent } from './controls/organisme-control/organisme-control.component';
import { TaskActionsComponent } from './components/admin/admin-projet/task-action/task-actions.component';
import { TaskActionInfoComponent } from './components/admin/admin-projet/task-action/info.component';
import { TaskActionFormComponent } from './components/admin/admin-projet/task-action/task-action-form.component';
import { AvancementsComponent } from './components/admin/admin-projet/avancement/avancements.component';
import { AvancementInfoComponent } from './components/admin/admin-projet/avancement/info.component';
import { AvancementFormComponent } from './components/admin/admin-projet/avancement/avancement-form.component';
import { TaskActionControlComponent } from './controls/task-action-control/task-action-control.component';
import { TaskAvancementControlComponent } from './controls/task-avancement-control/task-avancement-control.component';
import { ChargeTypesComponent } from './components/admin/admin-projet/charge-type/charge-types.component';
import { ChargeTypeInfoComponent } from './components/admin/admin-projet/charge-type/info/info.component';
import { ChargeTypeRefFormComponent } from './components/admin/admin-projet/charge-type/form/charge-type-ref-form.component';
import { ChargeTypeFormComponent } from './components/admin/admin-projet/charge-type/form/charge-type-form.component';

//repository
import { PersonRepository } from './repository/person.repository';
import { CategoryRepository } from './repository/category.repository';
import { EtatRepository } from './repository/etat.repository';
import { TypeRepository } from './repository/type.repository';
import { ProjetRepository } from './repository/projet.repository';
import { OrganismeRepository } from './repository/organisme.repository';
import { MissionRepository } from './repository/mission.repository';
import { SuiveuseRepository } from './repository/suiveuse.repository';
import { SalarieRepository } from './repository/salarie.repository';
import { ProjectTypeRepository } from './repository/project-type.repository';
import { ChargeTypeRepository } from './repository/charge-type.repository';
import { TaskRepository } from './repository/task.repository';
import { ConventionsRepository } from './repository/conventions.repository';
import { WorksRepository } from './repository/works.repository';

//services
import { ProjetFormService } from './services/projet-form.service';
import { SuiveuseService } from './components/suiveuse/suiveuse.service';
import { TravailFormService } from './services/travail-form.service';
import { AntenneService } from './components/admin/salarie/antennes/antenne.service';
import { FonctionService } from './components/admin/salarie/fonctions/fonction.service';
import { PersonneService } from './components/admin/salarie/personnes/personne.service';
import { SalarieService } from './components/admin/salarie/personnes/personne/salarie.service';
import { SalarieFormService } from './components/admin/salarie/personnes/personne/salarie-form.service';
import { RefProjectTypeService } from './components/admin/admin-projet/project-types/ref-project-type.service';
import { ProjectTypeService } from './components/admin/admin-projet/project-types/ref-project-type/project-type.service';
import { ProjectTypeFormService } from './components/admin/admin-projet/project-types/ref-project-type/project-type-form.service';
import { ChargeTypeRefService } from './components/admin/admin-projet/charge-type/charge-type-ref.service';
import { ChargeTypeService } from './components/admin/admin-projet/charge-type/charge-type.service';
import { ProjetsService } from './components/projets/projets.service'
import { ProjetService } from './components/projets/projet/projet.service'
import { TaskFormService } from './components/projets/projet/tasks/task/form/task-form.service'
import { TaskActionService } from './components/admin/admin-projet/task-action/task-action.service';
import { AvancementService } from './components/admin/admin-projet/avancement/avancement.service';
import { TaskService } from './components/projets/projet/tasks/task/task.service';
import { WorkService } from './components/suiveuse/works/work.service';
import { WeeksService } from './components/projets/projet/tasks/task/weeks/weeks.service';
import { ConventionService } from './components/conventions/convention/convention.service';

//dialog

import { ProjetsComponent } from './components/projets/projets.component';
import { ProjetFormDialog } from './components/projets/projet/form/projet-form.dialog';
import { SalarieControlComponent } from './controls/salarie-control/salarie-control.component';
import { ProjectTypeControlComponent } from './controls/project-type-control/project-type-control.component';
import { ChargeTypeControlComponent } from './controls/charge-type-control/charge-type-control.component';
import { TaskFormDialog } from './components/projets/projet/tasks/task/form/task-form.dialog';
import { MontagesProjectComponent } from './components/projets/projet/montages/montages.component';
import { FinancementProjectComponent } from './components/projets/projet/financement-disp/financement-disp.component';
import { InfoChargeTypeFormDialog } from './components/admin/admin-projet/charge-type/info/info.component';
import { ChargeFormDialog } from './components/projets/projet/montages/charge-form.dialog';
import { ProjetAccueilComponent } from './components/accueil/accueil.component';
import { ConventionsComponent } from './components/conventions/conventions.component';
import { ConventionFormComponent } from './components/conventions/convention/convention-form/convention-form.component';
import { FinanceurFormComponent } from './components/conventions/convention/financeurs/financeur/financeur-form.component';
import { ProjectControlComponent } from './controls/project-control/project-control.component';
import { SuiveusesComponent } from './components/suiveuse/suiveuses.component';
import { WorksComponent } from './components/suiveuse/works/works.component';
import { WorkFormComponent } from './components/suiveuse/works/work-form/work-form.component';
import { TaskControlComponent } from './controls/task-control/task-control.component';
import { ProjetComponent } from './components/projets/projet/projet.component';
import { ProjetDisplayComponent } from './components/projets/projet/display/display.component';
import { ProjetTasksService } from './components/projets/projet/tasks/tasks.service';
import { ProjectLocalisationsService } from './components/projets/projet/localisations/localisations.service';
import { ProjectResponsablesService } from './components/projets/projet/responsables/responsables.service';
import { ProjectLocalisationsComponent } from './components/projets/projet/localisations/localisations.component';
import { ProjectResponsablesComponent } from './components/projets/projet/responsables/responsables.component';
import { ProjetMontagesService } from './components/projets/projet/montages/montages.service';
import { ProjetFinancementService } from './components/projets/projet/financement-disp/financement.service';
import { TasksComponent } from './components/projets/projet/tasks/tasks.component';
import { TaskAttributionFormDialog } from './components/projets/projet/tasks/task/attributions/attribution-form/attribution-form.dialog';
import { TaskAttributionsComponent } from './components/projets/projet/tasks/task/attributions/attributions.component';
import { TaskPeriodsComponent } from './components/projets/projet/tasks/task/periods/periods.component';
import { TaskWeeksComponent } from './components/projets/projet/tasks/task/weeks/weeks.component';
import { AntenneComponent } from './components/admin/salarie/antennes/antenne/antenne.component';
import { FonctionComponent } from './components/admin/salarie/fonctions/fonction/fonction.component';
import { PersonneComponent } from './components/admin/salarie/personnes/personne/personne.component';
import { SalarieFormTemplateComponent } from './components/admin/salarie/personnes/personne/salarie-form-template.component';
import { RefProjectTypesComponent } from './components/admin/admin-projet/project-types/ref-project-types.component';
import { RefProjectTypeComponent } from './components/admin/admin-projet/project-types/ref-project-type/ref-project-type.component';
import { RefProjetTypeFormComponent } from './components/admin/admin-projet/project-types/ref-projet-type-form.component';
import { ProjectTypeFormTemplateComponent } from './components/admin/admin-projet/project-types/ref-project-type/project-type-form-template.component';
import { ProjectTypeFormComponent } from './components/admin/admin-projet/project-types/ref-project-type/project-type-form.component';
import { ConventionComponent } from './components/conventions/convention/convention.component';
import { FinanceursComponent } from './components/conventions/convention/financeurs/financeurs.component';
import { FinanceurComponent } from './components/conventions/convention/financeurs/financeur/financeur.component';
import { SignatairesComponent } from './components/conventions/convention/signataires/signataires.component';
import { SignataireComponent } from './components/conventions/convention/signataires/signataire/signataire.component';
import { SignataireFormComponent } from './components/conventions/convention/signataires/signataire/signataire-form.component';
import { ProjectsComponent } from './components/conventions/convention/project-fundings/project-fundings.component';
import { ProjectFundingComponent } from './components/conventions/convention/project-fundings/project-funding/project-funding.component';
import { ProjectFundingFormComponent } from './components/conventions/convention/project-fundings/project-funding/project-funding-form.component';
import { DeadlinesComponent } from './components/conventions/convention/deadlines/deadlines.component';
import { DeadlineComponent } from './components/conventions/convention/deadlines/deadline/deadline.component';
import { DeadlineFormComponent } from './components/conventions/convention/deadlines/deadline/deadline-form.component';
import { AntenneControlComponent } from './controls/antenne-control/antenne-control.component';
import { TaskComponent } from './components/projets/projet/tasks/task/task.component';
import { PlansChargesComponent } from './components/plans-charges/plans-charges.component';
import { PlanChargesComponent } from './components/plans-charges/plan-charges/plan-charges.component';
import { GlobalStatsComponent } from './components/plans-charges/plan-charges/global-stats.component';
import { PDCPersonInfoComponent } from './components/plans-charges/plan-charges/person-info/person-info.component';
import { UnfundedTasksComponent, TaskFunderDialog } from './components/projets/projet/montages/unfunded-tasks.component';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    CdkTableModule,
    CdkTreeModule,
    SharedModule,
    EditorModule,
    ProjetRoutingModule,
  ],
  declarations: [
  	ProjetInitComponent,
  	AdminComponent,
    DisplayMouseOverDirective,
    // ProjetFormComponent,
    // PartenaireFormComponent,
    // ProjetTravailleurFormComponent,
    // PListComponent,
    // MissionFormComponent,
    // MissionTravailleurFormComponent,
    TravailleurFormComponent,
    SListUserComponent,
    CalendarComponent,
    //news
    SalariesComponent,
    AntennesComponent,
    AntenneFormComponent,
    FonctionsComponent,
    FonctionFormComponent,
    PersonnesComponent,
    PersonneFormComponent,
    SalarieFormComponent,
    AdminProjetComponent,
    LocalisationsComponent,
    LocalisationFormComponent,
    LocalisationInfoComponent,
    ProjetsComponent,
    ProjetFormDialog,
    SalarieControlComponent,
    LocalisationControlComponent,
    ProjectTypeControlComponent,
    TaskFormDialog,
    TaskActionInfoComponent,
    TaskActionsComponent,
    TaskActionFormComponent,
    AvancementsComponent,
    AvancementInfoComponent,
    AvancementFormComponent,
    TaskActionControlComponent,
    TaskAvancementControlComponent,
    MontagesProjectComponent,
    FinancementProjectComponent,
    ChargeTypesComponent,
    ChargeTypeInfoComponent,
    ChargeTypeRefFormComponent,
    ChargeTypeFormComponent,
    InfoChargeTypeFormDialog,
    ChargeFormDialog,
    ChargeTypeControlComponent,
    ProjetAccueilComponent,
    ConventionsComponent,
    ConventionFormComponent,
    FinanceurFormComponent,
    OrganismeControlComponent,
    ProjectControlComponent,
    SuiveusesComponent,
    WorksComponent,
    WorkFormComponent,
    TaskControlComponent,
    ProjetComponent,
    ProjetDisplayComponent,
    TasksComponent,
    TaskAttributionFormDialog,
    TaskAttributionsComponent,
    TaskPeriodsComponent,
    TaskWeeksComponent,
    AntenneComponent,
    FonctionComponent,
    PersonneComponent,
    SalarieFormTemplateComponent,
    RefProjectTypesComponent,
    RefProjectTypeComponent,
    RefProjetTypeFormComponent,
    ProjectTypeFormTemplateComponent,
    ProjectTypeFormComponent,
    ConventionComponent,
    FinanceursComponent,
    FinanceurComponent,
    SignatairesComponent,
    SignataireComponent,
    SignataireFormComponent,
    ProjectsComponent,
    ProjectFundingComponent,
    ProjectFundingFormComponent,
    DeadlinesComponent,
    DeadlineComponent,
    DeadlineFormComponent,
    AntenneControlComponent,
    ProjectLocalisationsComponent,
    ProjectResponsablesComponent,
    TaskComponent,
    PlansChargesComponent,
    PlanChargesComponent,
    GlobalStatsComponent,
    PDCPersonInfoComponent,
    UnfundedTasksComponent,
    TaskFunderDialog,
  ],
  entryComponents: [
    // MissionTravailleurFormComponent,
    // PartenaireFormComponent,
    // ProjetTravailleurFormComponent,
    InfoChargeTypeFormDialog,
    ChargeFormDialog,
    TaskAttributionFormDialog,
    TaskFormDialog,
    ProjetFormDialog,
    TaskFunderDialog,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    PersonRepository,
    CategoryRepository,
    EtatRepository,
    TypeRepository,
    ProjetRepository,
    OrganismeRepository,
    MissionRepository,
    SuiveuseRepository,
    ProjectTypeRepository,
    ChargeTypeRepository,
    ProjetFormService,
    SuiveuseService,
    TravailFormService,
    SalarieRepository,
    AntenneService,
    FonctionService,
    PersonneService,
    SalarieService,
    SalarieFormService,
    RefProjectTypeService,
    ProjectTypeFormService,
    ProjectTypeService,
    LocalisationService,
    ProjetsService,
    ProjetService,
    TaskFormService,
    TaskActionService,
    TaskRepository,
    AvancementService,
    ChargeTypeRefService,
    ChargeTypeService,
    ConventionsRepository,
    WorksRepository,
    TaskService,
    WorkService,
    WeeksService,
    ConventionService,
    ProjetFinancementService,
    ProjetMontagesService,
    ProjetTasksService,
    ProjectLocalisationsService,
    ProjectResponsablesService,
  ]
})
export class ProjetModule { }
