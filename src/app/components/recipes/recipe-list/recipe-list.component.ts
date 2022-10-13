import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes:Recipe[]=[];
  subscription:Subscription;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipes=this.recipeService.getRecipes();
    this.subscription=this.recipeService.recipesChanged
      .subscribe(
        (recipes:Recipe[])=>{
          this.recipes=recipes;
        }
      );
  }

  onRecipeSelected(recipe: Recipe){
    this.recipeWasSelected.emit(recipe);
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
