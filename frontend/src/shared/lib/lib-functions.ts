export const unixToDate = (unixDate: string) => {
  return new Date(unixDate).toLocaleDateString('ru')
}
