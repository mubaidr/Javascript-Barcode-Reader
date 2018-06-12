import { decoder } from '../src'

const buttons = document.getElementsByTagName('button')

for (let i = 0; i < buttons.length; i += 1) {
  const button = buttons[i]
  console.log(button)
}

console.log(decoder)
