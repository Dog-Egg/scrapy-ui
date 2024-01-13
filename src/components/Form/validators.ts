export function required(message: string = "This field is required.") {
  return (value: any) => {
    if (!value || !value.trim()) {
      throw Error(message);
    }
  };
}
