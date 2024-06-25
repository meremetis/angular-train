import { NgFor } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  standalone: true,
  imports: [NgFor],
})
export class SignalsComponent {
  actions = signal<String[]>([]);
  counter = signal<number>(0);

  // computed exist to help us produce values that depend on other signal values.
  // when ever the value of counter changes then and only then it calulates the doubleCounter.
  doubleCounter = computed(() => {return this.counter() * 2})

  constructor() {
    // effect is like watcher in vue.js
    // the idea behind effect is to run code when ever a signal changes. not to produce new values like computed.
    // the effect's callback function executed when ever any signal being passed inside (this.counter) changes.
    effect(() => {
      console.log("counter changed", this.counter());
    });
  }

  increment() {
    // set simple set a new value.
    // this.counter.set(2);

    // if i want to use set but get access to the previous value, then i can...
    // executing signal as a function i ge tits value.
    this.counter.set(this.counter() + 1)

    // mutate was was removed from angular for 17+
    // mutate was meant to be used for values that can be mutated for example array.
    // for example is number you cant use it because you can override a existing value but you cant change an existing one.
    this.actions.mutate((oldActionsArray)=> {
      return oldActionsArray.push('Increment');
    });


    // update takes the old value and uses it to calculate a new value.
    // this.counter.update((oldCounter: number) => {
    //   return oldCounter + 1;
    // })
    // this.actions.push('INCREMENT');

  }

  decrement() {
    this.counter.update((oldCounter: number) => {
      return oldCounter - 1;
    })

    this.actions.update((oldActionsArray) => {
       return [...oldActionsArray, 'DECREMENT']
    })
    // this.actions.push('DECREMENT');
  }
}
