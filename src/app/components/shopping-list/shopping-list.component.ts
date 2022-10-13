import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private subsciption: Subscription;
  ingredients: Ingredient[] = [];
  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients=this.shoppingService.getIngredients();
    this.subsciption= this.shoppingService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[])=>{
          this.ingredients=ingredients;
        }
      );
  }

  ngOnDestroy(): void {
      this.subsciption.unsubscribe();
  }

  onEditItem(idx:number){
    this.shoppingService.startedEditing.next(idx);
  }
}