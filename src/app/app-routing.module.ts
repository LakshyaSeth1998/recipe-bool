import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth/auth.component';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './components/recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './components/recipes/recipe-start/recipe-start.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { RecipesResolverService } from './services/recipes-resolver.service';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  {path: '', redirectTo:'recipes', pathMatch: 'full'},
  {path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
    {path:'', component: RecipeStartComponent},
    {path:'new', component: RecipeEditComponent},
    {path:':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
    {path:':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService]}
  ]},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
