import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { ListsComponent } from './components/lists/lists.component'
import { MembersDetailsComponent } from './components/members/members-details/members-details.component'
import { MembersListComponent } from './components/members/members-list/members-list.component'
import { MessagesComponent } from './components/messages/messages.component'
import { NotFoundComponent } from './error/not-found/not-found.component'
import { ServerErrorComponent } from './error/server-error/server-error.component'
import { TestErrorComponent } from './error/test-error/test-error.component'
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'testerrors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MembersListComponent },
      { path: 'members/:id', component: MembersDetailsComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
