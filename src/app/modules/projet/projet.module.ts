import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

//modules
import { SynologyModule } from '../synology/synology.module';
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
import { CalendarDayComponent } from './components/suiveuse/calendar/day/day.component';
//news
import { EmployeesComponent } from './components/admin/employees/employees.component';
import { AntennesComponent } from './components/admin/employees/antennes/antennes.component';
import { AntenneFormComponent } from './components/admin/employees/antennes/antenne-form.component';
import { FunctionsComponent } from './components/admin/employees/functions/functions.component';
import { FunctionFormComponent } from './components/admin/employees/functions/function-form.component';
import { PersonsComponent } from './components/admin/employees/persons/persons.component';
import { PersonFormComponent } from './components/admin/employees/persons/person-form.component';
import { EmployeeFormComponent } from './components/admin/employees/persons/person/employee-form.component';
import { AdminProjetComponent } from './components/admin/admin-projet/admin-projet.component';
import { LocalisationsComponent } from './components/admin/admin-projet/localisation/localisations.component';
import { LocalisationService } from './components/admin/admin-projet/localisation/localisation.service';
import { LocalisationFormComponent } from './components/admin/admin-projet/localisation/localisation-form.component';
import { LocalisationInfoComponent } from './components/admin/admin-projet/localisation/info.component';
import { LocalisationControlComponent } from './controls/localisation-control/localisation-control.component';
import { PersonControlComponent } from './controls/person-control/person-control.component';
import { OrganismControlComponent } from './controls/organism-control/organism-control.component';
import { ActionCategoriesComponent } from './components/admin/admin-projet/action-categories/action-categories.component';
import { ActionCategoryInfoComponent } from './components/admin/admin-projet/action-categories/action-category/info.component';
import { ActionCategoryFormComponent } from './components/admin/admin-projet/action-categories/action-category/action-category-form.component';
import { WorkCategoryControlComponent } from './controls/work-category-control/work-category-control.component';
import { ObjectiveControlComponent } from './controls/objective-control/objective-control.component';
import { FileControlComponent } from './controls/file-control/file-control.component';
import { ChargeTypesComponent } from './components/admin/admin-projet/charge-type/charge-types.component';
import { ChargeTypeInfoComponent } from './components/admin/admin-projet/charge-type/info/info.component';
import { ChargeTypeRefFormComponent } from './components/admin/admin-projet/charge-type/form/charge-type-ref-form.component';
import { ChargeTypeFormComponent } from './components/admin/admin-projet/charge-type/form/charge-type-form.component';

//repository
import { ApiProjectRepository } from './repository/api-project.repository';
import { CategoryRepository } from './repository/category.repository';
import { StudiesRepository } from './repository/studies.repository';
import { OrganismRepository } from './repository/organism.repository';
import { EmployeeRepository } from './repository/employee.repository';
import { FundingTypeRepository } from './repository/funding-type.repository';
import { ChargeTypeRepository } from './repository/charge-type.repository';
import { ActionsRepository } from './repository/actions.repository';
import { ProjectsRepository } from './repository/projects.repository';
import { WorksRepository } from './repository/works.repository';
import { PersonRepository } from './repository/person.repository';
import { SuiveuseRepository } from './repository/suiveuse.repository';

//services
import { SuiveuseService } from './components/suiveuse/suiveuse.service';
import { AntenneService } from './components/admin/employees/antennes/antenne.service';
import { FunctionService } from './components/admin/employees/functions/function.service';
import { PersonService } from './components/admin/employees/persons/person.service';
import { EmployeeService } from './components/admin/employees/persons/person/employee.service';
import { EmployeeFormService } from './components/admin/employees/persons/person/employee-form.service';
import { FundingTypeRefService } from './components/admin/admin-projet/funding-types/funding-type-ref.service';
import { FundingTypeService } from './components/admin/admin-projet/funding-types/funding-type-ref/funding-type.service';
import { FundingTypeFormService } from './components/admin/admin-projet/funding-types/funding-type-ref/funding-type-form.service';
import { ChargeTypeRefService } from './components/admin/admin-projet/charge-type/charge-type-ref.service';
import { ChargeTypeService } from './components/admin/admin-projet/charge-type/charge-type.service';
import { StudiesService } from './components/studies/studies.service'
import { StudyService } from './components/studies/study/study.service'
import { ActionFormService } from './components/studies/study/actions/action/form/action-form.service'
import { ObjectiveFormService } from './components/studies/study/actions/action/objective/objective-form.service'
import { ActionCategoriesService } from './components/admin/admin-projet/action-categories/action-categories.service';
import { ActionService } from './components/studies/study/actions/action/action.service';
import { WeeksService } from './components/studies/study/actions/action/weeks/weeks.service';
import { ProjectService } from './components/projects/project/project.service';
import { ProjectFundersService } from './components/projects/project/funders/funders.service';
import { ProjectSignatoriesService } from './components/projects/project/signatories/signatories.service';
import { ProjectStudiesFundingsService } from './components/projects/project/studies-fundings/studies-fundings.service';
import { WorkFormService } from './components/suiveuse/works/work-form/work-form.service';
import { ExpenseFormService } from './components/suiveuse/expenses/expense-form/expense-form.service';
import { TravelFormService } from './components/suiveuse/travels/travel-form/travel-form.service';
import { GlobalProjectService } from './components/global-project.service';

//dialog
import { StudiesComponent } from './components/studies/studies.component';
import { StudyFormDialog } from './components/studies/study/form/study-form.dialog';
import { EmployeeControlComponent } from './controls/employee-control/employee-control.component';
import { FundingTypeControlComponent } from './controls/funding-type-control/funding-type-control.component';
import { ChargeTypeControlComponent } from './controls/charge-type-control/charge-type-control.component';
import { ChargeTypeControlService } from './controls/charge-type-control/charge-type-control.service';
import { ActionFormDialog } from './components/studies/study/actions/action/form/action-form.dialog';
// import { ActionsChargesStudyComponent } from './components/studies/study/charges/actions-charges/actions-charges.component';
import { StudyFundingsComponent } from './components/studies/study/fundings/fundings.component';
import { InfoChargeTypeFormDialog } from './components/admin/admin-projet/charge-type/info/info.component';
import { ChargeFormDialog } from './components/studies/study/charges/form/charge-form.dialog';
import { ProjetAccueilComponent } from './components/accueil/accueil.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectFormDialog } from './components/projects/project/project-form/project-form.dialog';
import { FunderFormDialog } from './components/projects/project/funders/funder-form/funder-form.dialog';
import { DailyCostFormDialog } from './components/projects/project/funders/daily-cost-form/daily-cost-form.dialog';
import { StudyControlComponent } from './controls/study-control/study-control.component';
import { SuiveusesComponent } from './components/suiveuse/suiveuses.component';
import { WorksComponent } from './components/suiveuse/works/works.component';
import { WorkFormDialog } from './components/suiveuse/works/work-form/work-form.dialog';
import { StudyActionControlComponent } from './controls/study-action-control/study-action-control.component';
import { StudyComponent } from './components/studies/study/study.component';
import { StudyDisplayComponent } from './components/studies/study/display/display.component';
import { StudyActionsService } from './components/studies/study/actions/actions.service';
import { StudyLocalisationsService } from './components/studies/study/display/localisations/localisations.service';
import { StudyManagersService } from './components/studies/study/display/managers/managers.service';
import { StudyLocalisationsComponent } from './components/studies/study/display/localisations/localisations.component';
import { StudyManagersComponent } from './components/studies/study/display/managers/managers.component';
import { StudyChargesService } from './components/studies/study/charges/charges.service';
import { StudyFundingsService } from './components/studies/study/fundings/fundings.service';
import { ActionsComponent } from './components/studies/study/actions/actions.component';
import { ActionAttributionFormDialog } from './components/studies/study/actions/action/attributions/attribution-form/attribution-form.dialog';
import { ActionAttributionsComponent } from './components/studies/study/actions/action/attributions/attributions.component';
import { ActionPeriodsComponent } from './components/studies/study/actions/action/periods/periods.component';
import { ActionWeeksComponent } from './components/studies/study/actions/action/weeks/weeks.component';
import { AntenneComponent } from './components/admin/employees/antennes/antenne/antenne.component';
import { FunctionComponent } from './components/admin/employees/functions/function/function.component';
import { PersonneComponent } from './components/admin/employees/persons/person/person.component';
import { EmployeeFormTemplateComponent } from './components/admin/employees/persons/person/employee-form-template.component';
import { FundingTypeRefsComponent } from './components/admin/admin-projet/funding-types/funding-type-refs.component';
import { FundingTypeRefComponent } from './components/admin/admin-projet/funding-types/funding-type-ref/funding-type-ref.component';
import { FundingTypeRefFormComponent } from './components/admin/admin-projet/funding-types/funding-type-ref-form.component';
import { FundingTypeFormTemplateComponent } from './components/admin/admin-projet/funding-types/funding-type-ref/funding-type-form-template.component';
import { FundingTypeFormComponent } from './components/admin/admin-projet/funding-types/funding-type-ref/funding-type-form.component';
import { ProjectComponent } from './components/projects/project/project.component';
import { FundersComponent } from './components/projects/project/funders/funders.component';
import { SignatoriesComponent } from './components/projects/project/signatories/signatories.component';
import { SignatoryFormDialog } from './components/projects/project/signatories/signatory-form/signatory-form.dialog';
import { StudiesFundingsComponent } from './components/projects/project/studies-fundings/studies-fundings.component';
import { StudyFundingFormDialog } from './components/projects/project/studies-fundings/study-funding-form/study-funding-form.dialog';
import { DeadlinesComponent } from './components/projects/project/deadlines/deadlines.component';
import { DeadlineComponent } from './components/projects/project/deadlines/deadline/deadline.component';
import { DeadlineFormComponent } from './components/projects/project/deadlines/deadline/deadline-form.component';
import { AntenneControlComponent } from './controls/antenne-control/antenne-control.component';
import { ActionComponent } from './components/studies/study/actions/action/action.component';
import { PlansChargesComponent } from './components/plans-charges/plans-charges.component';
import { PlansChargesService } from './components/plans-charges/plans-charges.service';
import { PlanChargesComponent } from './components/plans-charges/plan-charges/plan-charges.component';
import { GlobalStatsComponent } from './components/plans-charges/global-stats/global-stats.component';
import { PDCPersonInfoComponent } from './components/plans-charges/person-info/person-info.component';
import { ProjectDisplayComponent } from './components/projects/project/display/display.component';
import { AbstractControl } from './controls/abstract.control';
import { AutocompleteControl } from './controls/autocomplete-control/autocomplete.control';
import { SelectControl } from './controls/select-control/select.control';
import { ProjectTypeControlComponent } from './controls/project-type-control/project-type-control.component';
import { StudyChargesComponent } from './components/studies/study/charges/charges.component';
// import { MontagesStudyComponent } from './components/studies/study/charges/montages.component';
import { CumulSuiveusesComponent } from './components/admin/syntheses/cumul-suiveuses/cumul-suiveuses.component';
import { TravelFormDialog } from './components/suiveuse/travels/travel-form/travel-form.dialog';
import { TimeControlComponent } from './controls/time-control/time-control.component';
import { ProvScheduleComponent } from './components/plans-charges/prov-schedule/prov-schedule.component';
import { SchedulEditorDialog } from './components/plans-charges/prov-schedule/schedul-editor/schedul-editor.dialog';
import { ActionObjectiveFormDialog } from './components/studies/study/actions/action/objective/objective-form.dialog';
import { ActionObjectiveAssignmentDialog } from './components/studies/study/actions/action/objective/objective-assignment.dialog';
import { StudyResultsComponent } from './components/studies/study/results/results.component';
import { StudyDeadlinesComponent } from './components/studies/study/deadlines/deadlines.component';
import { StudyDeadlinesService } from './components/studies/study/deadlines/deadlines.service';
import { StudyDeadlineFormDialog } from './components/studies/study/deadlines/form/deadline-form.dialog';
import { DeadlineTypeControlComponent } from './controls/deadline-type-control/deadline-type-control.component';
import { ExpenseFormDialog } from './components/suiveuse/expenses/expense-form/expense-form.dialog';
import { TravelsComponent } from './components/suiveuse/travels/travels.component';
import { ExpensesComponent } from './components/suiveuse/expenses/expenses.component';
import { HolidaysComponent } from './components/suiveuse/holidays/holidays.component';
import { HolidayFormService } from './components/suiveuse/holidays/holiday-form/holiday-form.service';
import { HolidayFormDialog } from './components/suiveuse/holidays/holiday-form/holiday-form.dialog';
import { WoksFiltersComponent } from './components/suiveuse/filters/filters.component';
import { WorksResultComponent } from './components/suiveuse/result/works-result.component';
import { TravelsResultComponent } from './components/suiveuse/result/travels-result.component';
import { ExpensesResultComponent } from './components/suiveuse/result/expenses-result.component';
import { WorkingTimeResultsComponent } from './components/suiveuse/result/results.component';
import { WorkingTimeResultsService } from './components/suiveuse/result/results.service';
import { PlanChargeInfoDialog } from './components/plans-charges/plan-charge-info/plan-charge-info.dialog';
import { AdminExpensesComponent } from './components/expenses/admin-expenses/admin-expenses.component';
import { UserExpensesComponent } from './components/expenses/user-expenses/user-expenses.component';

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
    SynologyModule,
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
    EmployeesComponent,
    AntennesComponent,
    AntenneFormComponent,
    FunctionsComponent,
    FunctionFormComponent,
    PersonsComponent,
    PersonFormComponent,
    EmployeeFormComponent,
    AdminProjetComponent,
    LocalisationsComponent,
    LocalisationFormComponent,
    LocalisationInfoComponent,
    StudiesComponent,
    StudyFormDialog,
    EmployeeControlComponent,
    LocalisationControlComponent,
    FundingTypeControlComponent,
    ActionFormDialog,
    ActionCategoryInfoComponent,
    ActionCategoriesComponent,
    ActionCategoryFormComponent,
    WorkCategoryControlComponent,
    ObjectiveControlComponent,
    // ActionsChargesStudyComponent,
    StudyFundingsComponent,
    ChargeTypesComponent,
    ChargeTypeInfoComponent,
    ChargeTypeRefFormComponent,
    ChargeTypeFormComponent,
    InfoChargeTypeFormDialog,
    ChargeFormDialog,
    ChargeTypeControlComponent,
    ProjetAccueilComponent,
    ProjectsComponent,
    ProjectFormDialog,
    FunderFormDialog,
    OrganismControlComponent,
    StudyControlComponent,
    SuiveusesComponent,
    WorksComponent,
    WorkFormDialog,
    StudyActionControlComponent,
    StudyComponent,
    StudyDisplayComponent,
    ActionsComponent,
    ActionAttributionFormDialog,
    ActionAttributionsComponent,
    ActionPeriodsComponent,
    ActionWeeksComponent,
    AntenneComponent,
    FunctionComponent,
    PersonneComponent,
    EmployeeFormTemplateComponent,
    FundingTypeRefsComponent,
    FundingTypeRefComponent,
    FundingTypeRefFormComponent,
    FundingTypeFormTemplateComponent,
    FundingTypeFormComponent,
    ProjectComponent,
    FundersComponent,
    SignatoriesComponent,
    SignatoryFormDialog,
    StudiesFundingsComponent,
    StudyFundingFormDialog,
    DeadlinesComponent,
    DeadlineComponent,
    DeadlineFormComponent,
    AntenneControlComponent,
    StudyLocalisationsComponent,
    StudyManagersComponent,
    ActionComponent,
    PlansChargesComponent,
    PlanChargesComponent,
    GlobalStatsComponent,
    PDCPersonInfoComponent,
    ProjectDisplayComponent,
    AbstractControl,
    AutocompleteControl,
    SelectControl,
    DailyCostFormDialog,
    StudyChargesComponent,
    // MontagesStudyComponent,
    CumulSuiveusesComponent,
    TravelFormDialog,
    TimeControlComponent,
    ProvScheduleComponent,
    SchedulEditorDialog,
    ProjectTypeControlComponent,
    ActionObjectiveFormDialog,
    ActionObjectiveAssignmentDialog,
    StudyResultsComponent,
    StudyDeadlinesComponent,
    StudyDeadlineFormDialog,
    DeadlineTypeControlComponent,
    ExpenseFormDialog,
    TravelsComponent,
    ExpensesComponent,
    PersonControlComponent,
    WoksFiltersComponent,
    WorksResultComponent,
    WorkingTimeResultsComponent,
    WorksResultComponent,
    TravelsResultComponent,
    ExpensesResultComponent,
    HolidaysComponent,
    HolidayFormDialog,
    FileControlComponent,
    PlanChargeInfoDialog,
    CalendarDayComponent,
    AdminExpensesComponent,
    UserExpensesComponent,
  ],
  entryComponents: [
    // MissionTravailleurFormComponent,
    // PartenaireFormComponent,
    // ProjetTravailleurFormComponent,
    InfoChargeTypeFormDialog,
    ChargeFormDialog,
    ActionAttributionFormDialog,
    ActionFormDialog,
    StudyFormDialog,
    FunderFormDialog,
    ProjectFormDialog,
    SignatoryFormDialog,
    StudyFundingFormDialog,
    DailyCostFormDialog,
    TravelFormDialog,
    SchedulEditorDialog,
    ActionObjectiveFormDialog,
    ActionObjectiveAssignmentDialog,
    StudyDeadlineFormDialog,
    ExpenseFormDialog,
    WorkFormDialog,
    HolidayFormDialog,
    PlanChargeInfoDialog,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    ApiProjectRepository,
    CategoryRepository,
    StudiesRepository,
    OrganismRepository,
    FundingTypeRepository,
    ChargeTypeRepository,
    SuiveuseService,
    EmployeeRepository,
    AntenneService,
    FunctionService,
    PersonService,
    EmployeeService,
    EmployeeFormService,
    FundingTypeRefService,
    FundingTypeFormService,
    FundingTypeService,
    LocalisationService,
    StudiesService,
    StudyService,
    ActionFormService,
    ActionCategoriesService,
    ActionsRepository,
    ChargeTypeRefService,
    ChargeTypeService,
    ProjectsRepository,
    WorksRepository,
    PersonRepository,
    ActionService,
    WeeksService,
    ProjectService,
    StudyFundingsService,
    StudyChargesService,
    StudyActionsService,
    StudyLocalisationsService,
    StudyManagersService,
    ProjectFundersService,
    ProjectSignatoriesService,
    ProjectStudiesFundingsService,
    SuiveuseRepository,
    WorkFormService,
    GlobalProjectService,
    ObjectiveFormService,
    StudyDeadlinesService,
    ExpenseFormService,
    TravelFormService,
    ChargeTypeControlService,
    WorkingTimeResultsService,
    HolidayFormService,
    PlansChargesService,
  ]
})
export class ProjetModule { }
