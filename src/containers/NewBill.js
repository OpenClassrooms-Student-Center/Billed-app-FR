
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {

  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }

  // Fonction à modifier selon consignes
  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log("file", file.type)
    const filePath = e.target.value.split(/\\/g);
    console.log("file path", filePath);
    const fileName = filePath[filePath.length-1]
    console.log("file Name", fileName);
    const extension = fileName.split('.').pop();
    if(file.type !== "application/pdf"){
      console.log('bingo')
    }

  /*
    $http.post('/fetchBlobURL',{myParams}, {responseType: 'arraybuffer'})
   .success(function (data) {
       const file = new Blob([data], {type: 'application/pdf'});
       const fileURL = URL.createObjectURL(file);
       window.open(fileURL);
    
    });

    OU 

    $http({
      url: "...",
      method: "POST",
      responseType: "blob"
    }).then(function(response) {
      var fileURL = URL.createObjectURL(response.data);
      window.open(fileURL);
    });
  */


    // Bloquer les extensions différentes de JPG/JPEG/PNG
    function stopWrongExtension (){
      if(extension !== "jpg"){
        e.preventDefault();
        return false
      } else if(extension !== "JPG"){
        e.preventDefault();
        return false
      }else if(extension !== "jpeg"){
        e.preventDefault();
        return false
      }else if(extension !== "JPEG"){
        e.preventDefault();
        return false
      }else if(extension !== "png"){
        e.preventDefault();
        return false
      }else if(extension !== "PNG"){
        e.preventDefault();
        return false
      }
    }
    stopWrongExtension();
    
    this.firestore
      .storage
      .ref(`justificatifs/${fileName}`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.fileUrl = url
        this.fileName = fileName
      })
  }


  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
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