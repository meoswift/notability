/* 
 * guggle keep 
 * author: linh tran
 * 
 * script.js
 * 
 * purpose: web application replicating google keep :) 
 *
 */

const logo = document.querySelector("#logo")

/* Select sidebar elements */
const sidebarList = document.querySelectorAll("#sidebar button")
const sidebar = document.querySelector("#sidebar");

/* Select notes elements */
const noteForm = document.getElementById("note-form")
const noteTemplate = document.getElementById("note-template")
const noteTitle = document.querySelector('[data-new-title]')
const noteContent = document.querySelector('[data-new-note]')
const notesContainer = document.getElementById("notes-area")

/* Use local storage to store which tab the user is on, default is notes */
const LOCAL_STORAGE_SELECTED_TAB_ID_KEY = 'tab.selectedId'
let selectedTabId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TAB_ID_KEY) || 
                    'notes'

const LOCAL_STORAGE_SELECTED_NOTES_ID_KEY = 'notes.id'
let notesList = 
JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_NOTES_ID_KEY)) || []

/* When an item on the side bar is clicked on, direct the user to that tab */
sidebar.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'button') {
      selectedTabId = e.target.id   
  }  
  save()
  render()
})

/* If user clickes the logo, redirects to Notes tab */
logo.addEventListener('click', () => {
    selectedTabId = 'notes'
    save()
    render()
})

/* function to get values from form and add a note to noteList */
noteForm.addEventListener('submit', e => {
  e.preventDefault()

  const title = noteTitle.value
  const content = noteContent.value
  
  if (title == null || title == ' ') return
  if (content == null || content == ' ') return;

  const note = createNote(title, content)
  notesList.push(note)
  console.log(notesList);
  
  noteTitle.value = null
  noteContent.value = null

  save()
  renderNotes()
})

let selectedNoteId = null
notesContainer.addEventListener('click', e => {
    if (e.target.id == 'delete') {
        selectedNoteId = e.target.parentNode.parentNode.id;
        notesList = notesList.filter(note => note.id != selectedNoteId)
    }

    save()
    renderNotes()
})

/* function to create a new note object */
function createNote(noteTitle, noteContent) {
  return {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent
  }
}

/* clear all elements in the container before re-rendering*/
function clear(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

/* save everything to local storage */
function save() {
  localStorage.setItem(LOCAL_STORAGE_SELECTED_TAB_ID_KEY, selectedTabId)
  localStorage.setItem(LOCAL_STORAGE_SELECTED_NOTES_ID_KEY, JSON.stringify(notesList))
}

/* render data to the user interface */
function render() {
  sidebarList.forEach(tab => {
      const pageId = tab.id + "-main"
      const currentTab = document.getElementById(pageId)

      if (tab.id == selectedTabId) {
          tab.classList.add("clicked")
          currentTab.classList.remove("hidden")
      } else {
          tab.classList.remove("clicked")
          currentTab.classList.add("hidden")
      }
  })
}

/* render notes tab separately */
function renderNotes() {
  clear(notesContainer)  
  notesList.forEach(note => {
      const noteElement = document.importNode(noteTemplate.content, true)
      const noteCard = noteElement.querySelector(".card")
      const noteTitle = noteElement.querySelector(".card-title")
      const noteContent = noteElement.querySelector(".card-text")

      noteCard.id = note.id
      noteTitle.append(note.title)
      noteContent.append(note.content)

      notesContainer.prepend(noteElement)
  })
}

render()
renderNotes()

console.log(notesList); /* debugging */
