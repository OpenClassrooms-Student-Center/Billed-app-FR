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
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const firestoreMock = {
        ref: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        put: jest.fn().mockImplementation(() => Promise.resolve({ ref: {getDownloadURL: () => Promise.resolve()} })),
      };

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

      const changeFileBtn = screen.getByTestId('file')
      fireEvent.change(changeFileBtn, {
        target: {
          files: [new File(['chucknorris.pdf'], 'chucknorris.pdf', { type: 'application/pdf' })],
        },
      })

      const handleSubmitNewBill = jest.fn(newBillFromTest.handleSubmit)
      const submitBtnNewBill = screen.getByTestId('btn-send-bill')

      submitBtnNewBill.addEventListener('submit', handleSubmitNewBill)
      fireEvent.submit(submitBtnNewBill)

      expect(handleSubmitNewBill).toHaveBeenCalled()
      expect(screen.getAllByText("Vous devez choisir un fichier en JPEG, JPG, ou PNG.")).toBeTruthy();

    })
  })
})


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and i have just finished to fill the form", () => {
    test("Then all is correct and I submit my new bill", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = jest.fn((pathname) => {})
      const firestoreMock = {
        ref: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        put: jest.fn().mockImplementation(() => Promise.resolve({ ref: {getDownloadURL: () => Promise.resolve()} })),
      };

      const firestore = {
        storage : firestoreMock
      }
      const createBill = jest.fn()
      const newBillTest = new NewBill ({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      newBillTest.createBill = createBill;
      const submitForm = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBillTest.handleSubmit)
      submitForm.addEventListener("submit", handleSubmit)
      const changeFileBtn = screen.getByTestId('file')
      fireEvent.change(changeFileBtn, {
        target: {
          files: [new File(['chucknorris.png'], 'chucknorris.png', { type: 'image/png' })],
        },
      })

      fireEvent.submit(submitForm)

      expect(handleSubmit).toHaveBeenCalled();
      expect(createBill).toHaveBeenCalled();
      expect(onNavigate).toHaveBeenCalledWith('#employee/bills');
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