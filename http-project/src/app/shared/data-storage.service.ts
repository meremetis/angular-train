import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';


// because it gets injected the http service it needs to be injectable
@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeServiceL: RecipeService
  ) {}

  storeRecipes() {
    const recipes: Recipe[] = this.recipeServiceL.getRecipes();
    this.http
      .put(
        'https://http-course-project-5cbf3-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://http-course-project-5cbf3-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeServiceL.setRecipes(recipes);
        })
      )
  }
}
