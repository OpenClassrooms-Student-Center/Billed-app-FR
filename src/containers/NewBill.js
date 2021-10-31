
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    // binded localStorage
    this.localStorage = localStorage
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    // FIXED : [Bug Hunt] - Bills : fileName should be only jpg jpeg or png
    // split pour check extension
      const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
      const fileExtension = file.name.split('.').pop();
      const acceptedExtensionsRegex = /(png|jpg|jpeg)/g;
      if (fileExtension.match(acceptedExtensionsRegex)) {
        const filePath = e.target.value.split(/\\/g)
        const fileName = filePath[filePath.length-1]
        this.firestore
          .storage
          .ref(`justificatifs/${fileName}`)
          .put(file)
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            this.fileUrl = url
            this.fileName = fileName
          })
      } else {
        document.querySelector(`input[data-testid='file']`).value = null;
        alert('Votre fichier doit être un png, jpg ou jpeg.')
      }

    /*
    handleChangeFile = (e) => {
        const file = this.document.querySelector(`input[data-testid='file']`).files[0];
        const extensionCheck = /(png|jpg|jpeg)/g;
        const extension = file.name.split('.').pop();

        if (extension.toLowerCase().match(extensionCheck)) {
          document.getElementById('errorFileType').classList.add('hideErrorMessage');
          const filePath = e.target.value.split(/\\/g);
          const fileName = filePath[filePath.length - 1];

          this.firestore
            .storage
            .ref(`justificatifs/${fileName}`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
              this.fileUrl = url
              this.fileName = fileName
            });


        } else {
          document.getElementById('errorFileType').classList.remove('hideErrorMessage');
          this.document.querySelector(`input[data-testid='file']`).value = null;
        };
    */
}





  handleSubmit = e => {
    e.preventDefault()
    console.log(e.target.querySelector(`input[data-testid="datepicker"]`).value, e.target.querySelector(`input[data-testid="datepicker"]`).value)
    console.log(JSON.parse(localStorage.getItem("user")).email)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}