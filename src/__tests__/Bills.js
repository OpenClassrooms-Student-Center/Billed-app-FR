import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { contains } from "jquery"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Bills from "../containers/Bills.js"
import firebase from "../__mocks__/firebase.js"
import userEvent from "@testing-library/user-event";
import Actions from "../views/Actions.js"
import Router  from "../app/Router.js"
import Firestore from "../app/Firestore"
import VerticalLayout from "../views/VerticalLayout"



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout (verticalLayout(120) should be highlighted", () => {
    
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });
      const rootDiv = `<div id='root'></div>`
      const pathname = ROUTES_PATH["Bills"]
      Object.defineProperty(window, "location", { value: { hash: pathname } })
      document.body.innerHTML = rootDiv
      Router()

      expect(screen.getByTestId('icon-window').classList.contains("active-icon")).toBeTruthy()
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




// Bills container 
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

    expect(handleClickNewBill).toHaveBeenCalled()
    expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
  })
})




describe('Given I am connected  on bills page as an employees', () => {
  test('Then, I can click on all eyeIcon', () => {
    const url = '/fake_url'
    const html = BillsUI({data: bills})
    document.body.innerHTML = html

    const onNavigate = (pathname) => {
      //document.body.innerHTML = ROUTES({ pathname })
    }
    const firestore = null

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    $.fn.modal = jest.fn();

    const bill = new Bills({
      document, onNavigate, firestore, bills, localStorage: window.localStorage
    })

    const handleClickIconEye = jest.fn() 
    bill.handleClickIconEye = handleClickIconEye  

    /*
    iconEye.addEventListener('click', handleClickIconEye)
    userEvent.click(iconEye)
    */
    const iconEye = screen.getAllByTestId("icon-eye")[0]
    fireEvent.click(iconEye)

    expect(handleClickIconEye).toHaveBeenCalled()
  })
})




describe('Given I am connected  on bills page as an employee ', () => {
  describe('When I click on the icon eye', () => {
    test('A modal should open with a picture of a bill', () => {
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
      
      const eyeBtn = screen.getByTestId('modaleFile')
      const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(eyeBtn));
      eyeBtn.addEventListener('click', handleClickIconEye)
     
      userEvent.click(eyeBtn)
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
