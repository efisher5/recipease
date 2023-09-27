// Ensures CSS modules are playing nicely with TypeScript
// Also needed to install @types/css-modules package
declare module '*.module.css' {
    const classes: {readonly [key: string]: string};
    export default classes;
}