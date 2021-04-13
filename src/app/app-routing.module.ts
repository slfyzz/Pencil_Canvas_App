import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard,  redirectUnauthorizedTo} from '@angular/fire/auth-guard';

import { RedirectToHomePageGuardIfAuth } from './redirect-to-home-page.guard';
import { CanAccessCanvasGuard } from './can-access-canvas.guard';

import { LoginComponent } from './login/login.component';
import { CanvasComponent } from './canvas/canvas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotfoundComponent } from './notfound/notfound.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [RedirectToHomePageGuardIfAuth]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AngularFireAuthGuard],
      data: { authGuardPipe: redirectUnauthorizedToLogin}},
  { path: 'canvas/:userID/:canvasID', component: CanvasComponent, canActivate: [CanAccessCanvasGuard]},

  // wrong path
  { path: '404', component: NotfoundComponent},
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
