const Modal = {
  open(){
    document.querySelector('.modal-overlay')
    .classList
    .add('active')
  },
  close(){
    document.querySelector('.modal-overlay')
    .classList
    .remove('active')
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },

  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

/* estrutura inicial
const Transaction = {
  all: [
    {
      description: 'Luz',
      amount: -50001,
      date: '23/02/2021'
    },
    {
      description: 'Website',
      amount: 500000,
      date: '23/02/2021'
    },
    {
      description: 'Internet',
      amount: -20012,
      date: '23/02/2021'
    },
    {
      description: 'App',
      amount: 200000,
      date: '23/02/2021'
    },
  ],
*/

const Transaction = {
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction)

    App.reload();
  },

  remove(index){
    Transaction.all.splice(index, 1)

    App.reload()
  },
  
  incomes(){
    let income = 0;
    Transaction.all.forEach(transaction => {

      if(transaction.amount > 0) {
        income +=  transaction.amount
      }
    })

    return income;
  },

  expenses(){
    let expense = 0
    Transaction.all.forEach(transaction => {

      if(transaction.amount < 0 ){
        expense += transaction.amount
      }
    })

    return expense;
  },

  total(){
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index //o tr esta recebendo o index

    DOM.transactionContainer.appendChild(tr);

  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
          <td class="description">${transaction.description}</td>
          <td class=${CSSclass}>${amount}</td>
          <td class="date">${transaction.date}</td>
          <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Saida de valor">
          </td>
    `
    return html;
  },

  updateTransaction() {
     document.getElementById('displayBalance')
     .innerHTML = Utils.formatCurrency(Transaction.incomes())
     
     document.getElementById('displayExpense')
     .innerHTML = Utils.formatCurrency(Transaction.expenses())
     
     document.getElementById('displayTotal')
     .innerHTML = Utils.formatCurrency(Transaction.total())
    

  },

  clearTransactions(){
    DOM.transactionContainer.innerHTML = ""
  },
}

const Utils = {
    formatAmount(value){
      return value = Number(value) * 100
    },

    formatDate(date){
      const splittedDate = date.split("-")
      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` // defino as posição para formatar a data

    },

    formatCurrency(value) {
      const signal = Number(value) < 0 ? "-" : "";

      value = String(value).replace(/\D/g, "") /* nesse regex pego tudo que não for número e troco por vazio */

      value = Number(value) / 100 //hack para trabalhar com casas decimais

      value = value.toLocaleString("pt-BR", { 
        style: "currency",
        currency: "BRL"
      })

    return signal + value
  }
}

const Form = {

  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields(){
     const {description, amount, date} = Form.getValues();

     if( description.trim() === "" || 
         amount.trim() === "" ||
         date.trim() === "" ){
          throw new Error("Por favor, preencha todos os campos")
         }
  },

  formatValues(){
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }

  },

  clearFields(){
    // let {description, amount, date} = Form.getValues();
    // description = ""
    // amount = ""
    // date = ""

    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event){
    event.preventDefault();

    try {
      /* validar todos os campos */
      Form.validateFields();

      /* Formatar dados transação para salvar */
      const transaction = Form.formatValues();
      
      /* salvar transação */
      Transaction.add(transaction)

      /* limpar formulário */
      Form.clearFields()

      /* Fechar Modal */
      Modal.close()

    } catch (error) {
      alert(error.message)
    }
  }
}


const App = {
  init(){
    Transaction.all.forEach((transaction, index) => DOM.addTransaction(transaction, index))
    DOM.updateTransaction()

    Storage.set(Transaction.all)
  },

  reload(){
    DOM.clearTransactions()
    App.init()
  }
}

App.init()

/* Teste com array */
// Transaction.add({
//   id: 5,
//   description: 'Alo',
//   amount: 200,
//   date: '23/01/2021'
// })

// Transaction.remove(2)