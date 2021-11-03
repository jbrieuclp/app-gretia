import { NgModule }             from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { AuthGuard } from '../../shared/guard/index';

import { ProjetInitComponent } from './projet-init.component';
import { AdminComponent } from './components/admin/admin.component';
import { StudiesComponent } from './components/studies/studies.component';
import { StudyComponent } from './components/studies/study/study.component';
// import { MissionFormComponent } from './components/mission/form/mission-form.component';
// import { SListUserComponent } from './components/suiveuse/list-user/list-user.component';
// import { DashboardComponent } from './components/suiveuse/dashboard/dashboard.component';
// import { ProjetDisplayComponent } from './components/projet/display/display.component';
import { SuiveusesComponent } from './components/suiveuse/suiveuses.component';

import { EmployeesComponent } from './components/admin/employees/employees.component';
import { AntennesComponent } from './components/admin/employees/antennes/antennes.component';
import { FunctionsComponent } from './components/admin/employees/functions/functions.component';
import { PersonsComponent } from './components/admin/employees/persons/persons.component';
import { AdminProjetComponent } from './components/admin/admin-projet/admin-projet.component';
import { FundingTypeRefsComponent } from './components/admin/admin-projet/funding-types/funding-type-refs.component';
import { ChargeTypesComponent } from './components/admin/admin-projet/charge-type/charge-types.component';
import { LocalisationsComponent } from './components/admin/admin-projet/localisation/localisations.component';
import { ActionCategoriesComponent } from './components/admin/admin-projet/action-categories/action-categories.component';
import { ProjetAccueilComponent } from './components/accueil/accueil.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectComponent } from './components/projects/project/project.component';
import { PlansChargesComponent } from './components/plans-charges/plans-charges.component';
import { CumulSuiveusesComponent } from './components/admin/syntheses/cumul-suiveuses/cumul-suiveuses.component';

// routes definition
const routes: Routes = [
	{ 
		path: 'projet', 
		component: ProjetInitComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'plan-de-charges', pathMatch: 'full' },
			// { path: '', component: ProjetAccueilComponent, pathMatch: 'full' },
			{ path: 'etudes', children: [
				{ path: ':study', redirectTo: ':study/', pathMatch: 'full' },
				{ path: ':study/:onglet', component: StudyComponent, pathMatch: 'full' },
			]},
			{ path: 'plan-de-charges', children: [
				{ path: '', component: PlansChargesComponent, pathMatch: 'full' },
				{ path: ':person', component: PlansChargesComponent, pathMatch: 'full' },
				{ path: ':person/:year', component: PlansChargesComponent, pathMatch: 'full' },
			]},
			// { path: 'mission', children: [
			// //	{ path: 'info', component: MissionFormComponent, pathMatch: 'full' } //TODO: Detail
			// 	{ path: ':mission', component: MissionFormComponent, pathMatch: 'full' }
			// ]},
			// { path: 'suiveuses', component: SListUserComponent, pathMatch: 'full'},
			{ path: 'suiveuse', children: [
				{ path: '', component: SuiveusesComponent, pathMatch: 'full' },
			// 	{ path: 'user/:person', children: [
			// 		{ path: '', component: CalendarComponent, pathMatch: 'full' },
			// 	//	{ path: 'missions', children: [ //TODO : affiche toutes les mission en tableau
				// ]}
			]},
			{ path: 'projets', children: [
				{ path: '', component: ProjectsComponent, pathMatch: 'full' },
				{ path: 'nouveau', component: ProjectComponent, pathMatch: 'full' },
				{ path: ':project', redirectTo: ':project/', pathMatch: 'full' },
				{ path: ':project/:onglet', component: ProjectComponent, pathMatch: 'full' },
			// 	{ path: 'user/:person', children: [
			// 		{ path: '', component: CalendarComponent, pathMatch: 'full' },
			// 	//	{ path: 'missions', children: [ //TODO : affiche toutes les mission en tableau
				// ]}
			]},
			{ path: 'admin', children: [
				{ path: '', component: AdminComponent, pathMatch: 'full' },
				{ path: 'salaries', children: [
					{ path: '', component: EmployeesComponent, pathMatch: 'full' },
					{ path: 'antennes', children: [
						{ path: '', component: AntennesComponent, pathMatch: 'full' },
						{ path: ':antenne', component: AntennesComponent, pathMatch: 'full' }
					]},
					{ path: 'fonctions', children: [
						{ path: '', component: FunctionsComponent, pathMatch: 'full' },
						{ path: ':function', component: FunctionsComponent, pathMatch: 'full' }
					]},
					{ path: 'personnes', children: [
						{ path: '', component: PersonsComponent, pathMatch: 'full' },
						{ path: ':person', component: PersonsComponent, pathMatch: 'full' }
					]}
				]},
				{ path: 'projets', children: [
					{ path: '', component: AdminProjetComponent, pathMatch: 'full' },
					{ path: 'types-financement', children: [
						{ path: '', component: FundingTypeRefsComponent, pathMatch: 'full' },
						{ path: ':fundingTypeRef', component: FundingTypeRefsComponent, pathMatch: 'full' }
					]},
					{ path: 'charges', component: ChargeTypesComponent, pathMatch: 'full' },
					{ path: 'localisations', component: LocalisationsComponent, pathMatch: 'full' },
					{ path: 'actions', component: ActionCategoriesComponent, pathMatch: 'full' },
				]},
				{ path: 'suiveuses', children: [
					{ path: '', component: CumulSuiveusesComponent, pathMatch: 'full' },
				]}
				// { path: 'organisme', component: OrganismeComponent, pathMatch: 'full' },
				// { path: 'categorie', component: CategorieComponent, pathMatch: 'full' },
				// { path: 'etat', component: EtatComponent, pathMatch: 'full' },
			]}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class ProjetRoutingModule { }