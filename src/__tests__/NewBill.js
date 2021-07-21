import { getByLabelText, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { bills } from "../fixtures/bills"
import userEvent from '@testing-library/user-event'
import { fireEvent} from "@testing-library/dom"
import localStorage from "../__mocks__/localStorage"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import firestore from "../app/Firestore";
import BillsUI from "../views/BillsUI.js"





describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should load the form", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByLabelText('Type de dépense')).toBeTruthy();
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I update the justificatif file", () => {
  
      //const firebase = jest.fn()
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
  
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
    
      const firebase = jest.fn()

      const firestoreMock = {
        ref: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        put: jest.fn().mockResolvedValueOnce(),
      };
      
      //const firestore = null
      const firestore = {
        storage : firestoreMock
      }
      
      const newBillFromTest = new NewBill ({
        document, 
        onNavigate, 
        firestore,
        localStorage: window.localStorage
      })
     
      const handleChangeFile = jest.fn(newBillFromTest.handleChangeFile) 
      const changeFileBtn = screen.getByTestId('file')

      changeFileBtn.addEventListener('change', handleChangeFile)
      //userEvent.click(changeFileBtn)
      //fireEvent.change(changeFileBtn, {
      fireEvent.change(changeFileBtn, {
        target: {
          files: [new File(['chucknorris.png'], 'chucknorris.png', { type: 'image/png' })],
        },
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(changeFileBtn.files[0].name).toBe("chucknorris.png");
    })
  })
})



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I try to submit a new bill", () => { 
    test("then extension of the justificatif is different of JPG or PNG", () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      const newBillFromTest = new NewBill ({
        document, 
        onNavigate, 
        firestore,
        localStorage: window.localStorage
      })
      newBillFromTest.fileType = "Application/pdf"

      const handleSubmitNewBill = jest.fn(newBillFromTest.handleSubmit) 
      const submitBtnNewBill = screen.getByTestId('btn-send-bill')

      submitBtnNewBill.addEventListener('submit', handleSubmitNewBill)
      //userEvent.click(changeFileBtn)
      //fireEvent.change(changeFileBtn, {

      expect(handleSubmitNewBill).toHaveBeenCalled()
      expect(screen.getAllByText("Envoyer")).toBeTruthy();
 
    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and i have just finished to fill the form", () => {
    test("Then all is correct and I submit my new bill", () => {
      
      //jest.mock('./dependecy', () => jest.fn());
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      const firestore = null
      const newBillTest = new NewBill ({
        document, 
        onNavigate, 
        firestore, 
        localStorage: window.localStorage
      })
      //console.log(newBillTest)
      const submitButton = screen.getByTestId("btn-send-bill")
      const handleSubmit = jest.fn(newBillTest.handleSubmit)
      submitButton.addEventListener("submit", handleSubmit)
      
      fireEvent.submit(submitButton)

      expect(handleSubmit).toHaveBeenCalled()
      //const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      //expect(bigBilledIcon).toBeTruthy()
    })
  })
})




// test d'intégration POST
describe("Given I am a user connected as an Employees", () => {
  describe("When I fill a new bill", () => {
    test("fetches new bill to mock API Post", async () => {
          
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches new bill from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() => Promise.reject(new Error("Erreur 404")))
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() => Promise.reject(new Error("Erreur 500")))
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
