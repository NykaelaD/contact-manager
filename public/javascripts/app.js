class View {
  constructor() {
    this.contactManagerHome = document.querySelector('h1');

    this.navAndInfo = document.querySelector("#nav-and-info");
    this.searchBar = document.querySelector('#search-bar');

    this.addContactButtonNav = document.querySelector('form');
    this.addContactButtonInfo = document.querySelector('#add-contact-button-info');

    this.modalLayer = document.querySelector("#modal-layer");
    this.modal = document.querySelector("#modal");

    this.newContactForm = document.querySelector("#new-contact-form")
    this.cancelButton = document.querySelector("input[value='Cancel']");
    this.submitButton = document.querySelector("input[value='Submit']");

    this.nameEntry = this.newContactForm.querySelector('#full_name');
    this.emailEntry = this.newContactForm.querySelector('#email');
    this.phoneEntry = this.newContactForm.querySelector('#phone_number');

    this.noContactPlaceholder = document.querySelector("#no-contacts-placeholder")
    this.contactTemplateScript = document.querySelector('#contact-template');
    
    this.contactDiv = document.querySelector('#contacts');
    this.newContactForm = document.querySelector('#new-contact-form');
    this.tags = document.querySelector('#tags');
  }

  displayContacts(contacts) {
    this._hideContactPlaceholder();
    this.removePreviousContacts();

    contacts.forEach(contact => {
      if (!Array.isArray(contact.tags)) {
        contact.tags = contact.tags.split(',').map(tag => tag.trim());
      }
    });

    let contactTemplate = Handlebars.compile(this.contactTemplateScript.innerHTML);
    let tagPartialEl = document.querySelector('#tag');
    Handlebars.registerPartial('tag', tagPartialEl.innerHTML);
    this.contactDiv.insertAdjacentHTML('beforeend', contactTemplate({contact: contacts}));

    if (contacts.length === 0) {
      this._displayContactPlaceholder();
    } 
  }

  removePreviousContacts = () => {
    let divs = this.contactDiv.querySelectorAll('div');
    divs.forEach(div => {
      this.contactDiv.removeChild(div);
    });
  }

  bindContactManagerHome = (handler) => {
    this.contactManagerHome.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  bindSearch(handler) {
    this.searchBar.addEventListener('keyup', e => {
      if (e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'z') {
        let input = this.searchBar.value;
        handler(input);
      }
    });
  }

  bindDisplayContactForm(handler) {
    this.addContactButtonNav.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });

    this.addContactButtonInfo.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  bindHideContactForm(handler) {
    this.modalLayer.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });

    this.cancelButton.addEventListener('click', e => {
      e.preventDefault();
      handler();
    });
  }

  bindSelectTag(handler) {
    this.contactDiv.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.tagName === 'A') {
        let tag = e.target.getAttribute('href');
        handler(tag);
      }
    });
  }

  bindAddContact(handler) {
    this.newContactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!this.newContactForm.classList.contains('edit')) {
        let data = new FormData(this.newContactForm);
        data = Object.fromEntries(data);
        handler(data);
      }
    });
  }

  bindDeleteContact(handler) {
    this.contactDiv.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.value === 'Delete') {
        let id = e.target.closest('div').id;
        if (window.confirm('Are you sure you want to delete this contact?')) {
          handler(id);
        }
      }
    });
  }

  bindEditContactForm(handler) {
    this.contactDiv.addEventListener('click', e => {
      e.preventDefault();
      if (e.target.value === 'Edit') {
        let id = e.target.closest('.contact').id;
        this.newContactForm.classList.add('edit');
        this.newContactForm.setAttribute('contact', String(id));
        handler(id);
      }
    });
  }

  bindUpdateContact(handler) {
    this.newContactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (this.newContactForm.classList.contains('edit')) {
        let data = new FormData(this.newContactForm);
        data = Object.fromEntries(data);
        
        let id = this.newContactForm.getAttribute('contact');
        handler(id, data);
      }
    });
  }

  resetContactForm() {
    this.newContactForm.classList.remove('edit');
    this.newContactForm.removeAttribute('contact');
  }

  invalidEntryDisplay(invalidEntries, data) {
    let message = '';

    let determineEmailIssue = () => {
      if (data.email.match(/@[a-zA-Z0-9]+\.[a-z]+/gm)) {
        return 'Please enter text before the @ sign in your email. ';
      } else if (data.email.match(/[a-zA-Z0-9]+\.[a-z]+/gm)) {
        return 'Please include an @ sign in your email. ';
      } else if (data.email.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+/gm) || 
                  data.email.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\./gm)) {
        return 'Please include a domain extension in your email. ';
      } else if (data.email.match(/[a-zA-Z0-9]+/gm)) {
        return 'Please include an @ sign and domain extension in your email. ';
      } else if (data.email.length === 0) {
        return 'Please enter a valid email. ';
      }
    }

    invalidEntries.forEach(invalidEntry => {
      if (invalidEntry === 'full_name') {
        message += 'Please enter a valid name. ';
      } else if (invalidEntry === 'email') {
        let issue = determineEmailIssue();
        message += issue;
      } else if (invalidEntry === 'phone_number') {
        message += 'Please enter a valid phone number. ';
      }
    })

    alert(message);
  }

  showForm(defaultData) {
    this.modalLayer.classList.replace("hide", "show");
    this.modal.classList.replace("hide", "show");
    this.navAndInfo.classList.replace("show", "hide");

    if (defaultData) {
      this.nameEntry.defaultValue = defaultData.full_name;
      this.emailEntry.defaultValue = defaultData.email;
      this.phoneEntry.defaultValue = defaultData.phone_number;
    } 
  }

  hideForm() {
    this.modalLayer.classList.replace("show", "hide");
    this.modal.classList.replace("show", "hide");
    this.navAndInfo.classList.replace("hide", "show");
    this.newContactForm.reset();

    this.nameEntry.defaultValue = ''; 
    this.emailEntry.defaultValue = '';
    this.phoneEntry.defaultValue = '';
  }

  _displayContactPlaceholder() {
    this.noContactPlaceholder.classList.replace("hide", "show");
  }

  _hideContactPlaceholder() {
    this.noContactPlaceholder.classList.replace("show", "hide");
  }
}

class Model {
  constructor() {
    this.contacts = []
    this.contact;
  }

  filterContactsSearch(input) {
    return this.contacts.filter(({full_name}) => {
      input = input.toLowerCase();
      full_name = full_name.toLowerCase().split('').slice(0, input.length).join('');
      return full_name === input;
    });
  }

  filterContactsTag(tag) {
    return this.contacts.filter(({tags}) => {
      return tags.includes(tag);
    });
  }

  async getContacts() {
    await fetch('http://localhost:3000/api/contacts')
      .then(response => response.json())
      .then(jsonRes => this.contacts = jsonRes);
  }

  async addContact(data) {
    await fetch('http://localhost:3000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json())
      .then(jsonRes => this.contacts.push(jsonRes));
  }

  async deleteContact(deleteID) {
    await fetch(`http://localhost:3000/api/contacts/${String(deleteID)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteID }),
    }).then(() => this.getContacts());
  }  

  async updateContact(id, newData) {
    await fetch(`http://localhost:3000/api/contacts/${String(id)}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    }).then(() => this.getContacts());
  }

  async getContact(id) {
    await fetch(`http://localhost:3000/api/contacts/${String(id)}`)
      .then(response => response.json())
      .then(jsonData => this.contact = jsonData);
  }

  validEntries(data) {
    let invalidEntries = []

    data.full_name.length > 0 ? true : invalidEntries.push('full_name');
    data.email.match(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/gm) ? true : invalidEntries.push('email');
    data.phone_number.length > 0 ? true : invalidEntries.push('phone_number');

    return invalidEntries;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view 
    this.bindEvents();
    this.initializeContacts();
  }

  async bindEvents() {
    this.view.bindDisplayContactForm(this.handleDisplayContactForm);
    this.view.bindHideContactForm(this.handleRemoveContactForm);
    this.view.bindAddContact(this.handleAddContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindEditContactForm(this.handleEditContactForm);
    this.view.bindUpdateContact(this.handleUpdateContact);
    this.view.bindSearch(this.handleSearch);
    this.view.bindSelectTag(this.handleSelectTag);
    this.view.bindContactManagerHome(this.initializeContacts);
  }

  onContactListChange(contacts) {
    this.view.displayContacts(contacts);
  }

  initializeContacts = async() => {
    await this.model.getContacts()
    this.view.displayContacts(this.model.contacts);
  }

  handleDisplayContactForm = () => {
    this.view.showForm();
  }

  handleRemoveContactForm = () => {
    this.view.hideForm();
  }

  handleSearch = (input) => {
    let filteredContacts = this.model.filterContactsSearch(input);
    this.view.displayContacts(filteredContacts);
  }

  handleAddContact = async (data) => {
    let invalidEntries = this.model.validEntries(data);
    if (invalidEntries.length === 0) {
      await this.model.addContact(data);
      this.handleRemoveContactForm();
      this.onContactListChange(this.model.contacts);
    } else {
      this.view.invalidEntryDisplay(invalidEntries, data);
    }
  }

  handleDeleteContact = async(id) => {
    await this.model.deleteContact(id);
    this.onContactListChange(this.model.contacts);
  }

  handleEditContactForm = async(id) => {
    await this.model.getContact(id);
    this.view.showForm(this.model.contact);
  }

  handleUpdateContact = async(id, newData) => {
    let invalidEntries = this.model.validEntries(newData);
    if (invalidEntries.length === 0) {
      await this.model.updateContact(id, newData);
      this.view.resetContactForm();
      this.handleRemoveContactForm();
      this.onContactListChange(this.model.contacts);
    } else { 
      this.view.invalidEntryDisplay(invalidEntries, newData);
    }
  }

  handleSelectTag = (tag) => {
    let filteredContacts = this.model.filterContactsTag(tag);
    this.view.displayContacts(filteredContacts);
  }
}

new Controller(new Model(), new View());