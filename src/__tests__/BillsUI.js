import { screen } from "@testing-library/dom"
import BillsUi from "../views/BillsUI"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage.js"


describe('Given I just logged in as Employee', () => {
    describe('When the page is loading', () => {
        it('Should display a loading circle', () => {
            const html = LoadingPage()
            document.body.innerHTML = html
            expect(screen.getByText('Loading...')).toBeTruthy()
        })
    })
    describe('When the server return an error', () => {
        it('Shoud display an error message', ()=> {
            const error = 'Erreur'
            const html = ErrorPage(error)
            document.body.innerHTML = html
            expect(screen.getAllByText(error)).toBeTruthy()
        })
    })
})