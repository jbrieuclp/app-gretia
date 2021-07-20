import { NgModule }             from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { AuthGuard } from '../../shared/guard/index';

import { ProjetInitComponent } from './projet-init.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProjetsComponent } from './components/projets/projets.component';
import { ProjetComponent } from './components/projets/projet/projet.component';
// import { MissionFormComponent } from './components/mission/form/mission-form.component';
// import { SListUserComponent } from './components/suiveuse/list-user/list-user.component';
// import { DashboardComponent } from './components/suiveuse/dashboard/dashboard.component';
// import { ProjetDisplayComponent } from './components/projet/display/display.component';
import { SuiveusesComponent } from './components/suiveuse/suiveuses.component';

import { SalariesComponent } from './components/admin/salarie/salaries.component';
import { AntennesComponent } from './components/admin/salarie/antennes/antennes.component';
import { FonctionsComponent } from './components/admin/salarie/fonctions/fonctions.component';
import { PersonnesComponent } from './components/admin/salarie/personnes/personnes.component';
import { AdminProjetComponent } from './components/admin/admin-projet/admin-projet.component';
import { RefProjectTypesComponent } from './components/admin/admin-projet/project-types/ref-project-types.component';
import { ChargeTypesComponent } from './components/admin/admin-projet/charge-type/charge-types.component';
import { LocalisationsComponent } from './components/admin/admin-projet/localisation/localisations.component';
import { TaskActionsComponent } from './components/admin/admin-projet/task-action/task-actions.component';
import { AvancementsComponent } from './components/admin/admin-projet/avancement/avancements.component';
import { ProjetAccueilComponent } from './components/accueil/accueil.component';
import { ConventionsComponent } from './components/conventions/conventions.component';
import { ConventionComponent } from './components/conventions/convention/convention.component';
import { PlansChargesComponent } from './components/plans-charges/plans-charges.component';

// routes definition
const routes: Routes = [
	{ 
		path: 'projet', 
		component: ProjetInitComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'plan-de-charges', pathMatch: 'full' },
			// { path: '', component: ProjetAccueilComponent, pathMatch: 'full' },
			{ path: 'projets', children: [
				{ path: '', component: ProjetsComponent, pathMatch: 'full'},
				{ path: ':projet', redirectTo: ':projet/', pathMatch: 'full' },
				{ path: ':projet/:onglet', component: ProjetComponent, pathMatch: 'full' },
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
			{ path: 'conventions', children: [
				{ path: '', component: ConventionsComponent, pathMatch: 'full' },
				{ path: 'nouvelle', component: ConventionComponent, pathMatch: 'full' },
				{ path: ':convention', component: ConventionComponent, pathMatch: 'full' },
				{ path: ':convention/:onglet', component: ConventionComponent, pathMatch: 'full' },
			// 	{ path: 'user/:person', children: [
			// 		{ path: '', component: CalendarComponent, pathMatch: 'full' },
			// 	//	{ path: 'missions', children: [ //TODO : affiche toutes les mission en tableau
				// ]}
			]},
			{ path: 'admin', children: [
				{ path: '', component: AdminComponent, pathMatch: 'full' },
				{ path: 'salaries', children: [
					{ path: '', component: SalariesComponent, pathMatch: 'full' },
					{ path: 'antennes', children: [
						{ path: '', component: AntennesComponent, pathMatch: 'full' },
						{ path: ':antenne', component: AntennesComponent, pathMatch: 'full' }
					]},
					{ path: 'fonctions', children: [
						{ path: '', component: FonctionsComponent, pathMatch: 'full' },
						{ path: ':fonction', component: FonctionsComponent, pathMatch: 'full' }
					]},
					{ path: 'personnes', children: [
						{ path: '', component: PersonnesComponent, pathMatch: 'full' },
						{ path: ':personne', component: PersonnesComponent, pathMatch: 'full' }
					]}
				]},
				{ path: 'projets', children: [
					{ path: '', component: AdminProjetComponent, pathMatch: 'full' },
					{ path: 'types', children: [
						{ path: '', component: RefProjectTypesComponent, pathMatch: 'full' },
						{ path: ':refProjectType', component: RefProjectTypesComponent, pathMatch: 'full' }
					]},
					{ path: 'charges', component: ChargeTypesComponent, pathMatch: 'full' },
					{ path: 'localisations', component: LocalisationsComponent, pathMatch: 'full' },
					{ path: 'actions', component: TaskActionsComponent, pathMatch: 'full' },
					{ path: 'avancements', component: AvancementsComponent, pathMatch: 'full' },
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