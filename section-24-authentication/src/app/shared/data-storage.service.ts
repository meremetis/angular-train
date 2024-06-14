import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { exhaustMap, map, take, tap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { Subject } from "rxjs";
import { User } from "../auth/user.model";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://fewfew-58982-default-rtdb.europe-west1.firebasedatabase.app/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log("recopes");

        console.log(response);
      });
  }

  fetchRecipes() {
    // we subscribe and then we get only 1 value of the observable.
    // after it automatically unsubscribes.
    this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Recipe[]>(
          "https://fewfew-58982-default-rtdb.europe-west1.firebasedatabase.app/recipes.json"
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );

    // iw ant the observable bellow to use the value of the absorvable above.
    // i can do that by making those 2 observables into 1.
    //i can do that with exhaust map
    // it waits for the first observable to complete and then it gives us the value and then it returns a new observable.
  }
}
