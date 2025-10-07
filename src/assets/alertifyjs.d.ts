declare module 'alertifyjs' {
  interface Alertify {
    alert(message: string): void;
    confirm(message: string, okCallback?: () => void, cancelCallback?: () => void): void;
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    message(message: string): void;
  }

  const alertify: Alertify;
  export = alertify;
}