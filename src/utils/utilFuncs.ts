export const IntToRGB = (num:number) => {
  return `rgb(${(num>>16)%256}, ${(num>>8)%256}, ${num%256})`
}