import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { contains } from "jquery"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Bills from "../containers/Bills.js"
import firebase from "../__mocks__/firebase.js"
import userEvent from "@testing-library/user-event";


// BILLS UI
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {

      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      const html = BillsUI(bills)
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
      const firestore = null

      const bill = new Bills({document, onNavigate, firestore, bills, localStorage: window.localStorage})
      
      expect(screen.getByTestId('icon-window').classList.contains("active-icon")).toBe(true)
      
  
    })



    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('When I am on Bills page but it is loading', () => {
  test('Then, Loading page should be rendered', () => {
    const html = BillsUI({ loading: true })
    document.body.innerHTML = html
    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })
})


describe('When I am on Bills page but back-end send an error message', () => {
  test('Then, Error page should be rendered', () => {
    const html = BillsUI({ error : true})
    document.body.innerHTML = html

    expect(screen.getAllByText('Erreur')).toBeTruthy()
  })
})



// BILLS 
describe('When I am on Bills page and I on the button new Bill', () => {
  test('Then, I should be send to New Bill', () => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const html = BillsUI(bills)
    document.body.innerHTML = html
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const firestore = null
    const newbill = new Bills({
      document, onNavigate, firestore, bills, localStorage: window.localStorage
    })

    const handleClickNewBill = jest.fn(newbill.handleClickNewBill)
    const goToNewBill = screen.getByTestId("btn-new-bill")
    goToNewBill.addEventListener('click', handleClickNewBill)
    fireEvent.click(goToNewBill)

    expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
  })
})



describe('Given I am connected  on bills page as an employees ', () => {
  describe('When I click on the icon eye ', () => {
    test('A modal should open', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI(bills)
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      const bill = new Bills({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(eye));

      const eye = screen.getByTestId('modaleFile')
      eye.addEventListener('click', handleClickIconEye)
     
      userEvent.click(eye)
      //fireEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
      

      // Récuperer des éléments dans actions.js
    })
  })
})





// test d'intégration GET
describe("Given I am a user connected as an Employee", () => {
  describe("When I navigate to Bill", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
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
