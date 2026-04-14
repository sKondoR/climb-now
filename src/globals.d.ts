declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// For side-effect only imports
declare module '*.css' {
  const content: void;
  export default content;
}