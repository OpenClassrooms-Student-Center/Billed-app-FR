import { screen } from "@testing-library/dom"
import VerticalLayout from "../views/VerticalLayout"
import { localStorageMock } from "../__mocks__/localStorage.js"

// Add unit tests to obtain 100% of branch coverage for VerticalLayout
// describe('Given I am not connected as an Employee', () => {
//   test("Then Icons should not be rendered", () => {
//     Object.defineProperty(window, 'localStorage', { value: localStorageMock })

//     const user = JSON.stringify({
//       type: 'Admin'
//     })
  
//     localStorage.setItem('user', user)
//     const html = VerticalLayout(120)
//     document.body.innerHTML = html
//     expect(screen.queryByTestId('icon-window')).toBeNull()
//     expect(screen.queryByTestId('icon-mail')).toBeNull()
//   })
// })
describe('Given I am connected as Employee', () => {
  test("Then Icons should be rendered", () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    const user = JSON.stringify({
      type: 'Employee'
    })
    window.localStorage.setItem('user', user)
    const html = VerticalLayout(120)
    document.body.innerHTML = html
    expect(screen.getByTestId('icon-window')).toBeTruthy()
    expect(screen.getByTestId('icon-mail')).toBeTruthy()
  })

})
