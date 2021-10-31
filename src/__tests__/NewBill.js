import firebase from "../__mocks__/firebase"
import ROUTES from "../constants/routes"
import NewBillUI from "../views/NewBillUI"
import NewBill from "../containers/NewBill"

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, and I create a new bill", () => {
    test("Then it should POST a bill", async () => {
      const spy = jest.spyOn(firebase, "post")
      const bill = { }
      const bills = await firebase.post(bill)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
  })

  // test("Then it should POST a bill but error 404")

})

// Test a NewBill
describe("Given I am connected as an employee", () => {
  describe("When I upload a supporting file", () => {
    test("Then it should have been uploaded", () => {
      Object.defineProperty(window, 'localStorage', {value: localStorage})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      // TODO detailler onNavigate
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES ({pathname})
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      // https://jestjs.io/docs/mock-functions#using-a-mock-function

    })
  })
})