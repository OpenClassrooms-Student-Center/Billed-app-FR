import firebase from "../__mocks__/firebase"

// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I click on 'Nouvelle note de frais'", () => {
    test("Then it should POST a bill", async () => {
      const spy = jest.spyOn(firebase, "post")
      const bill = {
      // todo
      }
      const bills = await firebase.post(bill)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
  })

//  describe("When I submit a NewBill", () => {
 //   test("Then it should submit my email", () => {
   //   const email 
   // })
//  })
})