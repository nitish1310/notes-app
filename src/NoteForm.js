import React, { Component } from "react";

const divStyle = {
  display: "none",
};

class NoteForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.saveNote = this.saveNote.bind(this);
    this.cancelNote = this.cancelNote.bind(this);
  }

  saveNote(event) {
    event.preventDefault();
    if (this.title.value === "") {
      alert("Title is needed");
    } else {
      const note = {
        id: Number(this.id.value),
        title: this.title.value,
        text: this.text.value,
      };
      this.props.persistNote(note);
    }
  }

  handleInputChange(event) {}

  cancelNote(event) {
    console.log("deleteNote");
    event.preventDefault();
    this.props.cancelNote();
  }

  renderFormTitleAction() {
    return this.props.note.id !== undefined ? "Edit Note" : "New Note";
  }

  renderFormButtons() {
    return (
      <div>
        <button type="submit" className="btn btn-success float-right">
          Save Note
        </button>
        <button onClick={this.cancelNote} className="btn btn-danger">
          Cancel
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">{this.renderFormTitleAction()}</div>
        <div className="card-body">
          <form ref="noteForm" onSubmit={this.saveNote}>
            <div className="form-group">
              <p>
                <input
                  className="form-control"
                  style={divStyle}
                  disabled
                  ref={(id) => (this.id = id)}
                  defaultValue={this.props.note.id}
                  onChange={this.handleInputChange}
                />
              </p>

              <p>
                <input
                  className="form-control"
                  ref={(title) => (this.title = title)}
                  defaultValue={this.props.note.title}
                  placeholder="enter title"
                  onChange={this.handleInputChange}
                />
              </p>

              <p>
                <textarea
                  className="form-control"
                  rows="10"
                  ref={(description) => (this.text = description)}
                  defaultValue={this.props.note.text}
                  placeholder="enter description"
                />
              </p>
            </div>
            {this.renderFormButtons()}
          </form>
        </div>
      </div>
    );
  }
}

export default NoteForm;
