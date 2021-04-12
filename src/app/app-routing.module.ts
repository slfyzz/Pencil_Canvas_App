import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard,  redirectUnauthorizedTo} from '@angular/fire/auth-guard';

import { RedirectToHomePageGuard } from './redirect-to-home-page.guard';

import { LoginComponent } from './login/login.component';
import { CanvasComponent } from './canvas/canvas.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent, canActivate: [RedirectToHomePageGuard]},
  {path: 'canvas', component: CanvasComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
