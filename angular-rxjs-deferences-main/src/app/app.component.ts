import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { SubjectsService } from './subjects.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [SubjectsService]
})
export class AppComponent implements OnInit {
  constructor(private subjectsService: SubjectsService) {}
  // Normal subject
  sourceSubject = new Subject<string>();

  // The subscriber of behaviorSubject gets either the default or the last published value.
  // Behavioral subject accepts a default value.
  behaviorSubject = new BehaviorSubject<string>('default value for behavior subject');


  // The replace subject gets the last published 'values'.
  // notice 'values' it is plural which mains they are many values.
  // the replace subject accepts a buffer size which is a number of items to keep in the memory.
  // for example new ReplaySubject<string>(2); -> which means it will keep in memory 2 values.
  // for example new ReplaySubject<string>(1); -> which means it will keep in memory 1 values.
  replaceSubjectSource = new ReplaySubject<string>(2);


  // All subscribers of async subjects
  // Get the last published value after the call of .complete()
  asyncSubject = new AsyncSubject<number>();

  title: string = 'Proof of concept - async subject';

  // The caller of our demonstration methods.
  ngOnInit() {
    // normal behavior
    // this.subjectsService.handleSubject(this.sourceSubject)

    // default value or last value - and normal behavior
    // this.subjectsService.handleBehavioralSubject(this.behaviorSubject);

    // last values based on buffer size, subscriber has to complete with all values before the other subscriber take over. - normal behavior
    // this.subjectsService.handleReplaySubject(this.replaceSubjectSource);

    // gets the last value before calling complete method, ignores the next next methods and completes
    this.subjectsService.handleAsyncSubject(this.asyncSubject);
  }
}
