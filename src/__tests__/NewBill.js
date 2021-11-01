import localStorageMock from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import ROUTES from "../constants/routes"
import NewBillUI from "../views/NewBillUI"
import NewBill from "../containers/NewBill"
import {screen, fireEvent} from "@testing-library/jest-dom"
import BillsUi from "../views/BillsUI"

// TODO DEBUGGER JEST SCREEN

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

  test("Then it should POST a bill but error 404", async () => {
    // mockImplementationOnce
    // SYNTAXE ()=>
    firebase.post.mockImplementationOnce(()=>
      // new error Promise Promise.reject
      Promise.reject(new Error('404 error'))
    )
    const html = BillsUi({ error: "404 error" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })
  test("It should add bill from an API and fails with 500 message error", async () => {
    firebase.post.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    )
    const html = BillsUi({ error: "500 error" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })
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
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const input = screen.getByTestId("file")
      // addEventListner change
      input.addEventListener('change', handleChangeFile)
      // fireEvent change
      fireEvent.change(input, {
        target: {
          files: [new File(["bill.png"], "bill.png", { type: "image/png" })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled();      
      expect(input.files[0].name).toBe("bill.png");
    })
  })

  describe("When I submit a bill but the file haven't a good extension", () => {
    test("It should not submit the form", () => {
      // TODO utiliser capiche localStorageMock
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = 'invalid'
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillform)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() 
    })
  })

  describe("When I submit a bill with a a good extension", () => {
    test("It should create a new bill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillform)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

})