export const saveNote = async (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

export const getNotes = async () => {
  const notes = localStorage.getItem("notes")
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

  return notes;
};
