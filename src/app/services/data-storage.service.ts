import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { RecipeService } from "./recipe.service";
import { Recipe } from '../models/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http:HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService){}

    storeRecipes(){
      const recipes=this.recipeService.getRecipes();
      this.http.
      put('https://recipe-book-project-25412-default-rtdb.firebaseio.com/recipes.json',recipes)
      .subscribe(res=>{
          console.log(res);
      });
  }

  fetchRecipes(){
      return this.http
      .get<Recipe[]>('https://recipe-book-project-25412-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe =>{
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
          });
        }),
        tap(recipes=>{
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
