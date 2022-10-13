import {  Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { DataStorageService } from './data-storage.service';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes:Recipe[]=[
  //   new Recipe(
  //     'Test Recipe',
  //     'Add one spoon of ....',
  //     'https://i3.wp.com/foodfolksandfun.net/wp-content/uploads/2018/01/Taquitos.jpg',
  //     [
  //       new Ingredient('Meat',1),
  //       new Ingredient('French Fries',20)
  //     ]),
  //     new Recipe(
  //       'Test Recipe2',
  //       'Add one spoon of ....',
  //       'https://i3.wp.com/foodfolksandfun.net/wp-content/uploads/2018/01/Taquitos.jpg',
  //       [
  //         new Ingredient('Meat',1),
  //         new Ingredient('French Fries',20)
  //       ]),
  // ];

  private recipes: Recipe[]=[];

  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]){
    this.recipes=recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index:number){
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe:Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index:number,newRecipe:Recipe){
    this.recipes[index]=newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index:number){
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
