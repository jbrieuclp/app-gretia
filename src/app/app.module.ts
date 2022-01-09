import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found.component';
import { JwtModule } from '@auth0/angular-jwt'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/auth/token.interceptor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

//modules
import { SharedModule } from './shared';
import { LoginModule } from './modules/login/login.module';
import { AccueilModule } from './modules/accueil/accueil.module';
import { MagicTaxrefModule } from './modules/magic-taxref/magic-taxref.module';
import { ProjetModule } from './modules/projet/projet.module';
import { CartoModule } from './modules/carto/carto.module';
import { ImportModule } from './modules/import/import.module';

//services
import { AuthService } from './shared';
import { AuthGuard } from './shared';

//components
import { AppComponent } from './app.component';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['vps559502.ovh.net']
      }
    }),
    MatSidenavModule,
    MatCheckboxModule,
    SharedModule,
    LoginModule,
    AccueilModule,
    MagicTaxrefModule,
    ProjetModule,
    CartoModule,
    ImportModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard
  ],
  exports: [
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
