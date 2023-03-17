import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PollInfoComponent } from './components/poll-info/poll-info.component';
import { ShowCertificateComponent } from './components/show-certificate/show-certificate.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:pollId', component: PollInfoComponent, canActivate: [AuthGuard] },
  { path: 'certificate/:pollId', component: ShowCertificateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}