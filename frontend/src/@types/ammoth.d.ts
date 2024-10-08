declare module 'mammoth' {
  interface ConvertResult {
    value: string; // HTML result
    messages: Array<any>; // could be an array of messages or warnings
  }

  const convertToHtml: (input: any) => Promise<ConvertResult>;
  export { convertToHtml };
}
