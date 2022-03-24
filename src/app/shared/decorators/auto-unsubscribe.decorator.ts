import { ObjectUnsubscribedError } from 'rxjs';

export function AutoUnsubscribe(options: { subscriptionsArray: string } = { subscriptionsArray: 'subscriptions' }) {
    const doUnsubscribe = (object: object|Array<any>) => {
        for (const propName in object) {
            if (object.hasOwnProperty(propName)
                && !!object[propName]
                && typeof object[propName].unsubscribe === 'function') {
                try {
                    object[propName].unsubscribe();
                } catch (e) {
                    // omit already cleaned up subscriptions
                    if (!(e instanceof ObjectUnsubscribedError)) {
                        throw e;
                    }
                }
            }
        }
    };

    return function (constructor) {
        const orig = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function () {
            // tslint:disable:no-invalid-this
            doUnsubscribe(this);
            if (options.subscriptionsArray
             && this.hasOwnProperty(options.subscriptionsArray)
             && this[options.subscriptionsArray] instanceof Array) {
                doUnsubscribe(this[options.subscriptionsArray]);
                delete this[options.subscriptionsArray];
            }
            if (orig && typeof orig === 'function') {
                orig.apply(this);
            }
            // tslint:enable:no-invalid-this
        };
    };
}
