import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export class SubjectsService {

  /*
   * This method demonstrates the normal subject behavior.
   */
  public handleSubject(sourceSubject: Subject<string>) {
    // If we publish a new value before subscribing to the subject, then the new value will not be emitted.
    // We wont see the new value. in console.log(value)
    sourceSubject.next('demo value');

    sourceSubject.subscribe((value) => {
      console.log('obs-1', value);
    });
    sourceSubject.subscribe((value) => {
      console.log('obs-2', value);
    });

    // Only when we emit a new value after subscribing, we will see the new value on log(value).
    sourceSubject.next('default value');
  }

  /*
   * This method demonstrates the behavior subject behavior.
   */
  public handleBehavioralSubject(behaviorSubject: BehaviorSubject<string>) {
    // The behavioral subject does an emit on start with the default published value
    // If i publish an other value before the subscription then it will override the default published value.

    // if before the subscription we publish 2 values the the subscription will keep the last published value
    // in this case it will keep the "'published value b'".
    behaviorSubject.next('published value a');
    behaviorSubject.next('published value b');

    behaviorSubject.subscribe((value) => {
      console.log('obs-1', value);
    });
    behaviorSubject.subscribe((value) => {
      console.log('obs-2', value);
    });

    // if i publish a value after the subscription then
    // then both subscribers will get this value like they would on the normal subject.
    behaviorSubject.next('new value 1');

    // after they both ge the value then on the next subscription both will get the new value
    behaviorSubject.next('new value 2');
  }

  /**
   * This method demonstrates the replace subject behavior
   */
  public handleReplaySubject(
    replaceSubjectSource: ReplaySubject<string>
  ): void {
    // Since it takes the last 2 values it will print on console the last 2 values.
    // in this case value 2 and value 3
    // the first subscription will do 2 logs because the buffer is of size 2.
    // and the values will be the last 2.

    // when the first subscription is over then
    // the second will do 2 logs because of the buffer size "2"
    // and it will log the last 2 values as well.

    replaceSubjectSource.next('value 1');
    replaceSubjectSource.next('value 2');
    replaceSubjectSource.next('value 3');

    replaceSubjectSource.subscribe((value) => {
      console.log('obs-1', value);
    });
    // only after the first subscription is over then the second will do 2 logs
    // so we expect to see
    // obs-1 value 2 and value 3 (last 2 values)
    // and only after fist subscription is over on both values we will see
    // obs-2 value 2 and value 3 (last 2 values)
    replaceSubjectSource.subscribe((value) => {
      console.log('obs-2', value);
    });

    // after that any publish of value it will behave like the normal subscription.
    // which mean if i publish value 4 then both subscriber will get the value
    // obs-1 value 4
    // obs-2 value 4

    // if i publish value 5 both subscribers will get value 5.
    // obs-1 value 5
    // obs-2 value 5
    replaceSubjectSource.next('value 4');
    replaceSubjectSource.next('value 5');
  }

  /*
   * This method demonstrates the async subject
   */
  public handleAsyncSubject(asyncSubject: AsyncSubject<number>) {
    asyncSubject.next(100);
    asyncSubject.next(200);
    asyncSubject.next(300);

    // but in order to do so we have to call the complete function
    asyncSubject.complete();

    // if i emit any other value after the complete function it will be ignored
    asyncSubject.next(400); // it will be ignored

    asyncSubject.complete(); // if i call complete method after i have called it again then it will be ignored.

    // it is going to emit the last emitted value to all subscribers
    // both subscribers get value 300
    asyncSubject.subscribe((value) => {
      console.log('obs-1', value);
    });

    asyncSubject.subscribe((value) => {
      console.log('obs-2', value);
    });

    // if i call the complete method after the subscribers it will do the same thing.
    // asyncSubject.complete();
    asyncSubject.next(400); // it will be ignored
  }
}
