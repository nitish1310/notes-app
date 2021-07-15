import React, { Component } from "react";
import moment from "moment";
import NoteForm from "./NoteForm";
import NotesListMenu from "./NotesListMenu";
import { Route, Link, withRouter } from "react-router-dom";
import { Redirect } from "react-router";
class NotesApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      selectedNote: null,
      editMode: false,
      redirect: false,
    };

    this.getNotesNextId = this.getNotesNextId.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openEditNote = this.openEditNote.bind(this);
    this.saveEditedNote = this.saveEditedNote.bind(this);
    this.cancelNote = this.cancelNote.bind(this);
    this.newNote = this.newNote.bind(this);
  }

  async componentDidMount() {
    this.setState({ notes: await this.props.service.getNotes() });
  }

  getNotesNextId() {
    return this.state.notes.length > 0
      ? this.state.notes[this.state.notes.length - 1].id + 1
      : 0;
  }

  async persistNotes(notes) {
    await this.props.service.saveNote(notes);
    this.setState({ notes: notes });
  }

  addNote(note) {
    note.id = this.getNotesNextId();
    note.date = moment();
    const notes = this.state.notes;

    notes.push(note);

    this.persistNotes(notes);
    this.setState({ selectedNote: null, editMode: false });
    this.props.history.goBack();
  }

  openEditNote(id) {
    const notePosition = this.state.notes.findIndex((n) => n.id === id);
    if (notePosition >= 0) {
      this.setState({
        selectedNote: this.state.notes[notePosition],
        editMode: true,
      });
    } else {
      console.warn(
        "note with id " + id + " not found when trying to open for edit"
      );
    }
  }

  saveEditedNote(note) {
    const notes = this.state.notes;
    const notePosition = notes.findIndex((n) => n.id === note.id);

    if (notePosition >= 0) {
      note.date = moment();
      notes[notePosition] = note;
      this.persistNotes(notes);
    } else {
      console.warn(
        "note with id " +
          note.id +
          " not found when trying to save the edited note"
      );
    }
    this.setState({ selectedNote: note, editMode: false });
    this.props.history.goBack();
  }

  cancelNote(id) {
    this.setState({ selectedNote: null, editMode: false });
    this.props.history.goBack();
  }

  getEmptyNote() {
    return {
      title: "",
      description: "",
    };
  }

  newNote() {
    this.props.history.push("/note");
  }

  renderLeftMenu() {
    return (
      <div className="card">
        {this.renderHeader()}
        <div className="card-body">
          <NotesListMenu
            notes={this.state.notes}
            editNote={this.openEditNote}
          />
        </div>
      </div>
    );
  }

  renderHeader() {
    const editMode = this.state.editMode;
    return (
      <>
        {!editMode ? (
          <div className="card-header">
            {["/"].map((path) => (
              <Route
                key={path}
                exact
                path={path}
                render={(routeProps) => (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.newNote}
                  >
                    New Note
                  </button>
                )}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </>
    );
  }

  setMainAreaRoutes() {
    const editMode = this.state.editMode;
    return (
      <div>
        <Route
          exact
          path="/note/:id"
          render={(routeProps) => (
            <NoteForm
              persistNote={this.saveEditedNote}
              cancelNote={this.cancelNote}
              note={this.state.selectedNote}
            />
          )}
        />

        <Route
          exact
          path="/note"
          render={(routeProps) => (
            <NoteForm
              persistNote={this.addNote}
              note={this.getEmptyNote()}
              cancelNote={this.cancelNote}
            />
          )}
        />
      </div>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }
    return (
      <div className="notesApp container-fluid">
        <div className="row">
          <div className="col-md-3">{this.renderLeftMenu()}</div>
          <div className="col-md-9">{this.setMainAreaRoutes()}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(NotesApp);
