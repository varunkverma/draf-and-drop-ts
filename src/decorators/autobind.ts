namespace App {
  // Autobind decorator
  export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const orirginalMethod = descriptor.value;

    const newPropertyDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFunction = orirginalMethod.bind(this);
        return boundFunction;
      },
    };
    return newPropertyDescriptor;
  }
}
