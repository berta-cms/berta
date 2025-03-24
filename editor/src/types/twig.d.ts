declare module '*.twig' {
  const template: (variables?: object) => string;
  export = template;
}
